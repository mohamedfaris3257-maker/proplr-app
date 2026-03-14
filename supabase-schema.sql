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

-- ============================================================
-- PHASE 2 ADDITIONS (ALTER TABLE + NEW TABLES)
-- ============================================================

-- ------------------------------------------------------------
-- ALTER TABLE: Missing columns in existing tables
-- ------------------------------------------------------------

-- posts
alter table posts add column if not exists is_pinned boolean default false not null;
alter table posts add column if not exists comment_count integer default 0 not null;

-- rsvps
alter table rsvps add column if not exists waitlisted boolean default false not null;
alter table rsvps add column if not exists waitlist_position integer;

-- events
alter table events add column if not exists is_featured boolean default false not null;
alter table events add column if not exists is_public boolean default false not null;

-- profiles
alter table profiles add column if not exists username text unique;
alter table profiles add column if not exists dibz_discount_active boolean default false not null;
alter table profiles add column if not exists referral_code text unique;
alter table profiles add column if not exists points integer default 0 not null;

-- applications
alter table applications add column if not exists cover_text text;
alter table applications add column if not exists portfolio_item_id uuid;

-- pillar_hours
alter table pillar_hours add column if not exists rejection_note text;

-- certificates
alter table certificates add column if not exists pdf_url text;

-- ------------------------------------------------------------
-- NEW TABLE: comments
-- ------------------------------------------------------------

create table if not exists comments (
  id         uuid primary key default uuid_generate_v4(),
  post_id    uuid references posts(id) on delete cascade not null,
  user_id    uuid references auth.users(id) on delete cascade not null,
  content    text not null,
  created_at timestamptz default now() not null
);
create index if not exists comments_post_id_idx on comments(post_id);
create index if not exists comments_user_id_idx on comments(user_id);
alter table comments enable row level security;
create policy "Authenticated users can view comments" on comments for select using (auth.role() = 'authenticated');
create policy "Users can insert own comments" on comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments" on comments for delete using (auth.uid() = user_id);
create policy "Admins can manage comments" on comments for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

-- ------------------------------------------------------------
-- NEW TABLE: notifications
-- ------------------------------------------------------------

create type notification_type as enum ('event','rsvp','waitlist','application','certificate','badge','hours','comment','general','task');
create table if not exists notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  type       notification_type not null default 'general',
  title      text not null,
  message    text not null,
  is_read    boolean default false not null,
  link       text,
  created_at timestamptz default now() not null
);
create index if not exists notifications_user_id_idx on notifications(user_id);
create index if not exists notifications_is_read_idx on notifications(is_read);
alter table notifications enable row level security;
create policy "Users can view own notifications" on notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on notifications for update using (auth.uid() = user_id);
create policy "Admins can manage notifications" on notifications for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));
create policy "Service role can insert notifications" on notifications for insert with check (true);

-- ------------------------------------------------------------
-- NEW TABLE: badges
-- ------------------------------------------------------------

create type badge_type as enum ('first_post','explorer','on_fire','networker','pioneer','achiever','all_star','ambassador');
create table if not exists badges (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  badge_type badge_type not null,
  earned_at  timestamptz default now() not null,
  unique(user_id, badge_type)
);
create index if not exists badges_user_id_idx on badges(user_id);
alter table badges enable row level security;
create policy "Users can view own badges" on badges for select using (auth.uid() = user_id);
create policy "Admins can manage badges" on badges for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));
create policy "Service role can insert badges" on badges for insert with check (true);

-- ------------------------------------------------------------
-- NEW TABLE: streaks
-- ------------------------------------------------------------

create table if not exists streaks (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users(id) on delete cascade not null,
  pillar_name         text not null check (pillar_name in ('Leadership','Entrepreneurship','Digital Literacy','Personal Branding','Communication','Project Management')),
  current_streak      integer default 0 not null,
  longest_streak      integer default 0 not null,
  last_activity_date  date,
  unique(user_id, pillar_name)
);
create index if not exists streaks_user_id_idx on streaks(user_id);
alter table streaks enable row level security;
create policy "Users can view own streaks" on streaks for select using (auth.uid() = user_id);
create policy "Service role can manage streaks" on streaks for all with check (true);

