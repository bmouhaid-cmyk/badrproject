-- Add initial_quantity column to inventory table for tracking total history
ALTER TABLE inventory 
ADD COLUMN initial_quantity integer;

-- Update existing rows to set initial_quantity equal to current quantity
-- This is a baseline, as we don't know the true history for existing items
UPDATE inventory SET initial_quantity = quantity WHERE initial_quantity IS NULL;
