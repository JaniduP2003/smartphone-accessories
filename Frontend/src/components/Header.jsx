import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../styles/Header.css';  // Use custom CSS to style the navbar

const API_BASE_URL = 'http://localhost:8080';

// Need to import context for user data & backend functionality

function Header({ category }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/products/search?pname=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(category)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Update current page with search results
        if (response.data && response.data.length > 0) {
          // Update the current location's state and force a re-render
          window.history.replaceState({ searchResults: response.data }, '');
          window.dispatchEvent(new PopStateEvent('popstate'));
        } else {
          console.log('No products found in', category);
        }
      } catch (error) {
        console.error('Search error:', error);
        if (error.response?.status === 403) {
          navigate('/login');
        }
      }
    }
  };

  // Toggle dropdown when clicking the profile container
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar-01">
      <div className="navbar-logo">
        <Link to="/phones">MACKTECH MOBILES</Link>
      </div>

      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      <div className="navbar-links">
        {/* Profile Container */}
        <div className="profile-container" onClick={toggleDropdown}>
          <div className="profile-item">
            <div className="profile-pic"></div> {/* Profile Picture */}
            <span className="profile-text">Profile</span>
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/profile">
                <button>Settings</button>
              </Link>
              <button onClick={() => {
                localStorage.clear();
                navigate('/');
              }}>Logout</button>
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <Link to="/WishlistPage">
          <button className="wishlist-button">Wishlist</button>
        </Link>

        {/* Cart Button */}
        <Link to="/cart">
          <button className="cart-button">Cart</button>
        </Link>
      </div>
    </nav>
  );
}

Header.propTypes = {
  category: PropTypes.string.isRequired
};

export default Header;
