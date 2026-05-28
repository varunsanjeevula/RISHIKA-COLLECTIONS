'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function Cart({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim()) {
      setCheckoutError('Please enter your name and mobile number.');
      return;
    }

    let message = '\ud83d\udecd\ufe0f *New Order - Rishika Collections*\n\n';
    message += `*Customer Details:*\n`;
    message += `Name: ${customerName.trim()}\n`;
    message += `Mobile: ${customerPhone.trim()}\n\n`;
    message += `*Order Details:*\n`;
    cartItems.forEach((item, index) => {
      const code = item.productCode || 'N/A';
      const imageUrl = item.image_url;
      message += `*${index + 1}. ${item.name}*\n`;
      message += `   Code: ${code}\n`;
      message += `   Qty: ${item.quantity} | Price: \u20b9${(item.price * item.quantity).toLocaleString('en-IN')}\n`;
      message += `   Photo: ${imageUrl}\n\n`;
    });
    message += `\ud83d\udcb0 *Total: \u20b9${getCartTotal().toLocaleString('en-IN')}*\n\nPlease confirm my order. Thank you! \ud83d\ude4f`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/919030732327?text=${encoded}`;
    window.open(url, '_blank');
    clearCart();
    onClose();
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some beautiful items to get started!</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <Image src={item.image_url} alt={item.name} width={80} height={80} />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <span className="cart-item-code">{item.productCode || 'N/A'}</span>
                    <span className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</span>
                    <div className="cart-item-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="qty-btn">−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-btn">+</button>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-customer-details">
                <input 
                  type="text" 
                  placeholder="Your Full Name" 
                  value={customerName} 
                  onChange={(e) => { setCustomerName(e.target.value); setCheckoutError(''); }}
                  className="cart-input"
                />
                <input 
                  type="tel" 
                  placeholder="Your Mobile Number" 
                  value={customerPhone} 
                  onChange={(e) => { setCustomerPhone(e.target.value); setCheckoutError(''); }}
                  className="cart-input"
                />
                {checkoutError && <div className="cart-error">{checkoutError}</div>}
              </div>
              <div className="cart-total">
                <span>Total</span>
                <span className="cart-total-price">₹{getCartTotal().toLocaleString('en-IN')}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Checkout via WhatsApp
              </button>
              <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
