-- ============================================================
-- Proplr App — Full Supabase SQL Migration
-- UAE Student Career Development Platform
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- TYPES / ENUMS
-- ============================================================

create type user_type as enum ('school_student', 'uni_student', 'admin');
create type subscription_status as enum ('free', 'premium');
create type pillar_hour_status as enum ('pending', 'approved', 'rejected');
create type application_status as enum ('applied', 'reviewing', 'interview', 'accepted', 'rejected');
create type opportunity_type as enum (
  'internship', 'job', 'challenge', 'job_shadowing', 'volunteering', 'micro_placement'
);
create type audience_type as enum ('school', 'uni', 'both');
create type item_type as enum ('post', 'event', 'opportunity');

-- ============================================================
-- TABLE: profiles
-- ============================================================

create table if not exists profiles (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid references auth.users(id) on delete cascade not null unique,
  name                 text not null,
  email                text not null,
  type                 user_type not null,
  school_name          text,
  grade                text,
  photo_url            text,
  career_interests     text[] default '{}',
  subscription_status  subscription_status default 'free' not null,
  subscription_end_date date,
  is_ambassador        boolean default false not null,
  created_at           timestamptz default now() not null
);

-- Indexes
create index profiles_user_id_idx on profiles(user_id);
create index profiles_type_idx on profiles(type);

-- RLS
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = user_id);

create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.user_id = auth.uid() and p.type = 'admin'
    )
  );

-- ============================================================
-- TABLE: posts
-- ============================================================

create table if not exists posts (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  content     text not null,
  image_url   text,
  pillar_tag  text check (pillar_tag in (
    'Leadership', 'Entrepreneurship', 'Digital Literacy',
    'Personal Branding', 'Communication', 'Project Management'
  )),
  likes_count integer default 0 not null,
  created_at  timestamptz default now() not null
);

create index posts_user_id_idx on posts(user_id);
create index posts_created_at_idx on posts(created_at desc);
create index posts_pillar_tag_idx on posts(pillar_tag);

alter table posts enable row level security;

create policy "Authenticated users can view posts"
  on posts for select
  using (auth.role() = 'authenticated');

create policy "Users can create own posts"
  on posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on posts for update
  using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on posts for delete
  using (auth.uid() = user_id);

create policy "Admins can manage all posts"
  on posts for all
  using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin')
  );

-- ============================================================
-- TABLE: events
-- ============================================================

create table if not exists events (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  description     text not null,
  date            date not null,
  time            time not null,
  location        text,
  online_link     text,
  pillar_tag      text check (pillar_tag in (
    'Leadership', 'Entrepreneurship', 'Digital Literacy',
    'Personal Branding', 'Communication', 'Project Management'
  )),
  event_type      text not null default 'Workshop',
  audience        audience_type not null default 'both',
  capacity        integer,
  spots_remaining integer,
  is_paid         boolean default false not null,
  price           numeric(8,2),
  created_at      timestamptz default now() not null
);

create index events_date_idx on events(date asc);
create index events_audience_idx on events(audience);
create index events_pillar_tag_idx on events(pillar_tag);

alter table events enable row level security;

create policy "Authenticated users can view events"
  on events for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage events"
  on events for all
  using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin')
  );

-- ============================================================
-- TABLE: rsvps
-- ============================================================

create table if not exists rsvps (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  event_id   uuid references events(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, event_id)
);

create index rsvps_user_id_idx on rsvps(user_id);
create index rsvps_event_id_idx on rsvps(event_id);

alter table rsvps enable row level security;

create policy "Users can view own RSVPs"
  on rsvps for select
  using (auth.uid() = user_id);

create policy "Users can create own RSVPs"
  on rsvps for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own RSVPs"
  on rsvps for delete
  using (auth.uid() = user_id);

create policy "Admins can view all RSVPs"
  on rsvps for select
  using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin')
  );

-- ============================================================
-- TABLE: opportunities
-- ============================================================

create table if not exists opportunities (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  company      text not null,
  description  text not null,
  type         opportunity_type not null,
  pillar_tags  text[] default '{}',
  audience     audience_type not null default 'both',
  deadline     date,
  is_active    boolean default true not null,
  created_at   timestamptz default now() not null
);

create index opportunities_type_idx on opportunities(type);
create index opportunities_audience_idx on opportunities(audience);
create index opportunities_is_active_idx on opportunities(is_active);
create index opportunities_created_at_idx on opportunities(created_at desc);

alter table opportunities enable row level security;

create policy "Authenticated users can view active opportunities"
  on opportunities for select
  using (auth.role() = 'authenticated' and is_active = true);

create policy "Admins can manage opportunities"
  on opportunities for all
  using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin')
  );

-- ============================================================
-- TABLE: saved_items
-- ============================================================

create table if not exists saved_items (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  item_id    uuid not null,
  item_type  item_type not null,
  created_at timestamptz default now() not null,
  unique(user_id, item_id, item_type)
);

create index saved_items_user_id_idx on saved_items(user_id);

alter table saved_items enable row level security;

create policy "Users can manage own saved items"
  on saved_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- TABLE: pillar_hours
-- ============================================================

create table if not exists pillar_hours (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  pillar_name text not null check (pillar_name in (
    'Leadership', 'Entrepreneurship', 'Digital Literacy',
    'Personal Branding', 'Communication', 'Project Management'
  )),
  hours       numeric(5,1) not null check (hours > 0),
  source      text not null,
  status      pillar_hour_status default 'pending' not null,
  created_at  timestamptz default now() not null
);

