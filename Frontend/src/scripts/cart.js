/**
 * Setup the shopping cart functionality
 * @param {Array} initialProducts - Initial products to add to cart
 */
export function setupCart(initialProducts) {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Cart state
    let cartItems = [...initialProducts];
    
    /**
     * Calculate the total price of all items in the cart
     * @returns {number} - The total price
     */
    const calculateTotal = () => {
      return cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    };
    
    /**
     * Format price as currency
     * @param {number} price - The price to format
     * @returns {string} - Formatted price
     */
    const formatPrice = (price) => {
      return `₹${price.toLocaleString('en-IN', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      })}`;
    };
    
    /**
     * Update the cart total display
     */
    const updateCartTotal = () => {
      cartTotalElement.textContent = formatPrice(calculateTotal());
    };
    
    /**
     * Update quantity for a cart item
     * @param {string} productId - ID of the product to update
     * @param {number} newQuantity - New quantity value
     */
    const updateQuantity = (productId, newQuantity) => {
      // Ensure quantity is at least 1
      const quantity = Math.max(1, newQuantity);
      
      // Update the cart item quantity
      cartItems = cartItems.map(item => {
        if (item.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      
      // Update the select field value
      const quantitySelect = document.querySelector(`[data-product-id="${productId}"] .quantity-select`);
      if (quantitySelect) {
        quantitySelect.value = quantity;
      }
      
      // Update the item's total price
      const itemPrice = cartItems.find(item => item.id === productId)?.price || 0;
      const totalPriceElement = document.querySelector(`[data-product-id="${productId}"] .item-total`);
      if (totalPriceElement) {
        totalPriceElement.textContent = formatPrice(itemPrice * quantity);
      }
      
      // Update the cart total
      updateCartTotal();
    };
    
    /**
     * Remove an item from the cart
     * @param {string} productId - ID of the product to remove
     */
    const removeItem = (productId) => {
      const cartItem = document.querySelector(`[data-product-id="${productId}"]`);
      
      if (cartItem) {
        // Add the removing class to trigger the animation
        cartItem.classList.add('removing');
        
        // Wait for the animation to complete before removing from DOM
        setTimeout(() => {
          // Remove from cart items array
          cartItems = cartItems.filter(item => item.id !== productId);
          
          // Remove from DOM
          cartItem.remove();
          
          // Update cart total
          updateCartTotal();
          
          // If cart is empty, show empty state
          if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
              <div class="empty-cart">
                <p>Your cart is empty</p>
              </div>
            `;
          }
        }, 250); // Match this to the animation duration
      }
    };
  
    /**
     * Generate options for quantity select
     * @returns {string} - HTML for select options
     */
    const generateQuantityOptions = (currentQuantity) => {
      let options = '';
      for (let i = 1; i <= 10; i++) {
        options += `<option value="${i}" ${i === currentQuantity ? 'selected' : ''}>${i}</option>`;
      }
      return options;
    };
    
    /**
     * Render a cart item
     * @param {Object} item - The cart item to render
     * @returns {string} - HTML for the cart item
     */
    const renderCartItem = (item) => {
      return `
        <div class="cart-item" data-product-id="${item.id}">
          <div class="product-col">
            <div class="product-info">
              <img src="${item.image}" alt="${item.name}" class="product-image">
              <div class="product-details">
                <div>
                  <div class="product-title">${item.name}</div>
                  ${item.color ? `<div class="product-subtitle">Color: ${item.color}</div>` : ''}
                </div>
                <button class="button-remove" data-remove="${item.id}">
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div class="quantity-col">
            <div class="quantity-control">
              <select class="quantity-select" data-quantity="${item.id}">
                ${generateQuantityOptions(item.quantity)}
              </select>
            </div>
          </div>
          <div class="total-col">
            <span class="item-total">${formatPrice(item.price * item.quantity)}</span>
          </div>
        </div>
      `;
    };
    
    /**
     * Render all items in the cart
     */
    const renderCart = () => {
      if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="empty-cart">
            <p>Your cart is empty</p>
          </div>
        `;
        return;
      }
      
      cartItemsContainer.innerHTML = cartItems.map(renderCartItem).join('');
      
      // Add event listeners for quantity controls
      cartItems.forEach(item => {
        // Quantity select
        const quantitySelect = document.querySelector(`[data-quantity="${item.id}"]`);
        if (quantitySelect) {
          quantitySelect.addEventListener('change', (e) => {
            updateQuantity(item.id, parseInt(e.target.value, 10));
          });
        }
        
        // Remove buttons
        const removeButtons = document.querySelectorAll(`[data-remove="${item.id}"]`);
        removeButtons.forEach(button => {
          button.addEventListener('click', () => {
            removeItem(item.id);
          });
        });
      });
    };
    
    // Initialize the cart
    renderCart();
    updateCartTotal();
  }