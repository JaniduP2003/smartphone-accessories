import { setupCart } from './cart.js';
import { products } from '../data/data.js';

// Initialize the shopping cart
document.addEventListener('DOMContentLoaded', () => {
  setupCart(products);
  
  // Add event listener for continue shopping button
  const continueShoppingBtn = document.getElementById('continue-shopping');
  continueShoppingBtn.addEventListener('click', () => {
    alert('Continue shopping clicked!');
  });
  
  // Add event listener for checkout button
  const checkoutBtn = document.getElementById('checkout-button');
  checkoutBtn.addEventListener('click', () => {
    const termsCheckbox = document.getElementById('terms-checkbox');
    
    if (!termsCheckbox.checked) {
      alert('Please agree to the terms and conditions to proceed.');
      return;
    }
    
    alert('Proceeding to checkout!');
  });
});