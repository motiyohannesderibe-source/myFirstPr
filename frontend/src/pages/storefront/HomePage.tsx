import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { productService } from '../../services/api';
import ProductCard from '../../components/storefront/ProductCard';

const categoryIcons: Record<string, string> = {
  Electronics: '📱',
  Clothing: '👕',
  'Home & Kitchen': '🏠',
  Books: '📚',
  Sports: '⚽',
  Beauty: '💄'
};

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const data = await productService.getAll();
        console.info('[StoreTrae] Loaded products for home page:', data.length);
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error('[StoreTrae] Failed to load home page products:', error);
        setProductsError(error instanceof Error ? error.message : 'Unable to load products.');
      } finally {
        setProductsLoading(false);
      }
    };

    void loadFeaturedProducts();
  }, []);

  return (
    <div>
      <div className="hero-section">
        <h1>Welcome to StoreTrae</h1>
        <p>Discover premium quality products at unbeatable prices. Curated just for you with fast, reliable delivery.</p>
        <Link to="/products">
          Explore Products →
        </Link>
      </div>

      <div className="home-stats">
        <div className="stat-card">
          <div className="stat-label">Quality Products</div>
          <div className="stat-value">100+</div>
          <div className="stat-trend trend-up">Carefully selected</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Happy Customers</div>
          <div className="stat-value">5,000+</div>
          <div className="stat-trend trend-up">Growing daily</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Fast Delivery</div>
          <div className="stat-value">24-48h</div>
          <div className="stat-trend trend-up">Nationwide</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Secure Checkout</div>
          <div className="stat-value">24/7</div>
          <div className="stat-trend trend-up">100% protected</div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '1rem', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
        <span className="text-gradient">Shop by Category</span>
      </h2>
      <div className="home-categories">
        {['Electronics', 'Clothing', 'Home & Kitchen', 'Books'].map((cat) => (
          <div key={cat} onClick={() => {
            sessionStorage.setItem('filterCategory', cat);
            window.location.href = '/products';
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', position: 'relative', zIndex: 1 }}>
              {categoryIcons[cat] || '🛍️'}
            </div>
            <h3>{cat}</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontWeight: 600, position: 'relative', zIndex: 1 }}>
              Browse now →
            </div>
          </div>
        ))}
      </div>

      <div className="home-products-heading">
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            <span className="text-gradient">Featured Products</span>
          </h2>
          <p>Explore what is available in our store today.</p>
        </div>
        <Link to="/products" className="home-products-link">View all products</Link>
      </div>

      {productsLoading ? (
        <p className="home-products-message">Loading products...</p>
      ) : productsError ? (
        <p className="home-products-message home-products-error">{productsError}</p>
      ) : products.length === 0 ? (
        <p className="home-products-message">No products are available yet.</p>
      ) : (
        <div className="product-grid home-product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
};

export default HomePage;
