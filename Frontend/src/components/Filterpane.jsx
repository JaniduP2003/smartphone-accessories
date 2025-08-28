
import React, { useState, useEffect } from 'react';
import '../styles/FilterPane.css';

const FilterPane = ({ category = "Smartphones", onBrandSelect = () => {} }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('loading');

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      setApiStatus('loading');
      setError(null);

      try {
        const url = `http://localhost:8080/api/products/brands?category=${encodeURIComponent(category)}`;
        console.log('Fetching brands from:', url);

        const response = await fetch(url, {
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`Error fetching brands: ${response.status}`);
        }

        const rawText = await response.text();
        console.log('Raw response:', rawText);

        let data;
        try {
          data = JSON.parse(rawText);
          console.log('Parsed brand data:', data);

          if (Array.isArray(data)) {
            setBrands(data);
            setApiStatus('success');
          } else if (data && typeof data === 'object') {
            const brandsData = data.brands || data.data || [];
            if (Array.isArray(brandsData)) {
              setBrands(brandsData);
              setApiStatus('success');
            } else {
              throw new Error('API response does not contain a valid brands array');
            }
          } else {
            throw new Error('Unexpected API response format');
          }
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          setApiStatus('parse-error');
          throw new Error('Could not parse API response as JSON');
        }

      } catch (err) {
        console.error("Failed to fetch brands:", err);
        setError(err.message);
        setApiStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, [category]); // refetch brands when category changes

  const handleBrandChange = (brand) => {
    if (selectedBrand === brand) {
      setSelectedBrand(null);
      onBrandSelect(null);
    } else {
      setSelectedBrand(brand);
      onBrandSelect(brand);
    }
  };

  const handleClearFilters = () => {
    setSelectedBrand(null);
    onBrandSelect(null);
  };

  const handleApplyFilters = () => {
    onBrandSelect(selectedBrand);
  };

  return (
    <div className="filter-pane">
      {/* <div className="filter-header">
        <h3>Filters</h3>
      </div>

      <div className={`filter-content ${isVisible ? '' : 'hidden'}`}>
        <div className="filter-section">
          <h4>Brands Available</h4>

          {isLoading && <p>Loading brands...</p>}

          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
              <p>API Status: {apiStatus}</p>
              <p>Check console for details.</p>
            </div>
          )}

          {!isLoading && !error && brands.length === 0 && (
            <p>No brands available for {category}</p>
          )}

          {brands.length > 0 && (
            <div className="options">
              {brands.map(brand => (
                <label key={brand} className="filter-label">
                  <input 
                    type="checkbox" 
                    checked={selectedBrand === brand}
                    onChange={() => handleBrandChange(brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="filter-buttons">
          <button 
            className="apply-btn"
            onClick={handleApplyFilters}
            disabled={!selectedBrand}
          >
            Apply
          </button>
          <button 
            className="clear-btn"
            onClick={handleClearFilters}
            disabled={!selectedBrand}
          >
            Clear
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default FilterPane;
