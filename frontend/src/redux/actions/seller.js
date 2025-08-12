import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../Data";

export const LoadSeller = () => async (dispatch) => {

    try {
        dispatch({ type: "LoadSellerRequest" });

        const { data } = await axios.get(`${server}/shops/getshop`, {
            withCredentials: true,
        });

        dispatch({ type: "LoadSellerSuccess", payload: data.shop });
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to load shop";
        dispatch({ type: "LoadSellerFail", payload: errorMessage });
    }
};
export const createShop = (formData) => async (dispatch) => {
    try {
        dispatch({ type: "CREATE_SHOP_REQUEST" });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        const { data } = await axios.post(`${server}/shops/register`, formData, config);

        dispatch({
            type: "CREATE_SHOP_SUCCESS",
            payload: data,
        });

        toast.success("Shop registered successfully! Please verify via email.");
    } catch (error) {
        dispatch({
            type: "CREATE_SHOP_FAIL",
            payload:
                error.response?.data?.message ||
                error.message ||
                "Failed to register shop",
        });
        toast.error(
            error.response?.data?.message ||
            error.message ||
            "Failed to register shop"
        );
    }
};
export const resetShopCreation = () => (dispatch) => {
    dispatch({ type: "RESET_SHOP_CREATION" });
};
