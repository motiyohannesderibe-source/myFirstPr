-- ============================================================
-- Migration: 002_add_sales_report_view
-- Created: 2026-09-20
-- Description: Add views and indexes for reporting
-- ============================================================

-- View for order summaries with item counts
CREATE OR REPLACE VIEW order_summary_view AS
SELECT
    o.id AS order_id,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.total_amount,
    o.status,
    o.created_at,
    COUNT(oi.id) AS total_line_items,
    COALESCE(SUM(oi.quantity), 0) AS total_quantity
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.customer_name, o.customer_email, o.customer_phone, o.total_amount, o.status, o.created_at;

-- View for product sales performance
CREATE OR REPLACE VIEW product_sales_view AS
SELECT
    p.id AS product_id,
    p.title,
    p.category,
    p.price,
    p.stock_count,
    COALESCE(SUM(oi.quantity), 0) AS units_sold,
    COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) AS total_revenue
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o ON o.id = oi.order_id AND o.status != 'cancelled'
GROUP BY p.id, p.title, p.category, p.price, p.stock_count;

-- Additional indexes for reports
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
