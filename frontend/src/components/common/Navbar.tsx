import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { totalItems, toggleCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">StoreTrae</Link>
      <ul className="navbar-nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li>
          <button className="cart-button" onClick={toggleCart}>
            Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </li>
        {isAuthenticated && user?.role === 'admin' ? (
          <>
            <li><Link to="/admin">Admin</Link></li>
            <li><button className="btn btn-outline" onClick={logout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/admin/login">Admin Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
