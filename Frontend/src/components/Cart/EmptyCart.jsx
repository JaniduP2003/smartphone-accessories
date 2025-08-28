import React from 'react';
import { ShoppingCart } from 'lucide-react';
import '../../styles/EmptyCart.css';

const EmptyCart = () => {
  return (
    <div className="empty-cart">
      <div className="empty-cart-icon">
        <ShoppingCart size={64} />
      </div>
      <h2 className="empty-cart-title">Your cart is empty</h2>
      <p className="empty-cart-message">
        Looks like you haven't added any products to your cart yet.
      </p>
      <button className="continue-shopping-btn">
        Continue Shopping
      </button>
    </div>
  );
};

export default EmptyCart;