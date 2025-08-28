import React from "react";
import { useNavigate } from "react-router-dom";
import { addItemToCart } from "../services/cartService";
import "../styles/ProductCard.css";

function ProductCard({ name, productName, price, image, inStock, quantity, brand, category, pid }) {
  const navigate = useNavigate();
  
  // Placeholder image if none provided
  const displayImage = image || "/placeholder-image.jpg";
  
  // Format price to show as LKR (Lankan Rupees)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0
  }).format(price);

  // Navigate to product details page using product ID as the identifier
  const handleDetailsClick = () => {
    if (!pid) {
      console.error('Product ID is missing');
      return;
    }
    navigate(`/product/${pid}`);
  };
  
  // Add to cart functionality
  const handleBuyNowClick = async () => {
    try {
      // Default quantity to add is 1
      const quantityToAdd = 1;
      
      if (!pid) {
        throw new Error('Product ID is required');
      }

      await addItemToCart(pid, quantityToAdd, price);
      
      // Show success message 
      alert(`${name} added to cart!`);
      
      // Optional: Navigate to cart page
      // navigate('/cart');
    } catch (error) {
      if (error.message.includes('Customer ID not found')) {
        // If user is not logged in, redirect to login page
        alert('Please log in to add items to your cart');
        navigate('/login');
      } else {
        // Other errors
        alert(`Failed to add to cart: ${error.message}`);
      }
    }
  };

  return (
    <div className="product-card">
      <div>
        <img 
          src={displayImage} 
          alt={name} 
          className="product-image"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />
        <h3 className="product-name">{name}</h3>
        
        <div className="product-info-row">
          <p className="product-price">{formattedPrice}</p>
          <div className="product-stock-info">
            <span className="product-quantity">Qty: {quantity || 0}</span>
            <span className={`product-stock ${inStock ? 'in-stock' : 'out-of-stock'}`}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="product-buttons">
        <button 
          className="btn buy-now" 
          disabled={!inStock}
          onClick={handleBuyNowClick}
        >
          {inStock ? 'Buy Now' : 'Sold Out'}
        </button>
        <button className="btn details" onClick={handleDetailsClick}>Details</button>
      </div>
    </div>
  );
}

export default ProductCard;