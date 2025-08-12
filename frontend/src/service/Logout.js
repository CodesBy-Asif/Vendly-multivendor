import { server } from '../Data';
import axios from 'axios';

export const logout = async () => {
    try {
        // Call backend to clear HTTP-only cookies
        await axios.post(`${server}/user/logout`, {}, { withCredentials: true });


    } catch (error) {
        console.error("Logout failed:", error);
    }
};

export const logoutShop = async () => {
    try {
        // Call backend to clear HTTP-only cookies
        await axios.post(`${server}/shops/logout`, {}, { withCredentials: true });


    } catch (error) {
        console.error("Logout failed:", error);
    }
}