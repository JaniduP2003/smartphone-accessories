import React from "react";
import Header from "../components/Header";
import Prodnavbar from "../components/Prodnavbar";
import FilterPane from "../components/Filterpane";
import ProductsGrid from "../components/ProductsGrid";
import '../styles/Phoneprod.css';

function Earphonesprod() {
  const CATEGORY = "Laptops"; // Set dynamically per page

  return (
    <div className="page-wrapper">
      <Header category={CATEGORY} />
      <Prodnavbar />
      <div className="content-container">
        <div className="content-layout">
          <aside className="filter-sidebar">
            <FilterPane />
          </aside>
          <main className="main-content">
            <ProductsGrid category={CATEGORY} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Earphonesprod;
