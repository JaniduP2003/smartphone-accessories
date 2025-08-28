// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080/api';

// // Create axios instance with common configurations
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Add token to requests if available
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

// // Handle token expiration and other common errors
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       // Clear invalid token
//       localStorage.removeItem('token');
//       localStorage.removeItem('customerId');
//     }
//     return Promise.reject(error);
//   }
// );

// // Get reviews for a product
// export const getProductReviews = async (productId, page = 0, size = 10) => {
//   try {
//     const response = await api.get(`/reviews/product/${productId}`, {
//       params: { page, size }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching reviews:', error);
//     throw error;
//   }
// };

// // Add a new review
// export const addReview = async (customerId, productId, description) => {
//   if (!customerId || !productId || !description) {
//     throw new Error('Missing required parameters');
//   }

//   try {
//     const response = await api.post('/reviews', {
//       productId: parseInt(productId),
//       description
//     }, {
//       params: { customerId: parseInt(customerId) }
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error('Error adding review:', error);
//     throw error;
//   }
// };

// // Delete a review
// export const deleteReview = async (reviewId, customerId) => {
//   if (!reviewId || !customerId) {
//     throw new Error('Missing required parameters');
//   }

//   try {
//     await api.delete(`/reviews/${reviewId}`, {
//       params: { customerId: parseInt(customerId) }
//     });
//   } catch (error) {
//     console.error('Error deleting review:', error);
//     throw error;
//   }
// };

// // Add a reply to a review
// export const addReply = async (reviewId, content) => {
//   if (!reviewId || !content) {
//     throw new Error('Missing required parameters');
//   }

//   try {
//     const response = await api.post(`/reviews/${reviewId}/replies`, {
//       content
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error adding reply:', error);
//     throw error;
//   }
// };

// // Update a reply
// export const updateReply = async (reviewId, replyId, content) => {
//   if (!reviewId || !replyId || !content) {
//     throw new Error('Missing required parameters');
//   }

//   try {
//     const response = await api.put(`/reviews/${reviewId}/replies/${replyId}`, {
//       content
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error updating reply:', error);
//     throw error;
//   }
// };

// // Delete a reply
// export const deleteReply = async (reviewId, replyId) => {
//   if (!reviewId || !replyId) {
//     throw new Error('Missing required parameters');
//   }

//   try {
//     await api.delete(`/reviews/${reviewId}/replies/${replyId}`);
//   } catch (error) {
//     console.error('Error deleting reply:', error);
//     throw error;
//   }
// }; 

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with common configurations
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Handle token expiration and other common errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('customerId');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
    }
    return Promise.reject(error);
  }
);

// Get reviews for a product
export const getProductReviews = async (productId, page = 0, size = 10) => {
  try {
    const response = await api.get(`/reviews/product/${productId}`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// Add a new review
export const addReview = async (customerId, productId, description) => {
  if (!customerId || !productId || !description) {
    throw new Error('Missing required parameters');
  }

  // Make sure we have clean integers
  const cleanCustomerId = parseInt(customerId, 10);
  const cleanProductId = parseInt(productId, 10);

  try {
    // Based on the server logs, it seems the API might expect the customerId in the body instead of params
    const response = await api.post('/reviews', {
      customerId: cleanCustomerId,
      productId: cleanProductId,
      description
    });
    
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId, customerId) => {
  if (!reviewId || !customerId) {
    throw new Error('Missing required parameters');
  }

  try {
    await api.delete(`/reviews/${reviewId}`, {
      params: { customerId: parseInt(customerId, 10) }
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Add a reply to a review
export const addReply = async (reviewId, content) => {
  if (!reviewId || !content) {
    throw new Error('Missing required parameters');
  }

  try {
    const response = await api.post(`/reviews/${reviewId}/replies`, {
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error adding reply:', error);
    throw error;
  }
};

// Update a reply
export const updateReply = async (reviewId, replyId, content) => {
  if (!reviewId || !replyId || !content) {
    throw new Error('Missing required parameters');
  }

  try {
    const response = await api.put(`/reviews/${reviewId}/replies/${replyId}`, {
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error updating reply:', error);
    throw error;
  }
};

// Delete a reply
export const deleteReply = async (reviewId, replyId) => {
  if (!reviewId || !replyId) {
    throw new Error('Missing required parameters');
  }

  try {
    await api.delete(`/reviews/${reviewId}/replies/${replyId}`);
  } catch (error) {
    console.error('Error deleting reply:', error);
    throw error;
  }
};