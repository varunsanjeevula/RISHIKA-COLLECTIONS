'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const ClothesIconSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 2L2 6l3.5 1L7 21h10l1.5-14L22 6l-4.5-4L14 5l-1 1h-2l-1-1L6.5 2z"/>
  </svg>
);

const JewelleryIconSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 13L2 9l4-6z"/>
    <path d="M2 9h20"/>
    <path d="M10 3l-4 6 6 13 6-13-4-6"/>
  </svg>
);

export default function ProductCard({ product, index }) {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const productNumber = index !== undefined ? String(index + 1).padStart(2, '0') : null;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({ ...product, productCode: productNumber ? `#${productNumber}` : 'N/A' });
    setTimeout(() => setIsAdding(false), 1000);
  };


  return (
    <div className="product-card" id={`product-${product.id}`}>
      <div className="product-image-wrapper">
        {productNumber && (
          <div className="product-number">#{productNumber}</div>
        )}
        <Image
          src={product.image_url}
          alt={product.name}
          width={400}
          height={400}
          className="product-image"
        />
        <div className="product-category-badge">
          {product.category === 'clothes' ? <ClothesIconSmall /> : <JewelleryIconSmall />}
          {product.category}
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
          <button
            className={`add-to-cart-btn ${isAdding ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Added!</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