create index pillar_hours_user_id_idx on pillar_hours(user_id);
create index pillar_hours_status_idx on pillar_hours(status);
create index pillar_hours_pillar_name_idx on pillar_hours(pillar_name);

alter table pillar_hours enable row level security;

create policy "Users can view own pillar hours"
  on pillar_hours for select
  using (auth.uid() = user_id);

create policy "Users can submit pillar hours"
  on pillar_hours for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage all pillar hours"
  on pillar_hours for all
  using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin')
  );

-- ============================================================
-- TABLE: certificates
-- ============================================================

create table if not exists certificates (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  pillar_name  text not null check (pillar_name in (
    'Leadership', 'Entrepreneurship', 'Digital Literacy',
    'Personal Branding', 'Communication', 'Project Management'
  )),
  issued_at    timestamptz default now() not null,
  khda_attested boolean default false not null,
  unique(user_id, pillar_name)
);

create index certificates_user_id_idx on certificates(user_id);

alter table certificates enable row level security;

create policy "Users can view own certificates"
  on certificates for select
  using (auth.uid() = user_id);

create policy "Admins can manage certificates"
  on certificates for all
  using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin')
  );

-- ============================================================
-- TABLE: applications
-- ============================================================

create table if not exists applications (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  opportunity_id  uuid references opportunities(id) on delete cascade not null,
  status          application_status default 'applied' not null,
  created_at      timestamptz default now() not null,
  unique(user_id, opportunity_id)
);

create index applications_user_id_idx on applications(user_id);
create index applications_opportunity_id_idx on applications(opportunity_id);
create index applications_status_idx on applications(status);

alter table applications enable row level security;

create policy "Users can view own applications"
  on applications for select
  using (auth.uid() = user_id);

create policy "Users can create applications"
  on applications for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage all applications"
  on applications for all
  using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin')
  );

-- ============================================================
-- STORAGE BUCKET: profile-photos
-- ============================================================

-- Run this in the Supabase dashboard > Storage, or via API:
-- insert into storage.buckets (id, name, public) values ('profile-photos', 'profile-photos', true);

-- Storage RLS policies (run after creating bucket):
-- create policy "Users can upload own photo"
--   on storage.objects for insert
--   with check (bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]);
--
-- create policy "Anyone can view profile photos"
--   on storage.objects for select
--   using (bucket_id = 'profile-photos');

-- ============================================================
-- SEED: Admin account (run after creating user in Auth)
-- Replace 'YOUR_ADMIN_USER_UUID' with the actual UUID from auth.users
-- ============================================================

-- insert into profiles (user_id, name, email, type, subscription_status, is_ambassador)
-- values (
--   'YOUR_ADMIN_USER_UUID',
--   'Proplr Admin',
--   'admin@proplr.ae',
--   'admin',
--   'premium',
--   false
-- );

-- ============================================================
-- SAMPLE DATA (optional — for development)
-- ============================================================

-- Sample events
insert into events (title, description, date, time, location, pillar_tag, event_type, audience, capacity, spots_remaining, is_paid)
values
  (
    'Leadership Masterclass with UAE CEOs',
    'Join us for an inspiring masterclass with top CEOs across the UAE. Learn what it takes to lead in the 21st century.',
    current_date + interval '7 days',
    '10:00',
    'Dubai International Financial Centre',
    'Leadership',
    'Workshop',
    'both',
    100,
    67,
    false
  ),
  (
    'Entrepreneurship Bootcamp',
    'A two-day intensive bootcamp to help you take your startup idea from zero to pitch-ready.',
    current_date + interval '14 days',
    '09:00',
    null,
    'Entrepreneurship',
    'Workshop',
    'uni',
    50,
    23,
    true
  ),
  (
    'Digital Skills for the Future',
    'Explore AI, data science, and digital literacy skills that employers are looking for in 2025 and beyond.',
    current_date + interval '3 days',
    '18:00',
    null,
    'Digital Literacy',
    'Webinar',
    'both',
    500,
    312,
    false
  );

-- Sample opportunities
insert into opportunities (title, company, description, type, pillar_tags, audience, deadline, is_active)
values
  (
    'Summer Tech Internship 2025',
    'Microsoft UAE',
    'Join Microsoft for a 6-week summer internship where you will work on real-world tech projects alongside experienced engineers.',
    'internship',
    array['Digital Literacy', 'Project Management'],
    'uni',
    (current_date + interval '30 days')::date,
    true
  ),
  (
    'UAE Youth Innovation Challenge',
    'UAE Ministry of Economy',
    'Present your innovative solution to a real-world economic challenge. Winners receive AED 50,000 in funding.',
    'challenge',
    array['Entrepreneurship', 'Leadership'],
    'both',
    (current_date + interval '21 days')::date,
    true
  ),
  (
    'Job Shadow at PwC',
    'PwC Middle East',
    'Spend a week shadowing professionals at PwC and get a real insight into life in professional services.',
    'job_shadowing',
    array['Business', 'Finance', 'Personal Branding'],
    'school',
    (current_date + interval '14 days')::date,
    true
  ),
  (
    'Community Volunteer Programme',
    'Dubai Cares',
    'Make a difference in your community through our structured volunteering programme. Earn verified pillar hours.',
    'volunteering',
    array['Leadership', 'Communication'],
    'both',
    null,
    true
  );

-- Sample posts
insert into posts (user_id, content, pillar_tag, likes_count)
select
  id,
  'Just completed the Proplr Leadership module! The frameworks for decision-making under pressure are incredibly practical. Highly recommend for anyone looking to step up.',
  'Leadership',
  24
from auth.users limit 1;
