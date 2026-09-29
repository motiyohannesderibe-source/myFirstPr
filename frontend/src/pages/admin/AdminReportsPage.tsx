import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { orderService, productService } from '../../services/api';
import type { Product } from '../../types';

const AdminReportsPage: React.FC = () => {
  const [report, setReport] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    itemsSold: 0,
    averageOrderValue: 0
  });
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year' | 'all'>('all');
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const [products, salesReport] = await Promise.all([
        productService.getAll(),
        orderService.getSalesReport()
      ]);
      setAllProducts(products);
      setReport({
        ...salesReport,
        averageOrderValue: salesReport.totalOrders > 0 ? salesReport.totalRevenue / salesReport.totalOrders : 0
      });
    } catch (error) {
      console.error('Failed to load report:', error);
      setAllProducts([]);
      setReport({ totalOrders: 0, totalRevenue: 0, itemsSold: 0, averageOrderValue: 0 });
    }
  };

  return (
    <AdminLayout title="Reports" subtitle="Sales performance and analytics">
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {(['week', 'month', 'year', 'all'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`btn ${dateRange === range ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {range === 'all' ? 'All Time' : `This ${range}`}
          </button>
        ))}
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{report.totalOrders}</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem' }}>
            From live order data
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>${report.totalRevenue.toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem' }}>
            From live order data
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Items Sold</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{report.itemsSold}</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem' }}>
            From live order data
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Order Value</div>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>${report.averageOrderValue.toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' }}>
            Based on current orders
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top Selling Products</h3>
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>Product-level sales analytics are not available from the current API.</p>
        </div>

        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Inventory by Category</h3>
          {Array.from(new Set(allProducts.map((p) => p.category))).map((category, idx) => {
            const categoryProducts = allProducts.filter((p) => p.category === category);
            const value = categoryProducts.reduce((sum, p) => sum + p.price * p.stockCount, 0);
            const maxValue = Math.max(...Array.from(new Set(allProducts.map((p) => p.category))).map((item) => allProducts.filter((p) => p.category === item).reduce((sum, p) => sum + p.price * p.stockCount, 0)), 1);
            const pct = (value / maxValue) * 100;
            const colors = ['#2563eb', '#16a34a', '#f59e0b', '#ec4899'];
            return (
              <div key={idx} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 500 }}>{category}</span>
                  <span style={{ color: '#6b7280' }}>{categoryProducts.length} products &middot; ${value.toFixed(2)}</span>
                </div>
                <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: colors[idx % colors.length],
                      borderRadius: '9999px'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', marginTop: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Inventory Summary</h3>
        <table className="data-table" style={{ boxShadow: 'none' }}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Unit Price</th>
              <th>Inventory Value</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.title}</td>
                <td>{p.category}</td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: p.stockCount === 0 ? '#fee2e2' : p.stockCount <= 10 ? '#fef3c7' : '#dcfce7',
                    color: p.stockCount === 0 ? '#b91c1c' : p.stockCount <= 10 ? '#a16207' : '#15803d'
                  }}>
                    {p.stockCount}
                  </span>
                </td>
                <td>${p.price.toFixed(2)}</td>
                <td style={{ fontWeight: 600 }}>${(p.price * p.stockCount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: '#f9fafb', fontWeight: 700 }}>
              <td colSpan={4} style={{ padding: '1rem' }}>Total Inventory Value</td>
              <td style={{ padding: '1rem', color: '#2563eb' }}>
                ${allProducts.reduce((sum, p) => sum + p.price * p.stockCount, 0).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
