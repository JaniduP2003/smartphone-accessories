// // src/services/api.js

// const API_BASE_URL = 'http://localhost:8080/api';

// export const getProducts = async () => {
//     const response = await fetch(`${API_BASE_URL}/products`);
//     if (!response.ok) {
//         throw new Error('Failed to fetch products');
//     }
//     return await response.json();
// };

// export const getProductById = async (id) => {
//     const response = await fetch(`${API_BASE_URL}/products/${id}`);
//     if (!response.ok) {
//         throw new Error(`Failed to fetch product with id ${id}`);
//     }
//     return await response.json();
// };

// export const getProductsByCategory = async (category) => {
//     const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
//     if (!response.ok) {
//         throw new Error(`Failed to fetch products in category ${category}`);
//     }
//     return await response.json();
// };

// export const createProduct = async (product) => {
//     const response = await fetch(`${API_BASE_URL}/products`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(product),
//     });
//     if (!response.ok) {
//         throw new Error('Failed to create product');
//     }
//     return await response.json();
// };

// export const deleteProduct = async (id) => {
//     const response = await fetch(`${API_BASE_URL}/products/${id}`, {
//         method: 'DELETE',
//     });
//     if (!response.ok) {
//         throw new Error(`Failed to delete product with id ${id}`);
//     }
// };