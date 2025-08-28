import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Prodnavbar.css';

function Prodnavbar() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  // Sync activeTab with URL changes
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <nav className="prod-navbar">
      <div className="prod-nav-content">
        <Link to="/phones">
          <button
            className={`prod-nav-button ${activeTab === '/phones' ? 'active' : ''}`}
            onClick={() => handleTabClick('/phones')}
          >
            Mobile Phones
          </button>
        </Link>

        <Link to="/earphones">
          <button
            className={`prod-nav-button ${activeTab === '/earphones' ? 'active' : ''}`}
            onClick={() => handleTabClick('/earphones')}
          >
            Earphones
          </button>
        </Link>

        <Link to="/Laptops">
          <button
            className={`prod-nav-button ${activeTab === '/Laptops' ? 'active' : ''}`}
            onClick={() => handleTabClick('/Laptops')}
          >
            Laptops
          </button>
        </Link>

        <Link to="/storage">
          <button
            className={`prod-nav-button ${activeTab === '/storage' ? 'active' : ''}`}
            onClick={() => handleTabClick('/storage')}
          >
            Storage Devices
          </button>
        </Link>

        <Link to="/other-accessories">
          <button
            className={`prod-nav-button ${activeTab === '/other-accessories' ? 'active' : ''}`}
            onClick={() => handleTabClick('/other-accessories')}
          >
            Other Accessories
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Prodnavbar;