-- ------------------------------------------------------------
-- NEW TABLE: portfolio_items
-- ------------------------------------------------------------

create table if not exists portfolio_items (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  description text not null default '',
  media_url   text,
  pillar_tag  text check (pillar_tag in ('Leadership','Entrepreneurship','Digital Literacy','Personal Branding','Communication','Project Management')),
  is_pinned   boolean default false not null,
  created_at  timestamptz default now() not null
);
create index if not exists portfolio_items_user_id_idx on portfolio_items(user_id);
alter table portfolio_items enable row level security;
create policy "Users can manage own portfolio" on portfolio_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Public can view portfolio items" on portfolio_items for select using (true);

-- ------------------------------------------------------------
-- NEW TABLE: newsletter_subscribers
-- ------------------------------------------------------------

create table if not exists newsletter_subscribers (
  id             uuid primary key default uuid_generate_v4(),
  email          text not null unique,
  type           text not null default 'public' check (type in ('public','student','parent')),
  subscribed_at  timestamptz default now() not null
);
alter table newsletter_subscribers enable row level security;
create policy "Anyone can subscribe" on newsletter_subscribers for insert with check (true);
create policy "Admins can manage subscribers" on newsletter_subscribers for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

-- ------------------------------------------------------------
-- NEW TABLE: student_registrations
-- ------------------------------------------------------------

create type registration_status as enum ('pending','approved','rejected');
create table if not exists student_registrations (
  id                uuid primary key default uuid_generate_v4(),
  full_name         text not null,
  email             text not null,
  date_of_birth     date,
  nationality       text,
  school_name       text,
  grade             text,
  class_name        text,
  parent_name       text,
  parent_email      text,
  parent_phone      text,
  parental_consent  boolean default false not null,
  photo_url         text,
  interests         text[] default '{}',
  extracurriculars  text,
  how_heard         text,
  promo_code        text,
  referred_by       text,
  status            registration_status default 'pending' not null,
  rejection_reason  text,
  created_at        timestamptz default now() not null
);
create index if not exists student_registrations_status_idx on student_registrations(status);
create index if not exists student_registrations_email_idx on student_registrations(email);
alter table student_registrations enable row level security;
create policy "Anyone can register" on student_registrations for insert with check (true);
create policy "Admins can manage registrations" on student_registrations for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

-- ------------------------------------------------------------
-- NEW TABLE: pricing_plans
-- ------------------------------------------------------------

create table if not exists pricing_plans (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null unique,
  description     text,
  price_aed       numeric(10,2) not null,
  billing_type    text not null default 'flat' check (billing_type in ('flat','monthly')),
  duration_months integer not null default 8,
  features        text[] default '{}',
  stripe_price_id text,
  is_active       boolean default true not null,
  created_at      timestamptz default now() not null
);
alter table pricing_plans enable row level security;
create policy "Anyone can view active plans" on pricing_plans for select using (is_active = true);
create policy "Admins can manage plans" on pricing_plans for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

-- Seed pricing plans
insert into pricing_plans (name, description, price_aed, billing_type, duration_months, features) values
('Foundation', 'Perfect for school students beginning their career journey', 3200, 'monthly', 8, array['Access to all 6 pillar modules','Event attendance & RSVP','Portfolio builder','Pillar hours tracking','Digital certificate','Community access','Foundation badge']),
('Impact', 'For university students ready to accelerate their career', 999, 'flat', 8, array['Everything in Foundation','Priority event access','1-on-1 mentorship session','LinkedIn optimization','Internship placement support','Impact certificate','All-Star badge eligibility']);

-- ------------------------------------------------------------
-- NEW TABLE: promo_codes
-- ------------------------------------------------------------

