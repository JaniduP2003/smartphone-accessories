import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Header.css';  // Use custom CSS to style the navbar

// Need to import context for user data & backend functionality

function CartHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle dropdown when clicking the profile container
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage data
    navigate('/'); // Redirect to root page
  };

  return (
    <nav className="navbar-01">
      <div className="navbar-logo">
        <Link to="/phones">MACKTECH MOBILES</Link>
      </div>

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
              <button onClick={handleLogout}>Logout</button>
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

export default CartHeader;
