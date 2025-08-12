import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null,
};

export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("LoadUserRequest", (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase("LoadUserSuccess", (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
        })
        .addCase("LoadUserFail", (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload || "Failed to load user";
        })
        .addCase("LogoutUser", (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        })

        // ✅ General Loading/Error for Profile, Avatar, Password, Address
        .addCase("UserLoading", (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase("UserError", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ✅ Password Changed (No user payload)
        .addCase("PasswordChanged", (state) => {
            state.loading = false;
            state.error = null;
        });

});
