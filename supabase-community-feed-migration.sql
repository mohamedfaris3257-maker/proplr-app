-- ============================================================
-- Migration: Community Feed — posts, likes, comments per community
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add community_id and is_announcement to posts
alter table posts add column if not exists community_id uuid references communities(id) on delete cascade;
alter table posts add column if not exists is_announcement boolean default false not null;
create index if not exists posts_community_id_idx on posts(community_id);

-- 2. Create post_likes table for tracking individual likes
create table if not exists post_likes (
  id         uuid primary key default uuid_generate_v4(),
  post_id    uuid references posts(id) on delete cascade not null,
  user_id    uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(post_id, user_id)
);
create index if not exists post_likes_post_id_idx on post_likes(post_id);
create index if not exists post_likes_user_id_idx on post_likes(user_id);
alter table post_likes enable row level security;
create policy "Auth users can view post_likes" on post_likes for select using (auth.role() = 'authenticated');
create policy "Users can insert own likes" on post_likes for insert with check (auth.uid() = user_id);
create policy "Users can delete own likes" on post_likes for delete using (auth.uid() = user_id);

-- 3. Add community_id to events (optional, for community-specific events)
alter table events add column if not exists community_id uuid references communities(id) on delete set null;
create index if not exists events_community_id_idx on events(community_id);

-- 4. Add comments_count to posts for quick display
alter table posts add column if not exists comments_count integer default 0 not null;

-- 5. Create a function to keep likes_count in sync
create or replace function update_post_likes_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update posts set likes_count = likes_count + 1 where id = NEW.post_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update posts set likes_count = likes_count - 1 where id = OLD.post_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists post_likes_count_trigger on post_likes;
create trigger post_likes_count_trigger
after insert or delete on post_likes
for each row execute function update_post_likes_count();

-- 6. Create a function to keep comments_count in sync
create or replace function update_post_comments_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update posts set comments_count = comments_count + 1 where id = NEW.post_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update posts set comments_count = comments_count - 1 where id = OLD.post_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists post_comments_count_trigger on comments;
create trigger post_comments_count_trigger
after insert or delete on comments
for each row execute function update_post_comments_count();
