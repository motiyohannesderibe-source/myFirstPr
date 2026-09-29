import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { orderService, productService } from '../../services/api';
import type { Product, Order } from '../../types';

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    itemsSold: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [products, report] = await Promise.all([
        productService.getAll(),
        orderService.getSalesReport()
      ]);
      setStats({
        totalProducts: products.length,
        totalOrders: report.totalOrders,
        totalRevenue: report.totalRevenue,
        itemsSold: report.itemsSold
      });
      setRecentOrders(report.recentOrders || []);
      setLowStockProducts(products.filter((p) => p.stockCount <= 10));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setStats({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, itemsSold: 0 });
    }
  };

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back! Here's what's happening with your store today.">
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{stats.totalProducts}</div>
          <Link to="/admin/products" style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none', marginTop: '0.5rem', display: 'inline-block' }}>
            Manage products &rarr;
          </Link>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>{stats.totalOrders}</div>
          <Link to="/admin/orders" style={{ fontSize: '0.875rem', color: '#16a34a', textDecoration: 'none', marginTop: '0.5rem', display: 'inline-block' }}>
            View orders &rarr;
          </Link>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>${stats.totalRevenue.toFixed(2)}</div>
          <Link to="/admin/reports" style={{ fontSize: '0.875rem', color: '#f59e0b', textDecoration: 'none', marginTop: '0.5rem', display: 'inline-block' }}>
            View reports &rarr;
          </Link>
        </div>
        <div className="stat-card">
          <div className="stat-label">Items Sold</div>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>{stats.itemsSold}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: order.status === 'completed' ? '#dcfce7' : order.status === 'pending' ? '#fef3c7' : '#e0e7ff',
                        color: order.status === 'completed' ? '#15803d' : order.status === 'pending' ? '#a16207' : '#3730a3'
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', textAlign: 'center', color: '#9ca3af', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              No recent orders yet.
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Low Stock Alert</h2>
          {lowStockProducts.length > 0 ? (
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {lowStockProducts.map((p) => (
                <div key={p.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.category}</div>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: p.stockCount === 0 ? '#fee2e2' : '#fef3c7',
                      color: p.stockCount === 0 ? '#b91c1c' : '#a16207'
                    }}>
                      {p.stockCount === 0 ? 'Out of Stock' : `${p.stockCount} left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', textAlign: 'center', color: '#9ca3af', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              All products are well stocked.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
