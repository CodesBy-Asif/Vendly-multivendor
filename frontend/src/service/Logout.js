// utils/logout.js
import Cookies from 'js-cookie';

export const logout = () => {
    // Remove tokens from cookies
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('token', { path: '/' })

    // Optionally clear other storage
    localStorage.removeItem('user');
    sessionStorage.clear();

};
export const logoutShop = () => {
    Cookies.remove('shop_token', { path: '/' })

};
