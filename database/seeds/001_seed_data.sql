-- ============================================================
-- Seed Data: Admin User
-- Default Admin Credentials: admin / admin123
-- ============================================================

-- Admin user (password: admin123, hashed with BCrypt 2a$10 work factor)
-- Note: The .NET backend uses BCrypt.Net-Next for verification.
-- This hash corresponds to "admin123"
INSERT INTO users (username, email, password_hash, role, created_at, updated_at)
VALUES (
    'admin',
    'admin@storetrae.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'admin',
    NOW(),
    NOW()
)
ON CONFLICT (username) DO NOTHING;

