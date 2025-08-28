import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import { storeProductImage } from '../services/productImageService';
import '../styles/ProductsGrid.css';

const ProductsGrid = ({ category }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('default');
  const [stockFilter, setStockFilter] = useState('all');
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:8080';

  // Handle popstate events (for search results)
  useEffect(() => {
    const handlePopState = () => {
      const state = window.history.state;
      if (state?.searchResults) {
        setProducts(state.searchResults);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = `${API_BASE_URL}/api/products/filter?category=${category}`;
      if (selectedBrand) {
        url += `&brand=${selectedBrand}`;
      }
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Process products, ensuring all have unique keys and IDs
      const uniqueProducts = {};
      console.log("Raw product data:", response.data); // Debug log
      response.data.forEach(product => {
        // Use the actual numeric ID from the backend
        const productWithId = {
          ...product,
          pid: product.pid // Use the actual numeric ID
        };
        // Store the product image URL in our service
        if (product.imageUrl) {
          console.log(`Storing image for product ${product.pid}:`, product.imageUrl);
          storeProductImage(product.pid, product.imageUrl);
        } else {
          console.log(`No image URL for product ${product.pid}`);
        }
        uniqueProducts[productWithId.pid] = productWithId;
      });
      
      const processedProducts = Object.values(uniqueProducts);
      console.log("Processed products with IDs:", processedProducts); // Debug log
      setProducts(processedProducts);
      setError(null);
    } catch (err) {
      console.error("API Error:", err);
      setError(`Failed to fetch products: ${err.response?.data?.message || err.message}`);
      setProducts([]);
      if (err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/brands?category=${category}`);
      setBrands(response.data);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
      setBrands([]);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchProducts();
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [selectedBrand]);

  const filteredProducts = products.filter(product => {
    const inStock = product.quantity > 0;
    if (stockFilter === 'all') return true;
    if (stockFilter === 'inStock') return inStock;
    if (stockFilter === 'outOfStock') return !inStock;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'priceLow') return a.price - b.price;
    if (sortOrder === 'priceHigh') return b.price - a.price;
    if (sortOrder === 'name') return a.pname.localeCompare(b.pname);
    return 0;
  });

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>{category}</h2>
        <p>Explore our {category.toLowerCase()} collection</p>
      </div>
      
      <div className="filter-controls">
        <div className="sort-by">
          <select 
            className="sort-dropdown" 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Sort By: Featured</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
        
        {/* Brand filter dropdown */}
        <div className="brand-filter">
          <select
            className="brand-dropdown"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        
        <div className="status-filter">
          <button 
            className={`filter-btn ${stockFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStockFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${stockFilter === 'inStock' ? 'active' : ''}`}
            onClick={() => setStockFilter('inStock')}
          >
            In Stock
          </button>
          <button 
            className={`filter-btn ${stockFilter === 'outOfStock' ? 'active' : ''}`}
            onClick={() => setStockFilter('outOfStock')}
          >
            Out of Stock
          </button>
        </div>
      </div>
      
      {loading && <div className="loading">Loading products...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && sortedProducts.length === 0 && (
        <div className="no-products">No products found.</div>
      )}

      <div className="products-grid">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.pid}
            name={product.pname}
            productName={product.pname}
            price={product.price}
            image={product.imageUrl}
            quantity={product.quantity}
            inStock={product.quantity > 0}
            brand={product.brand}
            category={product.category}
            pid={product.pid}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;