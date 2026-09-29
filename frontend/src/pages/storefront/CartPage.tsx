import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { resolveImageUrl } from '../../services/api';

const CartPage: React.FC = () => {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="empty-cart" style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ marginBottom: '2rem' }}>Add some products to get started!</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-subtitle">{items.length} item(s) in your cart</p>
        </div>
        <button className="btn btn-outline" onClick={clearCart}>Clear Cart</button>
      </div>

      <div className="checkout-container">
        <div>
          <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            {items.map((item) => (
              <div key={item.product.id} className="cart-item" style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                <img
                  src={resolveImageUrl(item.product.imageUrl)}
                  alt={item.product.title}
                  className="cart-item-image"
                  style={{ width: '120px', height: '120px' }}
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-title" style={{ fontSize: '1.125rem' }}>{item.product.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{item.product.category}</p>
                  <div className="cart-item-price" style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
                    ${item.product.price.toFixed(2)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span style={{ fontWeight: 600, color: '#374151' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      className="remove-item-btn"
                      style={{ marginLeft: 'auto' }}
                      onClick={() => removeItem(item.product.id)}
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          <Link
            to="/products"
            className="btn btn-outline"
            style={{ width: '100%', marginTop: '0.75rem', display: 'block', textAlign: 'center' }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
