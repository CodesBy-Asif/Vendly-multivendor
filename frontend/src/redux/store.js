import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from "./reducers/user.js";
import { sellerReducer } from "./reducers/seller.js";
import { productsReducer } from './reducers/product.js';
import { eventsReducer } from './reducers/Events.js';
import { favoritesReducer } from './reducers/Favirotes.js';
import { cartReducer } from './reducers/Cart.js';
import { ordersReducer } from './reducers/Order.js';

const store = configureStore({
    reducer: {
        user: userReducer,
        seller: sellerReducer,
        products: productsReducer,
        events: eventsReducer,
        favorites: favoritesReducer,
        cart: cartReducer,
        order: ordersReducer
    }
})

export default store