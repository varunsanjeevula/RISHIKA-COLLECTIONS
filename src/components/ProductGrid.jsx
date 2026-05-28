'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { createClient } from '@/lib/supabase';

const ClothesIconSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
    <path d="M6.5 2L2 6l3.5 1L7 21h10l1.5-14L22 6l-4.5-4L14 5l-1 1h-2l-1-1L6.5 2z"/>
  </svg>
);

const JewelleryIconSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
    <path d="M6 3h12l4 6-10 13L2 9l4-6z"/>
    <path d="M2 9h20"/>
    <path d="M10 3l-4 6 6 13 6-13-4-6"/>
  </svg>
);

export default function ProductGrid({ category = null, limit = null }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(category || 'all');

  useEffect(() => {
    fetchProducts();
  }, [activeFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });

    if (activeFilter && activeFilter !== 'all') {
      query = query.eq('category', activeFilter);
    }
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (data) setProducts(data);
    if (error) console.error('Error fetching products:', error);
    setLoading(false);
  };

  return (
    <div className="product-grid-section">
      {!category && (
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >All Products</button>
          <button
            className={`filter-tab ${activeFilter === 'clothes' ? 'active' : ''}`}
            onClick={() => setActiveFilter('clothes')}
          ><ClothesIconSmall /> Clothes</button>
          <button
            className={`filter-tab ${activeFilter === 'jewellery' ? 'active' : ''}`}
            onClick={() => setActiveFilter('jewellery')}
          ><JewelleryIconSmall /> Jewellery</button>
        </div>
      )}

      {loading ? (
        <div className="product-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <h3>No products found</h3>
          <p>Check back soon for new arrivals!</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
