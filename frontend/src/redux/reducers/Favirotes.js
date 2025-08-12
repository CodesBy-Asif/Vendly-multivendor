import { createReducer } from "@reduxjs/toolkit";

// Helpers
const getFavoritesFromStorage = () => {
    try {
        const data = localStorage.getItem("favorites");
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const saveFavoritesToStorage = (favorites) => {
    try {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch { }
};

const initialState = {
    favorites: getFavoritesFromStorage(),
};

export const favoritesReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("AddFavorite", (state, action) => {
            const exists = state.favorites.find(f => f._id === action.payload._id);
            if (!exists) {
                state.favorites = [...(state.favorites || []), action.payload];

                saveFavoritesToStorage(state.favorites);
            }
        })
        .addCase("RemoveFavorite", (state, action) => {
            state.favorites = state.favorites.filter(f => f._id !== action.payload);
            saveFavoritesToStorage(state.favorites);
        })
        .addCase("ClearFavorites", (state) => {
            state.favorites = [];
            saveFavoritesToStorage([]);
        });
});
