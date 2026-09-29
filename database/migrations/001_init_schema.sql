-- ============================================================
-- Migration 001: Initial Schema Creation
-- Applied: 2026-09-20
-- Description: Creates users, products, orders, and order_items tables
-- ============================================================

-- Migration tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Run the init schema
\ir ../schema/001_init_schema.sql

-- Record migration
INSERT INTO schema_migrations (version, name) VALUES ('001', 'Initial schema creation');