create table if not exists promo_codes (
  id              uuid primary key default uuid_generate_v4(),
  code            text not null unique,
  discount_type   text not null default 'percentage' check (discount_type in ('percentage','fixed')),
  discount_value  numeric(10,2) not null,
  usage_limit     integer,
  usage_count     integer default 0 not null,
  expires_at      timestamptz,
  is_active       boolean default true not null,
  created_at      timestamptz default now() not null
);
alter table promo_codes enable row level security;
create policy "Anyone can look up promo codes" on promo_codes for select using (is_active = true);
create policy "Admins can manage promo codes" on promo_codes for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

-- ------------------------------------------------------------
-- NEW TABLES: courses, course_modules, quizzes, quiz_questions,
--             quiz_options, student_course_progress, quiz_submissions
-- ------------------------------------------------------------

create table if not exists courses (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text not null default '',
  pillar_tag  text check (pillar_tag in ('Leadership','Entrepreneurship','Digital Literacy','Personal Branding','Communication','Project Management')),
  audience    text not null default 'both' check (audience in ('school','uni','both')),
  cover_url   text,
  is_active   boolean default true not null,
  sort_order  integer default 0,
  created_at  timestamptz default now() not null
);
alter table courses enable row level security;
create policy "Auth users can view active courses" on courses for select using (auth.role() = 'authenticated' and is_active = true);
create policy "Admins can manage courses" on courses for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create table if not exists course_modules (
  id          uuid primary key default uuid_generate_v4(),
  course_id   uuid references courses(id) on delete cascade not null,
  title       text not null,
  content     text not null default '',
  video_url   text,
  sort_order  integer default 0 not null,
  created_at  timestamptz default now() not null
);
create index if not exists course_modules_course_id_idx on course_modules(course_id);
alter table course_modules enable row level security;
create policy "Auth users can view modules" on course_modules for select using (auth.role() = 'authenticated');
create policy "Admins can manage modules" on course_modules for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create table if not exists quizzes (
  id          uuid primary key default uuid_generate_v4(),
  module_id   uuid references course_modules(id) on delete cascade not null unique,
  pass_score  integer default 80 not null,
  created_at  timestamptz default now() not null
);
alter table quizzes enable row level security;
create policy "Auth users can view quizzes" on quizzes for select using (auth.role() = 'authenticated');
create policy "Admins can manage quizzes" on quizzes for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create table if not exists quiz_questions (
  id          uuid primary key default uuid_generate_v4(),
  quiz_id     uuid references quizzes(id) on delete cascade not null,
  question    text not null,
  sort_order  integer default 0 not null,
  created_at  timestamptz default now() not null
);
create index if not exists quiz_questions_quiz_id_idx on quiz_questions(quiz_id);
alter table quiz_questions enable row level security;
create policy "Auth users can view questions" on quiz_questions for select using (auth.role() = 'authenticated');
create policy "Admins can manage questions" on quiz_questions for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create table if not exists quiz_options (
  id           uuid primary key default uuid_generate_v4(),
  question_id  uuid references quiz_questions(id) on delete cascade not null,
  option_text  text not null,
  is_correct   boolean default false not null,
  sort_order   integer default 0 not null
);
create index if not exists quiz_options_question_id_idx on quiz_options(question_id);
alter table quiz_options enable row level security;
create policy "Auth users can view options" on quiz_options for select using (auth.role() = 'authenticated');
create policy "Admins can manage options" on quiz_options for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create type module_progress_status as enum ('not_started','in_progress','completed');
create table if not exists student_course_progress (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  course_id   uuid references courses(id) on delete cascade not null,
  module_id   uuid references course_modules(id) on delete cascade not null,
  status      module_progress_status default 'not_started' not null,
  updated_at  timestamptz default now() not null,
  unique(user_id, module_id)
);
create index if not exists scp_user_id_idx on student_course_progress(user_id);
create index if not exists scp_course_id_idx on student_course_progress(course_id);
alter table student_course_progress enable row level security;
create policy "Users can manage own progress" on student_course_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins can view progress" on student_course_progress for select using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create table if not exists quiz_submissions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  quiz_id      uuid references quizzes(id) on delete cascade not null,
  score        integer not null,
  passed       boolean not null,
  answers      jsonb not null default '{}',
  submitted_at timestamptz default now() not null
);
create index if not exists quiz_submissions_user_id_idx on quiz_submissions(user_id);
alter table quiz_submissions enable row level security;
create policy "Users can manage own submissions" on quiz_submissions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins can view submissions" on quiz_submissions for select using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

