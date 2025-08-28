import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addItemToCart } from '../services/cartService';
import ReviewSection from './ReviewSection';
import '../styles/ProductDetail.css';

const ProductDetail = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  console.log("Product data in detail:", product); // Debug log
  console.log("Available colors:", product.colors); // Debug log
  console.log("Selected color:", selectedColor); // Debug log

  useEffect(() => {
    // Update selected color when product or product colors change
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product.colors]);

  const handleImageError = () => {
    console.log("Image failed to load, using placeholder");
    setImageError(true);
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    console.log("Color changed to:", e.target.value); // Debug log
  };

  const handleAddToCart = async () => {
    try {
      if (!product.pid) {
        console.error("Missing product ID:", product);
        throw new Error('Product ID is required');
      }

      if (!selectedColor) {
        throw new Error('Please select a color');
      }

      if (selectedQuantity <= 0 || selectedQuantity > product.quantity) {
        throw new Error('Invalid quantity selected');
      }

      console.log("Adding to cart:", {
        productId: product.pid,
        quantity: selectedQuantity,
        price: product.price,
        color: selectedColor
      });

      await addItemToCart(
        product.pid,
        selectedQuantity,
        product.price,
        selectedColor
      );
      
      alert('Added to cart successfully!');
    } catch (error) {
      console.error("Add to cart error:", error);
      if (error.message.includes('Customer ID not found')) {
        alert('Please log in to add items to your cart');
        navigate('/login');
      } else {
        alert(error.message);
      }
    }
  };

  const handleAddToWishlist = async () => {
  const wishlistItem = {
    productName: product.name,
    brand: product.brand,
    image: product.image,
    price: product.price,
    selectedColor: selectedColor,
  };

  try {
    const response = await fetch('http://localhost:8080/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wishlistItem),
    });

    if (response.ok) {
      alert('Added to wishlist!');
    } else {
      alert('Failed to add to wishlist.');
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    alert('Something went wrong.');
  }
};

  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString('en-LK')}`;
  };

  return (
    <div className="product-detail-container-01">
      <button 
        onClick={() => navigate('/phones')} 
        className="back-button-01"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="product-main-content-01">
        <div className="product-image-container-01">
          <img 
            src={imageError ? '/placeholder-image.jpg' : product.image}
            alt={product.name} 
            className="product-image-01"
            onError={handleImageError}
          />
        </div>

        <div className="product-info-01">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-brand">Brand: {product.brand}</p>
          
          <div className="color-selector">
            <label htmlFor="color">Color:</label>
            <select 
              id="color" 
              value={selectedColor}
              onChange={handleColorChange}
              className="color-select"
              required
            >
              {product.colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div className="stock-info-01">
            <span className={`stock-status ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.quantity > 0 ? `In Stock: ${product.quantity} units` : 'Out of Stock'}
            </span>
          </div>

          <p className="product-price">{formatPrice(product.price)}</p>

          {product.quantity > 0 && (
            <div className="quantity-selector-01">
              <label htmlFor="quantity">Quantity:</label>
              <select 
                id="quantity" 
                className="quantity-select-01"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
              >
                {[...Array(Math.min(product.quantity, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          )}

          <div className="product-actions-01">
            <button 
              onClick={handleAddToCart}
              className="add-to-cart-btn-01"
              disabled={product.quantity === 0 || !selectedColor}
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button 
              onClick={handleAddToWishlist}
              className="wishlist-btn-01"
            >
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="product-tabs-01">
        <div className="tab-buttons-01">
          <button 
            className={`tab-btn-01 ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab-btn-01 ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>

        <div className="tab-content-01">
          {activeTab === 'description' ? (
            <div className="description-content-01">
              <p>{product.description}</p>
            </div>
          ) : (
            <div className="reviews-content-01">
              <ReviewSection />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;