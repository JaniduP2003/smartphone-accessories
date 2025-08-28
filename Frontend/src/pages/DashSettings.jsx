import React from "react";
import Navbar from "../components/Navbar";
import { IoSettingsSharp } from "react-icons/io5"; // Import the settings icon


const DashSettings = () => {
  return (
    <div>
      {/* Header with icon */}
      <header>
        <IoSettingsSharp />
      </header>

      {/* Navbar */}
      <Navbar />

      {/* Page content */}
      <h1>Dashboard Settings</h1>
      <p>Configure your dashboard settings here.</p>
    </div>
  );
};

export default DashSettings;