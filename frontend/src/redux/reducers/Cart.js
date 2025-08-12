// src/redux/reducers/cartReducer.js
import { createReducer } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// LocalStorage Helpers
const getCartFromStorage = () => {
    try {
        const data = localStorage.getItem("cart");
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const saveCartToStorage = (cart) => {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch { }
};

const initialState = {
    cart: getCartFromStorage(),
};

export const cartReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("AddToCart", (state, action) => {
            const exists = state.cart.find((item) => item._id === action.payload._id);

            if (exists) {
                // Don't exceed stock
                const newQty = exists.quantity + action.payload.quantity;
                exists.quantity = Math.min(newQty, exists.stock);
            } else {
                // Ensure quantity doesn't exceed stock
                const safeProduct = {
                    ...action.payload,
                    quantity: Math.min(action.payload.quantity, action.payload.stock),
                };
                state.cart.push(safeProduct);
            }
            toast.success("item added to cart");
            saveCartToStorage(state.cart);
        })
        .addCase("RemoveFromCart", (state, action) => {
            state.cart = state.cart.filter((item) => item._id !== action.payload);
            toast.success("item removed from cart");
            saveCartToStorage(state.cart);

        })
        .addCase("ClearCart", (state) => {
            state.cart = [];
            saveCartToStorage([]);
        })
        .addCase("UpdateCartQuantity", (state, action) => {
            const itemIndex = state.cart.findIndex(
                (item) => item._id === action.payload.productId
            );

            if (itemIndex !== -1) {
                const item = state.cart[itemIndex];
                const newQty = item.quantity + action.payload.quantity;

                if (newQty <= 0) {
                    // Remove if quantity goes to 0 or below
                    state.cart.splice(itemIndex, 1);
                } else {
                    // Cap quantity to item's stock
                    item.quantity = Math.min(newQty, item.stock);
                }
            }

            saveCartToStorage(state.cart);
        });

});
