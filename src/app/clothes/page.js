import ProductGrid from '@/components/ProductGrid';

export const metadata = {
  title: 'Clothes | Rishika Collections',
  description: 'Browse our exquisite collection of sarees, kurtis, lehengas, palazzo sets and more at Rishika Collections.',
};

export default function ClothesPage() {
  return (
    <div className="category-page">
      <div className="category-hero">
        <div className="category-emoji">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-gold)' }}>
            <path d="M6.5 2L2 6l3.5 1L7 21h10l1.5-14L22 6l-4.5-4L14 5l-1 1h-2l-1-1L6.5 2z"/>
          </svg>
        </div>
        <h1>Clothes Collection</h1>
        <p>Explore our handpicked range of sarees, kurtis, lehengas, and more — crafted for every occasion.</p>
      </div>
      <ProductGrid category="clothes" />
    </div>
  );
}