-- ------------------------------------------------------------
-- NEW TABLES: communities, community_members
-- ------------------------------------------------------------

create type community_type as enum ('cohort','school','interest');
create table if not exists communities (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  type        community_type not null default 'interest',
  cover_url   text,
  created_by  uuid references auth.users(id),
  is_active   boolean default true not null,
  created_at  timestamptz default now() not null
);
alter table communities enable row level security;
create policy "Auth users can view communities" on communities for select using (auth.role() = 'authenticated');
create policy "Admins can manage communities" on communities for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create type member_status as enum ('pending','approved','rejected');
create table if not exists community_members (
  id            uuid primary key default uuid_generate_v4(),
  community_id  uuid references communities(id) on delete cascade not null,
  user_id       uuid references auth.users(id) on delete cascade not null,
  role          text not null default 'member' check (role in ('member','moderator','admin')),
  status        member_status default 'approved' not null,
  joined_at     timestamptz default now() not null,
  unique(community_id, user_id)
);
create index if not exists cm_community_id_idx on community_members(community_id);
create index if not exists cm_user_id_idx on community_members(user_id);
alter table community_members enable row level security;
create policy "Users can view memberships" on community_members for select using (auth.role() = 'authenticated');
create policy "Users can join communities" on community_members for insert with check (auth.uid() = user_id);
create policy "Users can manage own membership" on community_members for update using (auth.uid() = user_id);
create policy "Admins can manage memberships" on community_members for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

-- ------------------------------------------------------------
-- NEW TABLES: tasks, task_completions
-- ------------------------------------------------------------

create type task_target_type as enum ('all','cohort','community','individual');
create table if not exists tasks (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  description  text not null default '',
  due_date     date,
  points       integer default 0 not null,
  target_type  task_target_type not null default 'all',
  target_id    uuid,
  created_by   uuid references auth.users(id),
  created_at   timestamptz default now() not null
);
alter table tasks enable row level security;
create policy "Auth users can view tasks" on tasks for select using (auth.role() = 'authenticated');
create policy "Admins can manage tasks" on tasks for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create table if not exists task_completions (
  id           uuid primary key default uuid_generate_v4(),
  task_id      uuid references tasks(id) on delete cascade not null,
  user_id      uuid references auth.users(id) on delete cascade not null,
  completed_at timestamptz default now() not null,
  notes        text,
  unique(task_id, user_id)
);
create index if not exists tc_task_id_idx on task_completions(task_id);
create index if not exists tc_user_id_idx on task_completions(user_id);
alter table task_completions enable row level security;
create policy "Users can manage own completions" on task_completions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins can view completions" on task_completions for select using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

-- ------------------------------------------------------------
-- NEW TABLES: blog_posts, faqs, partner_applications,
--             mentor_applications, innovation_applications,
--             summer_camp_registrations, job_postings
-- ------------------------------------------------------------

