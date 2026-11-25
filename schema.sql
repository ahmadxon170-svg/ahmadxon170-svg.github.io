create extension if not exists pgcrypto;

create table if not exists public.meta_info (
  id integer primary key default 1 check (id = 1),
  patch_name text not null default 'Meta hali kiritilmagan',
  patch_date date,
  last_updated timestamptz not null default now(),
  notes text default ''
);

insert into public.meta_info (id) values (1) on conflict (id) do nothing;

create table if not exists public.heroes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  role text not null check (role in ('Tank','Fighter','Assassin','Mage','Marksman','Support')),
  lane text default '',
  tier text not null default 'B' check (tier in ('S','A','B','C')),
  win_rate numeric(5,2),
  pick_rate numeric(5,2),
  ban_rate numeric(5,2),
  portrait_url text default '',
  description text default '',
  strengths text[] not null default '{}',
  weaknesses text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.combos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  strategy text default '',
  hero_ids uuid[] not null default '{}',
  difficulty text default 'O‘rta',
  created_at timestamptz not null default now()
);

create index if not exists heroes_tier_idx on public.heroes(tier);
create index if not exists heroes_role_idx on public.heroes(role);

-- Access is performed by the backend using the Supabase service role key.
-- Do not expose that key in the browser.
alter table public.meta_info enable row level security;
alter table public.heroes enable row level security;
alter table public.combos enable row level security;
