-- ============================================================
-- Migration: Platform Audit — connections, pinned posts, profile fields
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Connections table
create table if not exists connections (
  id            uuid primary key default gen_random_uuid(),
  requester_id  uuid references auth.users(id) on delete cascade not null,
  addressee_id  uuid references auth.users(id) on delete cascade not null,
  status        text check (status in ('pending','accepted','declined')) default 'pending' not null,
  created_at    timestamptz default now() not null,
  unique(requester_id, addressee_id)
);

create index if not exists connections_requester_idx on connections(requester_id);
create index if not exists connections_addressee_idx on connections(addressee_id);

alter table connections enable row level security;

create policy "Anyone can view connections"
  on connections for select using (true);

create policy "Users can send connection requests"
  on connections for insert with check (auth.uid() = requester_id);

create policy "Addressees can update connection requests"
  on connections for update using (auth.uid() = addressee_id);

-- 2. Pin posts
alter table posts add column if not exists is_pinned boolean default false;

-- 3. Profile fields
alter table profiles add column if not exists bio text;
alter table profiles add column if not exists linkedin_url text;
