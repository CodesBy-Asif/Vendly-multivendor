// src/redux/actions/cart.js
export const addToCart = (product, quantity = 1) => ({
    type: "AddToCart",
    payload: {
        ...product,
        quantity,
    },
});

export const removeFromCart = (productId) => ({
    type: "RemoveFromCart",
    payload: productId,
});

export const clearCart = () => ({
    type: "ClearCart",
});

export const updateCartQuantity = (productId, quantity) => ({
    type: "UpdateCartQuantity",
    payload: { productId, quantity },
});

export const isInCart = (cart, productId) => {
    return cart.some((item) => item._id === productId);
};
