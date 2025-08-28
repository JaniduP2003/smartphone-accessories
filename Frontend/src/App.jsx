import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import AuthCard from "./components/AuthCard";
import ProtectedRoute from "./components/ProtectedRoute";

import Phoneprod from "./pages/Phoneprod";
import Storageprod from "./pages/Storageprod";
import Earphonesprod from "./pages/Earphonesprod";
import Accessoriesprod from "./pages/Accessoriesprod";
import Lapprod from "./pages/Lapprod";

import ProductDetailPage from "./pages/ProductDetailPage";

import Cartpage from "./pages/Cartpage";
import Profilepage from "./pages/Profilepage";
import Checkout from "./pages/PaymentPage";
import Products from "./pages/Products";

import Query from "./pages/query";
import AdminQuery from "./pages/AdminQuery";

import Orders from "./pages/Orders"; 
import Reviews from "./pages/reviews";
// import Wishlist from "./pages/WishlistPage";
import WishlistPage from "./components/WishlistPage";


function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AuthCard />} />
        <Route path="/login" element={<AuthCard />} />

        <Route path="/phones" element={<Phoneprod />}/>
        <Route path="/storage" element={<Storageprod />}/>
        <Route path="/earphones" element={<Earphonesprod />}/>
        <Route path="/other-accessories" element={<Accessoriesprod />}/>
        <Route path="/laptops" element={<Lapprod />}/>
        
        <Route path="/query" element={<Query />}/>
        <Route path="/adminquery" element={<AdminQuery />}/>


        {/* <Route path="/productdtls/:id" element={<ProductDetailPage />} /> */}
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/product/name/:name" element={<ProductDetailPage />} />

        <Route path="/cart" element={<Cartpage />}/>
        <Route path="/profile" element={<Profilepage />}/>
        <Route path="/checkout" element={<Checkout />}/>
        
        <Route path="/Reviews" element={<Reviews />}/>
        <Route path="/Orders" element={<Orders />}/>

        <Route path="/WishlistPage" element={<WishlistPage />} />

        {/* Admin Routes */}
        <Route path="/Dashboard" element={<ProtectedRoute requiredRole="ADMIN"><Products /></ProtectedRoute>}/>
        <Route path="/admin/*" element={<ProtectedRoute requiredRole="ADMIN"><Products /></ProtectedRoute>}/>
      </Routes>
    </div>
  );
}

export default App;
