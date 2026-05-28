import Link from 'next/link';

const ClothesIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="category-svg-icon">
    <path d="M6.5 2L2 6l3.5 1L7 21h10l1.5-14L22 6l-4.5-4L14 5l-1 1h-2l-1-1L6.5 2z"/>
  </svg>
);

const JewelleryIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="category-svg-icon">
    <path d="M6 3h12l4 6-10 13L2 9l4-6z"/>
    <path d="M2 9h20"/>
    <path d="M10 3l-4 6 6 13 6-13-4-6"/>
  </svg>
);

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-gradient"></div>
        <div className="hero-pattern"></div>
      </div>
      <div className="hero-content">
        <div className="hero-badge">✦ Premium Collection ✦</div>
        <h1 className="hero-title">RISHIKA<br/><span className="hero-title-accent">COLLECTIONS</span></h1>
        <p className="hero-subtitle">Discover exquisite handpicked Clothes & Jewellery that define elegance and tradition</p>
        <div className="hero-categories">
          <Link href="/clothes" className="hero-category-card">
            <div className="category-icon"><ClothesIcon /></div>
            <h3>Clothes</h3>
            <p>Sarees, Kurtis, Lehengas & more</p>
            <span className="category-arrow">→</span>
          </Link>
          <Link href="/jewellery" className="hero-category-card">
            <div className="category-icon"><JewelleryIcon /></div>
            <h3>Jewellery</h3>
            <p>Necklaces, Earrings, Bangles & more</p>
            <span className="category-arrow">→</span>
          </Link>
        </div>
      </div>
      <div className="hero-scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
