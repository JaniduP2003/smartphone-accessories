// import React from "react";
// import { Link } from "react-router-dom"; // Import Link from react-router-dom
// import logo from "./dashboard.jpg"; // Ensure path to the logo image is correct


// const Navbar = () => {
//   return (
//     <div className="sidenav active">
//       <img src={logo} alt="Logo" className="logo" />
//       <ul>
//         <li>
//           <Link to="/">Home</Link> {/* Link for the Home route */}
//         </li>
//         <li>
//           <Link to="/Products">Product</Link> {/* Link for the Products route */}
//         </li>
//         <li>
//           <Link to="/DashSettings">Settings</Link> {/* Example of a Settings route */}
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Navbar;


import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import logo from "./dashboard.jpg"; // Ensure path to the logo image is correct


const Navbar = () => {
  return (
    <div className="sidebar"> {/* <- Changed from 'sidenav active' to 'sidebar' */}
      <img src={logo} alt="Logo" className="logo" style={{ width: "85%", marginBottom: "20px" }} />
      <Link to="/Dashboard">Home</Link>
      <Link to="/Reviews">Review</Link>
      <Link to="/adminquery">Coustermor Querry</Link>
      <Link to="/phones">Product</Link>
      <Link to="/Orders">Order</Link>
    </div>
  );
};

export default Navbar;