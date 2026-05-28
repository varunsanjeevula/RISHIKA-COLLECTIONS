import ProductGrid from '@/components/ProductGrid';

export const metadata = {
  title: 'Jewellery | Rishika Collections',
  description: 'Discover stunning jewellery collections including necklaces, earrings, bangles, and more at Rishika Collections.',
};

export default function JewelleryPage() {
  return (
    <div className="category-page">
      <div className="category-hero">
        <div className="category-emoji">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-gold)' }}>
            <path d="M6 3h12l4 6-10 13L2 9l4-6z"/>
            <path d="M2 9h20"/>
            <path d="M10 3l-4 6 6 13 6-13-4-6"/>
          </svg>
        </div>
        <h1>Jewellery Collection</h1>
        <p>Discover stunning necklaces, earrings, bangles, and more — timeless pieces for every celebration.</p>
      </div>
      <ProductGrid category="jewellery" />
    </div>
  );
}
