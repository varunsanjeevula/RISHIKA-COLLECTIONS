'use client';

import { useState } from 'react';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  );
}
