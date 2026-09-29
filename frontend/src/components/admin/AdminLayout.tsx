import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle, actions }) => {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="admin-layout">
      <button
        className="admin-menu-toggle"
        type="button"
        aria-label={isSidebarOpen ? 'Close admin menu' : 'Open admin menu'}
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
      {isSidebarOpen && <button className="admin-sidebar-backdrop" aria-label="Close admin menu" onClick={closeSidebar} />}
      <aside className={`admin-sidebar${isSidebarOpen ? ' is-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-title">StoreTrae Admin</div>
          {user && (
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
              Logged in as {user.username}
            </div>
          )}
        </div>
        <ul className="admin-nav admin-primary-nav">
          <li>
            <NavLink to="/admin" end onClick={closeSidebar}>
              <span className="admin-nav-icon" aria-hidden="true">D</span><span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" onClick={closeSidebar}>
              <span className="admin-nav-icon" aria-hidden="true">P</span><span>Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" onClick={closeSidebar}>
              <span className="admin-nav-icon" aria-hidden="true">O</span><span>Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/reports" onClick={closeSidebar}>
              <span className="admin-nav-icon" aria-hidden="true">R</span><span>Reports</span>
            </NavLink>
          </li>
        </ul>
        <ul className="admin-nav admin-secondary-nav">
          <li>
            <NavLink to="/" style={{ color: '#d1d5db' }} onClick={closeSidebar}>
              <span className="admin-nav-icon" aria-hidden="true">&lt;</span><span>View Store</span>
            </NavLink>
          </li>
          <li>
            <button
              onClick={() => { closeSidebar(); logout(); }}
              style={{ width: '100%', background: 'none', border: 'none', padding: '0.75rem 1.5rem', color: '#d1d5db', textAlign: 'left', cursor: 'pointer', fontSize: '1rem' }}
            >
              <span className="admin-nav-icon" aria-hidden="true">X</span><span>Logout</span>
            </button>
          </li>
        </ul>
      </aside>

      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">{title}</h1>
            {subtitle && <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
