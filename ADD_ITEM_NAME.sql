-- Add item_name column to transactions table for easier viewing
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS item_name text;

-- Backfill item_name from inventory table using item_id
UPDATE transactions t
SET item_name = i.name
FROM inventory i
WHERE t.item_id = i.id
AND t.item_name IS NULL;
