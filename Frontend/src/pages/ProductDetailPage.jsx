import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';
import { getProductById, getProductByName } from '../services/productService';
import '../styles/ProductDetailPage.css';
import CartHeader from '../components/Cart/CartHeader';

// Backend model and frontend prop mapping
const mapProductData = (productData) => {
  if (!productData) return null;
  
  console.log("Raw product data in detail page:", productData); // Debug log
  
  // Parse the colour string into an array if it contains multiple colors
  let colors = [];
  if (productData.colour) {
    // First try to parse as JSON array
    try {
      colors = JSON.parse(productData.colour);
    } catch (e) {
      // If not JSON, treat as comma-separated string
      if (productData.colour.includes(',')) {
        colors = productData.colour.split(',').map(c => c.trim());
      } else {
        // Single color
        colors = [productData.colour.trim()];
      }
    }
  }
  
  // If no colors are specified, provide default colors based on the category
  if (!colors || colors.length === 0) {
    switch(productData.category?.toLowerCase()) {
      case 'smartphones':
        colors = ['Black', 'White', 'Gold', 'Silver'];
        break;
      case 'laptops':
        colors = ['Silver', 'Space Gray', 'Black'];
        break;
      case 'accessories':
        colors = ['Black', 'White'];
        break;
      default:
        colors = ['Black'];
    }
  }
  
  console.log("Parsed colors:", colors); // Debug log
  
  const mappedData = {
    ...productData,
    // Map backend fields to frontend expected props
    name: productData.pname,
    inStock: productData.quantity > 0,  // Convert to boolean
    image: productData.imageUrl || '/placeholder-image.jpg', // Add fallback image
    description: productData.description || 'No description available', 
    colors: colors,
    selectedColor: colors[0],  // Set first color as default
    quantity: productData.quantity,
    pid: productData.pid
  };

  console.log("Mapped product data:", mappedData); // Debug log for verification
  return mappedData;
};

const ProductDetailPage = () => {
  const { id, name } = useParams(); // Get both id and name parameters
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let productData;
        
        // Always try to use ID first if available, fallback to name only if necessary
        if (id) {
          productData = await getProductById(id);
        } else if (name) {
          productData = await getProductByName(name);
        } else {
          throw new Error('No product identifier provided');
        }
        
        // Map backend data to the format expected by ProductDetail component
        const mappedProduct = mapProductData(productData);
        
        if (!mappedProduct) {
          throw new Error('Product not found');
        }
        
        setProduct(mappedProduct);
      } catch (error) {
        console.error('Failed to load product:', error);
        setError(error.message || 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, name]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <p>{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div>
      <CartHeader />
      <div className="product-detail-page">
        <ProductDetail product={product} />
      </div>
    </div>
  );
};

export default ProductDetailPage;