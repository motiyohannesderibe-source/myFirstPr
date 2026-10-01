import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { productService } from '../../services/api';
import ProductCard from '../../components/storefront/ProductCard';

const categoryImages: Record<string, string> = {
  Electronics: 'photo-1519389950473-47ba0277781c',
  Clothing: 'photo-1483985988355-763728e1935b',
  'Home & Kitchen': 'photo-1616486338812-3dadae4b4ace',
  Books: 'photo-1507842217343-583bb7277295',
  Sports: 'photo-1461896836934-ffe607ba8211',
  Beauty: 'photo-1596462502278-27bfdc403348'
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

  const categories = Array.from(new Set(products.map((product) => product.category))).slice(0, 4);

  return (
    <div className="store-home">
      <section className="store-hero">
        <img
          className="store-hero-image"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2400&q=90"
          alt="A sunlit independent shop filled with carefully chosen pieces"
        />
        <div className="store-hero-content">
          <span className="store-eyebrow"><span /> THE EVERYDAY EDIT</span>
          <h1>Good finds.<br />Great feeling.</h1>
          <p>Useful things, thoughtful details, and little upgrades worth coming home to.</p>
          <Link to="/products" className="store-hero-cta">Find your thing <span aria-hidden="true">↗</span></Link>
        </div>
        <span className="store-hero-index">01 / MADE FOR EVERY DAY</span>
      </section>

      <div className="store-promises" aria-label="Store benefits">
        <span>Thoughtfully picked</span>
        <span>Good things, fair prices</span>
        <span>Delivered to your door</span>
      </div>

      {categories.length > 0 && (
        <section className="store-categories" aria-labelledby="category-heading">
          <div className="store-section-heading">
            <div>
              <span className="store-section-kicker">A GOOD PLACE TO START</span>
              <h2 id="category-heading">Shop your way.</h2>
            </div>
            <span className="store-section-note">A little something for every day.</span>
          </div>
          <div className="store-category-grid">
            {categories.map((category, index) => (
              <Link
                className="store-category"
                to={`/products?category=${encodeURIComponent(category)}`}
                key={category}
              >
                <img
                  src={`https://images.unsplash.com/${categoryImages[category] || 'photo-1441986300917-64674bd600d8'}?auto=format&fit=crop&w=900&q=80`}
                  alt=""
                  loading="lazy"
                />
                <span className="store-category-number">0{index + 1}</span>
                <span className="store-category-label">{category}<span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="store-featured" aria-labelledby="featured-heading">
        <div className="store-section-heading">
          <div>
            <span className="store-section-kicker">THE GOOD STUFF</span>
            <h2 id="featured-heading">Picked for you.</h2>
          </div>
          <Link to="/products" className="store-all-products">See everything <span aria-hidden="true">↗</span></Link>
        </div>

        {productsLoading ? (
          <p className="home-products-message">Finding the good stuff...</p>
        ) : productsError ? (
          <p className="home-products-message home-products-error">{productsError}</p>
        ) : products.length === 0 ? (
          <p className="home-products-message">No products are available yet.</p>
        ) : (
          <div className="product-grid home-product-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
