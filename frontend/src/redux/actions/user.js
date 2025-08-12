// actions/user.js
import axios from "axios";
import Cookies from "js-cookie";
import { server } from "../../Data.js";

export const loadUser = () => async (dispatch) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
        dispatch({ type: "LoadUserRequest" });

        const { data } = await axios.get(`${server}/user/getuser`, {
            withCredentials: true,
        });

        dispatch({ type: "LoadUserSuccess", payload: data.user });
    } catch (error) {
        dispatch({
            type: "LoadUserFail",
            payload: error.response?.data?.message || "Failed to load user",
        });
    }
};

export const updateProfile = (formData) => async (dispatch) => {
    try {
        dispatch({ type: "UserLoading" });

        const { data } = await axios.patch(`${server}/user/update-profile`, formData, {
            withCredentials: true,
        });

        dispatch({ type: "LoadUserSuccess", payload: data.user });
    } catch (error) {
        dispatch({
            type: "UserError",
            payload: error.response?.data?.message || "Failed to update profile",
        });
    }
};

// ✅ Change avatar
export const updateAvatar = (file) => async (dispatch) => {
    try {
        dispatch({ type: "UserLoading" });

        const formData = new FormData();
        formData.append("avatar", file);

        const { data } = await axios.post(`${server}/user/update-avatar`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });

        dispatch({ type: "LoadUserSuccess", payload: data.user });
    } catch (error) {
        dispatch({
            type: "UserError",
            payload: error.response?.data?.message || "Failed to update avatar",
        });
    }
};

// ✅ Remove avatar
export const removeAvatar = () => async (dispatch) => {
    try {
        dispatch({ type: "UserLoading" });

        const { data } = await axios.delete(`${server}/user/remove-avatar`, {
            withCredentials: true,
        });

        dispatch({ type: "LoadUserSuccess", payload: data.user });
    } catch (error) {
        dispatch({
            type: "UserError",
            payload: error.response?.data?.message || "Failed to remove avatar",
        });
    }
};

// ✅ Change password
export const changePassword = (passwords) => async (dispatch) => {
    try {
        dispatch({ type: "UserLoading" });

        await axios.patch(`${server}/user/change-password`, passwords, {
            withCredentials: true,
        });

        dispatch({ type: "PasswordChanged" });
    } catch (error) {
        dispatch({
            type: "UserError",
            payload: error.response?.data?.message || "Failed to change password",
        });
    }
};
// ✅ Add or Update Address
export const addOrUpdateAddress = (address) => async (dispatch) => {
    try {
        dispatch({ type: "UserLoading" });

        const { data } = await axios.post(`${server}/user/add-address`, address, {
            withCredentials: true,
        });

        dispatch({ type: "LoadUserSuccess", payload: data.user });
    } catch (error) {
        dispatch({
            type: "UserError",
            payload: error.response?.data?.message || "Failed to save address",
        });
    }
};

// ✅ Delete Address
export const deleteAddress = (id) => async (dispatch) => {
    try {
        dispatch({ type: "UserLoading" });

        const { data } = await axios.delete(`${server}/user/delete-address/${id}`, {
            withCredentials: true,
        });

        dispatch({ type: "LoadUserSuccess", payload: data.user });
    } catch (error) {
        dispatch({
            type: "UserError",
            payload: error.response?.data?.message || "Failed to delete address",
        });
    }
};

// ✅ Set Default Address
export const setDefaultAddress = (id) => async (dispatch) => {
    try {
        dispatch({ type: "UserLoading" });

        const { data } = await axios.patch(`${server}/user/set-default-address/${id}`, {}, {
            withCredentials: true,
        });

        dispatch({ type: "LoadUserSuccess", payload: data.user });
    } catch (error) {
        dispatch({
            type: "UserError",
            payload: error.response?.data?.message || "Failed to set default address",
        });
    }
};
