import React from 'react';
import { useCart } from '../../context/CartContext';
import { resolveImageUrl } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';

const CartPanel: React.FC = () => {
  const { items, isOpen, subtotal, closeCart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <aside className={`cart-panel ${isOpen ? 'open' : ''}`}>
      <div className="cart-panel-header">
        <h2 className="cart-panel-title">Your Cart ({items.length})</h2>
        <button className="cart-close-btn" onClick={closeCart}>&times;</button>
      </div>

      <div className="cart-panel-items">
        {items.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/products" onClick={closeCart} style={{ display: 'inline-block', marginTop: '1rem' }} className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.product.id} className="cart-item">
              <img
                src={resolveImageUrl(item.product.imageUrl)}
                alt={item.product.title}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <div className="cart-item-title">{item.product.title}</div>
                <div className="cart-item-price">${item.product.price.toFixed(2)}</div>
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
                <button
                  className="remove-item-btn"
                  onClick={() => removeItem(item.product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="cart-panel-footer">
          <div className="cart-subtotal">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Link to="/cart" onClick={closeCart} className="btn btn-outline" style={{ width: '100%', marginBottom: '0.75rem', display: 'block', textAlign: 'center' }}>
            View Cart
          </Link>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </aside>
  );
};

export default CartPanel;
