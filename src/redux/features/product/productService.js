import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/products/`;

// Create New Product
const createProduct = async (formData) => {
  const response = await axios.post(API_URL, formData);
  return response.data;
};

// Create New Products bulk
const createProducts = async (jsonData) => {
  const response = await axios.post(`${API_URL}bulk/`, jsonData);
  return response.data;
};

// Get all products
const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Delete a Product
const deleteProduct = async (id) => {
  const response = await axios.delete(API_URL + id);
  console.log(response)
  return response.data;
};
// Get a Product
const getProduct = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};
// Update Product
const updateProduct = async (id, formData) => {
  const response = await axios.patch(`${API_URL}${id}`, formData);
  return response.data;
};

// Update prices from Amazon.es
const updatePrices = async () => {
  const response = await axios.post(`${API_URL}update-prices`);
  return response.data;
};

// Update price for a single product
const updateSinglePrice = async (id) => {
  const response = await axios.post(`${API_URL}${id}/update-price`);
  return response.data;
};

const productService = {
  createProduct,
  createProducts,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  updatePrices,
  updateSinglePrice,
};

export default productService;
