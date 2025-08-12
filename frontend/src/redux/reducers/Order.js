import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    orders: [],
    shopOrders: [], // separate state for shop orders
    loading: false,
    error: null,
    success: false, // For create or update order success
};

export const ordersReducer = createReducer(initialState, (builder) => {
    builder

        // FETCH USER ORDERS
        .addCase("FetchOrdersRequest", (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase("FetchOrdersSuccess", (state, action) => {
            state.orders = action.payload;
            state.loading = false;
            state.error = null;
        })
        .addCase("FetchOrdersFail", (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch orders";
        })

        // FETCH SHOP ORDERS
        .addCase("FetchShopOrdersRequest", (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase("FetchShopOrdersSuccess", (state, action) => {
            state.shopOrders = action.payload;
            state.loading = false;
            state.error = null;
        })
        .addCase("FetchShopOrdersFail", (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch shop orders";
        })

        // CREATE ORDER
        .addCase("CreateOrderRequest", (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase("CreateOrderSuccess", (state, action) => {
            state.loading = false;
            state.orders.unshift(action.payload); // Add to top
            state.success = true;
        })
        .addCase("CreateOrderFail", (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to create order";
            state.success = false;
        })

        // UPDATE ORDER
        .addCase("UpdateOrderRequest", (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase("UpdateOrderSuccess", (state, action) => {
            state.loading = false;
            state.success = true;

            const updatedOrder = action.payload;

            const index = state.orders.findIndex(o => o._id === updatedOrder._id);
            if (index !== -1) state.orders[index] = updatedOrder;

            const shopIndex = state.shopOrders.findIndex(o => o._id === updatedOrder._id);
            if (shopIndex !== -1) state.shopOrders[shopIndex] = updatedOrder;
        })

        .addCase("UpdateOrderFail", (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to update order";
            state.success = false;
        })

        // DELETE ORDER
        .addCase("DeleteOrderRequest", (state) => {
            state.loading = true;
        })
        .addCase("DeleteOrderSuccess", (state, action) => {
            state.loading = false;
            state.orders = state.orders.filter((order) => order._id !== action.payload);
            state.shopOrders = state.shopOrders.filter((order) => order._id !== action.payload);
        })
        .addCase("DeleteOrderFail", (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to delete order";
        })

        // RESET
        .addCase("ResetOrders", () => initialState);
});
