import { server } from '../Data';
import axios from 'axios';
import { toast } from 'react-toastify';

export const logout = async () => {
    try {
        await axios.post(`${server}/user/logout`, {}, { withCredentials: true });
        toast.success("Logged out successfully");
    } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
    }
};

export const logoutShop = async () => {
    try {
        await axios.post(`${server}/shops/logout`, {}, { withCredentials: true });
        toast.success("Shop logged out successfully");
    } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
    }
};
