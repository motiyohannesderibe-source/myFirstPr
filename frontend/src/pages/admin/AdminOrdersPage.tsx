import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import type { Order } from '../../types';
import { orderService } from '../../services/api';

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <AdminLayout title="Orders" subtitle={`${orders.length} total order(s)`}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
          <button
            key={status || 'all'}
            onClick={() => setStatusFilter(status)}
            className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {status === '' ? 'All Orders' : status}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <div style={{ background: 'white', padding: '3rem', borderRadius: '0.75rem', textAlign: 'center', color: '#9ca3af', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          No orders found.
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600 }}>#{order.id}</td>
                <td>
                  <div>
                    <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{order.customerEmail}</div>
                  </div>
                </td>
                <td>{order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)</td>
                <td style={{ fontWeight: 600, color: '#2563eb' }}>${order.totalAmount.toFixed(2)}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td style={{ color: '#6b7280', fontSize: '0.875rem' }}>{order.createdAt.substring(0, 10)}</td>
                <td>
                  <button className="btn btn-outline" onClick={() => setSelectedOrder(order)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Order #{selectedOrder.id} Details</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Customer Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                  <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>
                  <div><strong>Phone:</strong> {selectedOrder.customerPhone}</div>
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                  <strong>Address:</strong> {selectedOrder.shippingAddress}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Order Items</h3>
                <div style={{ background: '#f9fafb', borderRadius: '0.5rem', padding: '1rem' }}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', fontSize: '0.875rem' }}>
                      <span>{item.productTitle} x {item.quantity}</span>
                      <span>${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid #e5e7eb', fontWeight: 600 }}>
                    <span>Total</span>
                    <span style={{ color: '#2563eb' }}>${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Update Status</h3>
                <select
                  className="form-select"
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrdersPage;