create type blog_post_status as enum ('draft','published');
create table if not exists blog_posts (
  id           uuid primary key default uuid_generate_v4(),
  slug         text not null unique,
  title        text not null,
  excerpt      text,
  content      text not null default '',
  cover_url    text,
  author_name  text,
  category     text,
  status       blog_post_status default 'draft' not null,
  published_at timestamptz,
  created_at   timestamptz default now() not null
);
create index if not exists blog_posts_slug_idx on blog_posts(slug);
create index if not exists blog_posts_status_idx on blog_posts(status);
alter table blog_posts enable row level security;
create policy "Anyone can view published posts" on blog_posts for select using (status = 'published');
create policy "Admins can manage blog" on blog_posts for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create table if not exists faqs (
  id         uuid primary key default uuid_generate_v4(),
  question   text not null,
  answer     text not null,
  category   text,
  sort_order integer default 0 not null,
  is_active  boolean default true not null,
  created_at timestamptz default now() not null
);
alter table faqs enable row level security;
create policy "Anyone can view active faqs" on faqs for select using (is_active = true);
create policy "Admins can manage faqs" on faqs for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create table if not exists partner_applications (
  id            uuid primary key default uuid_generate_v4(),
  company_name  text not null,
  contact_name  text not null,
  email         text not null,
  phone         text,
  website       text,
  message       text,
  status        text default 'pending' not null,
  created_at    timestamptz default now() not null
);
alter table partner_applications enable row level security;
create policy "Anyone can submit partner app" on partner_applications for insert with check (true);
create policy "Admins can manage partner apps" on partner_applications for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create table if not exists mentor_applications (
  id               uuid primary key default uuid_generate_v4(),
  full_name        text not null,
  email            text not null,
  linkedin_url     text,
  industry         text,
  experience_years integer,
  bio              text,
  availability     text,
  status           text default 'pending' not null,
  created_at       timestamptz default now() not null
);
alter table mentor_applications enable row level security;
create policy "Anyone can apply to mentor" on mentor_applications for insert with check (true);
create policy "Admins can manage mentor apps" on mentor_applications for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create table if not exists innovation_applications (
  id             uuid primary key default uuid_generate_v4(),
  team_name      text not null,
  school_name    text,
  contact_name   text not null,
  email          text not null,
  phone          text,
  project_title  text not null,
  description    text,
  status         text default 'pending' not null,
  created_at     timestamptz default now() not null
);
alter table innovation_applications enable row level security;
create policy "Anyone can submit innovation app" on innovation_applications for insert with check (true);
create policy "Admins can manage innovation apps" on innovation_applications for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create table if not exists summer_camp_registrations (
  id            uuid primary key default uuid_generate_v4(),
  student_name  text not null,
  email         text not null,
  school        text,
  grade         text,
  parent_name   text,
  parent_phone  text,
  dietary_needs text,
  status        text default 'pending' not null,
  created_at    timestamptz default now() not null
);
alter table summer_camp_registrations enable row level security;
create policy "Anyone can register for camp" on summer_camp_registrations for insert with check (true);
create policy "Admins can manage camp regs" on summer_camp_registrations for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

create table if not exists job_postings (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  department   text,
  location     text,
  type         text default 'full-time' check (type in ('full-time','part-time','contract','internship')),
  description  text not null default '',
  requirements text,
  is_active    boolean default true not null,
  created_at   timestamptz default now() not null
);
alter table job_postings enable row level security;
create policy "Anyone can view active jobs" on job_postings for select using (is_active = true);
create policy "Admins can manage job postings" on job_postings for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));

-- ------------------------------------------------------------
-- NEW TABLE: student_enrolments
-- ------------------------------------------------------------

create type enrolment_status as enum ('active','paused','cancelled','completed');
create table if not exists student_enrolments (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid references auth.users(id) on delete cascade not null unique,
  plan_id           uuid references pricing_plans(id) not null,
  promo_code_id     uuid references promo_codes(id),
  amount_paid_aed   numeric(10,2),
  stripe_session_id text,
  status            enrolment_status default 'active' not null,
  enrolled_at       timestamptz default now() not null,
  expires_at        timestamptz
);
create index if not exists se_user_id_idx on student_enrolments(user_id);
alter table student_enrolments enable row level security;
create policy "Users can view own enrolment" on student_enrolments for select using (auth.uid() = user_id);
create policy "Admins can manage enrolments" on student_enrolments for all using (exists (select 1 from profiles p where p.user_id = auth.uid() and p.type = 'admin'));
