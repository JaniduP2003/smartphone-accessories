import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/OrderSummary.css';

const OrderSummary = ({ items }) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  return (
    <div className="order-summary">
      <h2 className="summary-title">Order Summary</h2>
      
      <div className="summary-items">
        {items.map(item => (
          <div key={item.id} className="summary-item">
            <span className="item-name">
              {item.name} <span className="item-quantity">x{item.quantity}</span>
            </span>
            <span className="item-price">LKR {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <div className="summary-total">
        <span>Total</span>
        <span>LKR {subtotal.toFixed(2)}</span>
      </div>
      
      <button className="checkout-button">
        Checkout
      </button>
    </div>
  );
};

OrderSummary.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default OrderSummary;