-- ============================================================
-- Useful Views for Admin Dashboard / Reports
-- ============================================================

-- View: Monthly sales summary
CREATE OR REPLACE VIEW v_monthly_sales AS
SELECT
    DATE_TRUNC('month', o.created_at)::DATE AS sales_month,
    COUNT(DISTINCT o.id) AS total_orders,
    SUM(oi.quantity) AS items_sold,
    SUM(o.total_amount) AS total_revenue,
    ROUND(AVG(o.total_amount), 2) AS avg_order_value
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.status != 'cancelled'
GROUP BY DATE_TRUNC('month', o.created_at)
ORDER BY sales_month DESC;

-- View: Top selling products
CREATE OR REPLACE VIEW v_top_products AS
SELECT
    p.id AS product_id,
    p.title AS product_title,
    p.category,
    p.stock_count,
    p.price,
    COALESCE(SUM(oi.quantity), 0) AS total_sold,
    COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) AS total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
GROUP BY p.id, p.title, p.category, p.stock_count, p.price
ORDER BY total_sold DESC;

-- View: Order summary for admin list
CREATE OR REPLACE VIEW v_order_summary AS
SELECT
    o.id,
    o.total_amount,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.status,
    o.created_at,
    o.updated_at,
    COUNT(oi.id) AS distinct_items,
    SUM(oi.quantity) AS total_quantity
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.total_amount, o.customer_name, o.customer_email,
         o.customer_phone, o.status, o.created_at, o.updated_at
ORDER BY o.created_at DESC;

-- View: Low stock products (below threshold)
CREATE OR REPLACE VIEW v_low_stock AS
SELECT
    id AS product_id,
    title,
    category,
    stock_count,
    price,
    image_url,
    CASE
        WHEN stock_count = 0 THEN 'Out of Stock'
        WHEN stock_count <= 5 THEN 'Critical'
        WHEN stock_count <= 10 THEN 'Low'
        ELSE 'OK'
    END AS stock_status
FROM products
WHERE stock_count <= 10
ORDER BY stock_count ASC;
