-- CRITICAL FIX: Run this script in the Supabase SQL Editor to allow decimal quantities/credits

-- 1. Allow decimal quantities in Digital Inventory
ALTER TABLE digital_inventory 
ALTER COLUMN quantity TYPE numeric USING quantity::numeric;

-- 2. Allow decimal quantities in Digital Transactions
ALTER TABLE digital_transactions 
ALTER COLUMN quantity TYPE numeric USING quantity::numeric;

-- 3. Allow decimal durations/credits in Subscriptions
ALTER TABLE subscriptions 
ALTER COLUMN duration_months TYPE numeric USING duration_months::numeric;
