-- ============================================================
-- Migration: Adzuna Integration — staging columns on opportunities
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Add source tracking columns
alter table opportunities add column if not exists source text default 'manual' not null;
alter table opportunities add column if not exists source_id text;
alter table opportunities add column if not exists salary_min numeric;
alter table opportunities add column if not exists salary_max numeric;
alter table opportunities add column if not exists location text;
alter table opportunities add column if not exists expires_at timestamptz;
alter table opportunities add column if not exists status text default 'approved' not null;

-- Add check constraint for source
alter table opportunities add constraint opportunities_source_check
  check (source in ('manual', 'adzuna'));

-- Add check constraint for status
alter table opportunities add constraint opportunities_status_check
  check (status in ('staging', 'approved', 'rejected'));

-- Index for staging queries
create index if not exists opportunities_status_idx on opportunities(status);
create index if not exists opportunities_source_idx on opportunities(source);
create index if not exists opportunities_source_id_idx on opportunities(source_id);

-- Update existing rows to be approved/manual
update opportunities set source = 'manual', status = 'approved' where source is null or source = '';
