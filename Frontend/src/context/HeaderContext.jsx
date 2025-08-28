// HeaderContext.jsx
import React, { createContext, useState, useEffect, useRef } from 'react';

// Create context
export const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const profileContainerRef = useRef(null);
  const userId = 1; // Assuming user ID is 1, replace it as needed

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileContainerRef.current && !profileContainerRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch profile picture
  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const response = await fetch(`/api/user-profile/${userId}`);
        const data = await response.json();
        setProfilePic(data.profilePic);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePic();
  }, [userId]);

  return (
    <HeaderContext.Provider value={{ dropdownOpen, setDropdownOpen, profilePic, profileContainerRef }}>
      {children}
    </HeaderContext.Provider>
  );
};
