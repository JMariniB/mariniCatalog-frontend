import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredProducts: [],
};

const getFormattedDate = (dateString) =>{
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth() + 1; // Los meses en JavaScript son 0-indexados
  const year = date.getFullYear();

  // Retorna la fecha como "DD-MM-YYYY"
  return `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

  }

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_PRODUCTS(state, action) {
      const { products, search } = action.payload;
      const tempProducts = products.filter(
        (product) =>
          product.amzorderid.toLowerCase().includes(search.toLowerCase()) ||
          getFormattedDate(product.amzorderdate).toLowerCase().includes(search.toLowerCase()) ||
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.location.toLowerCase().includes(search.toLowerCase())
      );

      state.filteredProducts = tempProducts;
    },
  },
});

export const { FILTER_PRODUCTS } = filterSlice.actions;

export const selectFilteredProducts = (state) => state.filter.filteredProducts;

export default filterSlice.reducer;
