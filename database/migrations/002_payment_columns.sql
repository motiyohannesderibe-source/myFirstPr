-- ============================================================
-- Migration 002: Add optional payment integration columns
-- Applied: 2026-09-20
-- Description: Adds columns for future Telebirr/Chapa payment API integration
-- ============================================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(200);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_transaction_id VARCHAR(200);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'unpaid';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_details JSONB;

CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);

INSERT INTO schema_migrations (version, name)
VALUES ('002', 'Add payment integration columns for Telebirr/Chapa')
ON CONFLICT (version) DO NOTHING;
