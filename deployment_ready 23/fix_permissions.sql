-- Enable RLS on all tables (good practice)
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE packaging_config ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since we handle auth in the app logic)
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public access to app_users" ON app_users;
CREATE POLICY "Allow public access to app_users" ON app_users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to transactions" ON transactions;
CREATE POLICY "Allow public access to transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to inventory" ON inventory;
CREATE POLICY "Allow public access to inventory" ON inventory FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to suppliers" ON suppliers;
CREATE POLICY "Allow public access to suppliers" ON suppliers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to delivery_config" ON delivery_config;
CREATE POLICY "Allow public access to delivery_config" ON delivery_config FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to packaging_config" ON packaging_config;
CREATE POLICY "Allow public access to packaging_config" ON packaging_config FOR ALL USING (true) WITH CHECK (true);

-- Ensure the default admin exists (in case it was missed)
INSERT INTO app_users (name, pin, role)
SELECT 'Admin', '1234', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM app_users WHERE pin = '1234');
