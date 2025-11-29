-- Run this in your Supabase SQL Editor

ALTER TABLE transactions 
ADD COLUMN phone text,
ADD COLUMN address text,
ADD COLUMN status text DEFAULT 'pending';

ALTER TABLE inventory
ADD COLUMN supplier text;
