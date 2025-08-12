// src/redux/actions/Favorites.js

export const addFavorite = (product) => (
    {
        type: "AddFavorite",
        payload: product,
    });

export const removeFavorite = (productId) => ({
    type: "RemoveFavorite",
    payload: productId,
});

export const clearFavorites = () => ({
    type: "ClearFavorites",
});

// Utility function (can be reused in components)
export const isFavorite = (favorites, productId) => {
    return favorites.some((item) => item._id === productId);
};
