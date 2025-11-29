-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Inventory Table
create table inventory (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  buy_price numeric default 0,
  sell_price numeric default 0,
  quantity integer default 0,
  low_stock_threshold integer default 5,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Transactions Table
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  date date not null,
  type text not null, -- 'sale', 'purchase', 'expense'
  category text,
  party text,
  item_id uuid references inventory(id),
  quantity integer,
  amount numeric default 0,
  notes text,
  delivery_cost numeric default 0,
  packaging_cost numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. App Users Table (renamed to avoid conflict with auth.users)
create table app_users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  pin text not null,
  role text not null, -- 'admin', 'staff'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Delivery Config Table
create table delivery_config (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  rates jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Packaging Config Table
create table packaging_config (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  cost numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert Default Admin User (PIN: 1234)
insert into app_users (name, pin, role) values ('Admin', '1234', 'admin');
