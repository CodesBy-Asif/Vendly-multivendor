import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    // seller loading & auth
    isAuthenticated: false,
    loading: true,
    seller: null,
    error: null,
    shopCreationLoading: false,
    shopCreationSuccess: false,
    shopCreationError: null,
};

export const sellerReducer = createReducer(initialState, (builder) => {
    builder
        // seller load cases
        .addCase("LoadSellerRequest", (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase("LoadSellerSuccess", (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.seller = action.payload;
            state.error = null;
        })
        .addCase("LoadSellerFail", (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.seller = null;
            state.error = action.payload || "Failed to load seller";
        })
        .addCase("LogoutSeller", (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.seller = null;
            state.error = null;
        })

        // shop creation cases
        .addCase("CREATE_SHOP_REQUEST", (state) => {
            state.shopCreationLoading = true;
            state.shopCreationSuccess = false;
            state.shopCreationError = null;
        })
        .addCase("CREATE_SHOP_SUCCESS", (state) => {
            state.shopCreationLoading = false;
            state.shopCreationSuccess = true;
            state.shopCreationError = null;
        })
        .addCase("CREATE_SHOP_FAIL", (state, action) => {
            state.shopCreationLoading = false;
            state.shopCreationSuccess = false;
            state.shopCreationError = action.payload;
        })

        // optionally reset shop creation success/error state
        .addCase("RESET_SHOP_CREATION", (state) => {
            state.shopCreationLoading = false;
            state.shopCreationSuccess = false;
            state.shopCreationError = null;
        });
});
