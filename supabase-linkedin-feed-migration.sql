-- ============================================================
-- Migration: LinkedIn-style Feed — reactions, messaging, realtime
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Post Reactions table (replaces simple likes for emoji reactions)
create table if not exists post_reactions (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid references posts(id) on delete cascade not null,
  user_id    uuid references auth.users(id) on delete cascade not null,
  reaction   text not null check (reaction in ('like','love','celebrate','insightful','support','curious')),
  created_at timestamptz default now() not null,
  unique(post_id, user_id)
);

create index if not exists post_reactions_post_id_idx on post_reactions(post_id);
create index if not exists post_reactions_user_id_idx on post_reactions(user_id);

alter table post_reactions enable row level security;

create policy "Reactions viewable by authenticated"
  on post_reactions for select using (auth.role() = 'authenticated');

create policy "Users can react to posts"
  on post_reactions for insert with check (auth.uid() = user_id);

create policy "Users can change their reaction"
  on post_reactions for update using (auth.uid() = user_id);

create policy "Users can remove their reaction"
  on post_reactions for delete using (auth.uid() = user_id);

-- 2. Conversations table
create table if not exists conversations (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null
);

alter table conversations enable row level security;

-- 3. Conversation participants
create table if not exists conversation_participants (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  user_id         uuid references auth.users(id) on delete cascade not null,
  last_read_at    timestamptz,
  unique(conversation_id, user_id)
);

alter table conversation_participants enable row level security;

-- 4. Messages table
create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id       uuid references auth.users(id) on delete cascade not null,
  content         text not null,
  read            boolean default false not null,
  created_at      timestamptz default now() not null
);

alter table messages enable row level security;

-- 5. RLS policies for messaging
create policy "Participants can view conversations"
  on conversations for select using (
    exists (
      select 1 from conversation_participants
      where conversation_id = conversations.id and user_id = auth.uid()
    )
  );

create policy "Participants can create conversations"
  on conversations for insert with check (true);

create policy "Participants can view their participations"
  on conversation_participants for select using (auth.uid() = user_id);

create policy "Users can join conversations"
  on conversation_participants for insert with check (auth.uid() = user_id);

create policy "Participants can update read status"
  on conversation_participants for update using (auth.uid() = user_id);

create policy "Participants can view messages"
  on messages for select using (
    exists (
      select 1 from conversation_participants
      where conversation_id = messages.conversation_id and user_id = auth.uid()
    )
  );

create policy "Participants can send messages"
  on messages for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from conversation_participants
      where conversation_id = messages.conversation_id and user_id = auth.uid()
    )
  );

-- 6. Indexes for messaging
create index if not exists messages_conversation_id_idx on messages(conversation_id);
create index if not exists messages_sender_id_idx on messages(sender_id);
create index if not exists messages_created_at_idx on messages(created_at desc);
create index if not exists cp_user_id_idx on conversation_participants(user_id);
create index if not exists cp_conversation_id_idx on conversation_participants(conversation_id);

-- 7. Trigger to sync reaction count to posts.likes_count
create or replace function sync_reactions_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update posts set likes_count = (
      select count(*) from post_reactions where post_id = NEW.post_id
    ) where id = NEW.post_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update posts set likes_count = (
      select count(*) from post_reactions where post_id = OLD.post_id
    ) where id = OLD.post_id;
    return OLD;
  elsif (TG_OP = 'UPDATE') then
    -- reaction type changed, count stays same
    return NEW;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists post_reactions_count_trigger on post_reactions;
create trigger post_reactions_count_trigger
after insert or delete on post_reactions
for each row execute function sync_reactions_count();

-- 8. Enable realtime for messaging and notifications
-- (Run these if not already enabled)
-- alter publication supabase_realtime add table messages;
-- alter publication supabase_realtime add table notifications;
