import axios from "axios";

// Function to fetch products based on filters
export const fetchProducts = async (filters) => {
  try {
    const response = await axios.get("http://localhost:8080/api/products/filter", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
