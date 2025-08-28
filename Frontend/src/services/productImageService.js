// Map to store product images by product ID
let productImageMap = new Map();

// Function to store a product's image URL
export const storeProductImage = (productId, imageUrl) => {
    console.log(`Storing image for product ${productId}:`, imageUrl);
    productImageMap.set(productId, imageUrl);
    console.log('Current image map:', Array.from(productImageMap.entries()));
};

// Function to get a product's image URL
export const getProductImage = (productId) => {
    console.log(`Getting image for product ${productId}`);
    const imageUrl = productImageMap.get(productId) || '/placeholder-image.jpg';
    console.log(`Retrieved image URL:`, imageUrl);
    return imageUrl;
};

// Function to clear the image map (useful for cleanup)
export const clearImageMap = () => {
    console.log('Clearing image map');
    productImageMap.clear();
}; 