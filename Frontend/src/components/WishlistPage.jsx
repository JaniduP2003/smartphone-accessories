import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/WishlistPage.css';

import CartHeader from '../components/Cart/CartHeader';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/wishlist');
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/wishlist/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Item removed from wishlist successfully.');
        setWishlist((prev) => prev.filter((item) => item.id !== id));

      } else {
        alert('Failed to remove item from wishlist.');
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleAddToCart = (item) => {
    // Customize this to call your cart API if needed
    alert(`Added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <>
      <CartHeader />
      <div className="wishlist-page">
        {wishlist.length === 0 ? (
          <>
            <p className="empty-message">Your wishlist is empty.</p>
            <button onClick={() => navigate('/phones')} className="wishlist-back-btn">
              Back to Home
            </button>
          </>
        ) : (
          <>
            <h2 className="wishlist-title">My Wishlist</h2>
            <div className="wishlist-grid">
              {wishlist.map((item) => (
                <div key={item.id} className="wishlist-card">
                  <img src={item.image} alt={item.productName} className="wishlist-image" />
                  <div className="wishlist-details">
                    <h3>{item.productName}</h3>
                    <p>Brand: {item.brand}</p>
                    <p>Color: {item.selectedColor}</p>
                    <p className="wishlist-price">Rs. {item.price.toLocaleString('en-LK')}</p>
                  </div>
                  <div className="wishlist-actions">
                    <button className="wishlist-add-btn" onClick={() => handleAddToCart(item)}>
                      Add to Cart
                    </button>
                    <button className="wishlist-remove" onClick={() => handleRemove(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/phones')} className="wishlist-back-btn">
              Back to Home
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default WishlistPage;
