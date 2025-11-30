-- Add is_deleted column to inventory table for soft delete
ALTER TABLE inventory 
ADD COLUMN is_deleted boolean DEFAULT false;

-- Update existing rows to have is_deleted = false
UPDATE inventory SET is_deleted = false WHERE is_deleted IS NULL;
