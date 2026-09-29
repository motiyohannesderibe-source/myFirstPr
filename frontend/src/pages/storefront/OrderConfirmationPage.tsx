import React from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="confirmation-card">
      <div className="confirmation-icon">&#10004;</div>
      <h1 className="confirmation-title">Order Confirmed!</h1>
      <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <div className="confirmation-order-id">Order ID: #{orderId}</div>

      <div className="confirmation-details">
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>What's Next?</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ color: '#16a34a', fontWeight: 700 }}>&#10003;</span>
            <span>Order confirmation sent to your email</span>
          </li>
          <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>&#9679;</span>
            <span>Processing your order (24-48 hours)</span>
          </li>
          <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ color: '#9ca3af', fontWeight: 700 }}>&#9675;</span>
            <span>Out for delivery</span>
          </li>
          <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ color: '#9ca3af', fontWeight: 700 }}>&#9675;</span>
            <span>Delivered! Enjoy your purchase</span>
          </li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        <Link to="/" className="btn btn-outline">Back to Home</Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
