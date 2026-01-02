-- CRITICAL FIX: Run this entire script in Supabase SQL Editor

-- 1. Add is_deleted column (Fixes: "Product doesn't delete from Supabase")
ALTER TABLE inventory 
ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false;

UPDATE inventory SET is_deleted = false WHERE is_deleted IS NULL;

-- 2. Add initial_quantity column (Fixes: "Inventory doesn't refresh after transaction delete")
ALTER TABLE inventory 
ADD COLUMN IF NOT EXISTS initial_quantity integer;

-- Initialize initial_quantity for existing items
UPDATE inventory SET initial_quantity = quantity WHERE initial_quantity IS NULL;

-- 3. Verify Columns Exist (Optional check)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inventory' AND column_name='is_deleted') THEN
        RAISE EXCEPTION 'Column is_deleted failed to create';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inventory' AND column_name='initial_quantity') THEN
        RAISE EXCEPTION 'Column initial_quantity failed to create';
    END IF;
END $$;
