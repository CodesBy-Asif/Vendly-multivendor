import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    loading: false,
    error: null,
    success: false, // for create product success
};

export const productsReducer = createReducer(initialState, (builder) => {
    builder
        // FETCH PRODUCTS
        .addCase("FetchProductsRequest", (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase("FetchProductsSuccess", (state, action) => {
            state.products = action.payload;
            state.error = null;
            state.loading = false;
        })
        .addCase("FetchProductsFail", (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch products";
        })

        // CREATE PRODUCT
        .addCase("CreateProductRequest", (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase("CreateProductSuccess", (state, action) => {
            state.loading = false;
            state.products.unshift(action.payload); // add to the top
            state.success = true;
        })
        .addCase("CreateProductFail", (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to create product";
            state.success = false;
        })

        // UPDATE PRODUCT
        .addCase("UpdateProductRequest", (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase("UpdateProductSuccess", (state, action) => {
            state.loading = false;
            state.success = true;

            // Update the product in the products array
            const index = state.products.findIndex(
                (product) => product._id === action.payload._id
            );
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        })
        .addCase("UpdateProductFail", (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to update product";
            state.success = false;
        })

        // RESET STATE
        .addCase("ResetProducts", () => initialState);
});
