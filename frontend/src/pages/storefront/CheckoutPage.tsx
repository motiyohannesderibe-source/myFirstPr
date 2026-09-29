import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/api';
import type { PlaceOrderRequest, OrderItem } from '../../types';

const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        quantity: item.quantity,
        priceAtPurchase: item.product.price
      }));

      const orderRequest: PlaceOrderRequest = {
        items: orderItems,
        totalAmount: subtotal,
        ...formData
      };

      const order = await orderService.placeOrder(orderRequest);
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="empty-cart" style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>No Items to Checkout</h2>
        <p style={{ marginBottom: '2rem' }}>Your cart is empty.</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">Complete your order by filling out the information below</p>

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Information</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="customerName"
              className="form-input"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="customerEmail"
              className="form-input"
              value={formData.customerEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              name="customerPhone"
              className="form-input"
              value={formData.customerPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Shipping Address *</label>
            <textarea
              name="shippingAddress"
              className="form-textarea"
              value={formData.shippingAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/cart" className="btn btn-outline">Back to Cart</Link>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>

        <div className="order-summary">
          <h2 className="summary-title">Order Summary</h2>
          {items.map((item) => (
            <div key={item.product.id} className="summary-item">
              <span>{item.product.title} x {item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-item" style={{ marginTop: '0.5rem' }}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#15803d' }}>
            <strong>Secure Checkout</strong>
            <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#166534' }}>
              Payment integration with Telebirr/Chapa coming soon. For now, orders are recorded as cash-on-delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
