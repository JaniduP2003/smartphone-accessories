import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Heart, Trash2, RefreshCw, Plus, Minus } from 'lucide-react';
import '../../styles/CartItem.css';

const CartItem = ({ item, onUpdateQuantity, onRemoveItem, onAddToWishlist }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const [selectedColor, setSelectedColor] = useState(item.color);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleUpdate = () => {
    if (isUpdating) {
      onUpdateQuantity(item.id, quantity);
      setIsUpdating(false);
    } else {
      setIsUpdating(true);
    }
  };

  const availableColors = ['Black', 'White', 'Blue', 'Red', 'Green'];

  return (
    <div className="cart-item">
      <div className="cart-item-image-container">
        <img 
          src={item.image || '/placeholder-image.jpg'}
          alt={item.name} 
          className="cart-item-image" 
          onError={(e) => {
            console.log(`Image load failed for product ${item.productId}, using placeholder`);
            e.target.src = "/placeholder-image.jpg";
          }}
        />
      </div>
      <div className="cart-item-content">
        <div className="cart-item-details">
          <h3 className="cart-item-name">{item.name}</h3>
          <div className="cart-item-color">
            {isUpdating ? (
              <select 
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="color-select"
              >
                {availableColors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            ) : (
              <span>Color: <span className="font-medium">{item.color}</span></span>
            )}
          </div>
          <div className="cart-item-price-info">
            <span className="cart-item-price">LKR {(item.price || 0).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="cart-item-actions">
          <div className="quantity-control">
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={!isUpdating || quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="quantity-display">{quantity}</span>
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={!isUpdating || quantity >= 10}
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="cart-item-total">
            <span className="total-label">Total:</span>
            <span className="total-amount">LKR {((item.price || 0) * quantity).toFixed(2)}</span>
          </div>
          
          <div className="cart-item-buttons">
            <button 
              className="cart-btn wishlist-btn" 
              onClick={() => onAddToWishlist(item.id)}
              title="Add to Wishlist"
            >
              <Heart size={18} />
            </button>
            <button 
              className={`cart-btn update-btn ${isUpdating ? 'updating' : ''}`}
              onClick={handleUpdate}
              title={isUpdating ? "Save Changes" : "Update Item"}
            >
              <RefreshCw size={18} />
              <span>{isUpdating ? "Save" : "Update"}</span>
            </button>
            <button 
              className="cart-btn remove-btn" 
              onClick={() => onRemoveItem(item.id)}
              title="Remove Item"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onAddToWishlist: PropTypes.func.isRequired,
};

export default CartItem;