import React from 'react';
import type { Product } from '../../types';
import { resolveImageUrl } from '../../services/api';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const stockClass =
    product.stockCount === 0
      ? 'stock-out'
      : product.stockCount <= 10
        ? 'stock-low'
        : 'stock-high';

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={resolveImageUrl(product.imageUrl)}
          alt={product.title}
          className="product-image"
          loading="lazy"
        />
        <span className={`product-stock-badge ${stockClass}`}>
          {product.stockCount === 0 ? 'Sold Out' : product.stockCount <= 10 ? `${product.stockCount} Left` : 'In Stock'}
        </span>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="btn btn-primary"
            onClick={() => addItem(product)}
            disabled={product.stockCount <= 0}
            style={{ opacity: product.stockCount <= 0 ? 0.5 : undefined, cursor: product.stockCount <= 0 ? 'not-allowed' : undefined }}
          >
            {product.stockCount <= 0 ? 'Sold Out' : '🛒 Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
