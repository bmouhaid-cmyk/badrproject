-- Run this in your Supabase SQL Editor

ALTER TABLE transactions 
ADD COLUMN phone text,
ADD COLUMN address text,
ADD COLUMN status text DEFAULT 'pending';

ALTER TABLE inventory
ADD COLUMN supplier text;

ALTER TABLE transactions
ADD COLUMN delivery_company text;

CREATE TABLE IF NOT EXISTS suppliers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  contact text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
