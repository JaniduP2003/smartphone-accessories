import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

// Get product by name
export const getProductByName = async (name) => {
  try {
    // First, need to get products by category and filter by name
    // Since there's no direct endpoint to get product by name,
    // we'll use the search endpoint and pass the category as a wildcard or common category
    
    // URL decode the name parameter if it's encoded
    const decodedName = decodeURIComponent(name);
    
    // Get products by search using the name and a wildcard category
    // You can modify this to search across all categories you have in your application
    const categories = ['Smartphones', 'Laptops', 'Accessories', 'Audio']; 
    
    // Try each category until we find the product
    for (const category of categories) {
      const response = await axios.get(
        `${API_BASE_URL}/api/products/search?pname=${decodedName}&category=${category}`
      );
      
      // If we found products matching the name in this category
      if (response.data && response.data.length > 0) {
        // Find the exact match by name (case insensitive)
        const exactMatch = response.data.find(
          product => product.pname.toLowerCase() === decodedName.toLowerCase()
        );
        
        // Return the exact match if found, otherwise return the first result
        if (exactMatch) {
          return exactMatch;
        } else if (response.data[0]) {
          return response.data[0];
        }
      }
    }
    
    throw new Error('Product not found');
  } catch (error) {
    console.error('Error fetching product by name:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products/filter?category=${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Get products by category and brand
export const getProductsByCategoryAndBrand = async (category, brand) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products/filter?category=${category}&brand=${brand}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category and brand:', error);
    throw error;
  }
};

// Search products by name and category
export const searchProducts = async (name, category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products/search?pname=${name}&category=${category}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};