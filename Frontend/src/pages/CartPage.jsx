import React, { useState, useEffect } from 'react';
import CartItem from '../components/Cart/Cartitem';
import OrderSummary from '../components/Cart/OrderSummary';
import EmptyCart from '../components/Cart/EmptyCart';
import { getCartItems, removeItemFromCart } from '../services/cartService';
import '../styles/CartPage.css';

import CartHeader from '../components/Cart/CartHeader';
import Prodnavbar from '../components/Prodnavbar';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCartItems = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
      setError(null);
    } catch (error) {
      console.error('Failed to load cart items:', error);
      setError('Failed to load cart items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  const handleUpdateQuantity = (id, quantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = async (id) => {
    try {
      await removeItemFromCart(id);
      // Only update the UI if the backend call was successful
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      setError(null);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setError('Failed to remove item. Please try again.');
    }
  };

  const handleAddToWishlist = (id) => {
    console.log(`Added item ${id} to wishlist`);
    alert(`Item added to wishlist!`);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0 && !error) {
    return <EmptyCart />;
  }

  return (
    <div>
      <CartHeader />
      <Prodnavbar />
      <div className="cart-page">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map(item => (
              <CartItem 
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
          
          <OrderSummary items={cartItems} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;