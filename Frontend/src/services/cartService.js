import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with common configurations
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get the current user's customer ID from local storage
const getCustomerId = () => {
  const customerId = localStorage.getItem('customerId');
  if (!customerId) {
    throw new Error('Customer ID not found. Please log in.');
  }
  return customerId;
};

// Get cart for a customer
export const getCart = async () => {
  try {
    const customerId = getCustomerId();
    const response = await apiClient.get(`/api/carts?customerId=${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// Get cart items - returns the items array from the cart
export const getCartItems = async () => {
  try {
    const cart = await getCart();
    console.log('Cart data received:', cart);
    return cart?.items?.map(item => {
      console.log('Processing cart item:', item);
      const mappedItem = {
        id: item.id,
        name: item.productName,
        price: item.unitPrice,
        quantity: item.quantity,
        color: item.color || 'Default',
        productId: item.productId,
        image: item.imageUrl || '/placeholder-image.jpg',  // Use imageUrl from backend
        totalPrice: item.totalPrice
      };
      console.log('Mapped cart item:', mappedItem);
      return mappedItem;
    }) || [];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

// Add item to cart
export const addItemToCart = async (productId, quantity, price, color) => {
  try {
    const customerId = getCustomerId();
    
    const cartItemDTO = {
      productId: Number(productId), // Ensure productId is a number
      quantity: Number(quantity),   // Ensure quantity is a number
      price: Number(price),        // Ensure price is a number
      color: color                 // Include the selected color
    };
    
    const response = await apiClient.post(
      `/api/carts/items?customerId=${customerId}`, 
      cartItemDTO
    );
    
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

// Remove item from cart
export const removeItemFromCart = async (itemId) => {
  try {
    const customerId = getCustomerId();
    await apiClient.delete(`/api/carts/items/${itemId}?customerId=${customerId}`);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

// Update item quantity in cart
export const updateCartItem = async (itemId, quantity, price) => {
  try {
    const customerId = getCustomerId();
    
    const cartItemDTO = {
      quantity: Number(quantity),
      price: Number(price)
    };
    
    const response = await apiClient.put(
      `/api/carts/items/${itemId}?customerId=${customerId}`, 
      cartItemDTO
    );
    
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

// Clear the entire cart
export const clearCart = async () => {
  try {
    const customerId = getCustomerId();
    await apiClient.delete(`/api/carts?customerId=${customerId}`);
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};