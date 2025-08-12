import axios from "axios";
import { server } from "../../Data";
import { toast } from "react-toastify";

// LOAD ALL PRODUCTS
export const loadProducts = () => async (dispatch) => {
    try {
        dispatch({ type: "FetchProductsRequest" });

        const { data } = await axios.get(`${server}/product/products`, {
            withCredentials: true,
        });

        dispatch({ type: "FetchProductsSuccess", payload: data.products });
    } catch (error) {
        dispatch({
            type: "FetchProductsFail",
            payload: error.response?.data?.message || error.message,
        });
    }
};

// CREATE PRODUCT
export const createProduct = (formData) => async (dispatch) => {
    try {
        dispatch({ type: "CreateProductRequest" });

        const { data } = await axios.post(`${server}/product/create`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });

        dispatch({ type: "CreateProductSuccess", payload: data.product });
        return true;
    } catch (error) {
        dispatch({
            type: "CreateProductFail",
            payload: error.response?.data?.message || "Failed to create product",
        });
        toast.error(error.response?.data?.message || "Failed to create product");
        return false;
    }
};

// DELETE PRODUCT
export const deleteProduct = (productId) => async (dispatch) => {
    try {
        dispatch({ type: "DeleteProductRequest" });

        await axios.delete(`${server}/product/delete/${productId}`, {
            withCredentials: true,
        });

        dispatch({ type: "DeleteProductSuccess", payload: productId });
        return true;
    } catch (error) {
        dispatch({
            type: "DeleteProductFail",
            payload: error.response?.data?.message || "Failed to delete product",
        });
        toast.error(error.response?.data?.message || "Failed to delete product");
        return false;
    }
};




// UPDATE PRODUCT
export const updateProduct = (productId, updatedData) => async (dispatch) => {
    try {
        dispatch({ type: "UpdateProductRequest" });

        const { data } = await axios.put(`${server}/product/update/${productId}`, updatedData, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });

        dispatch({
            type: "UpdateProductSuccess",
            payload: data.product,
        });
        toast.success("Product updated successfully");
        return true;
    } catch (error) {
        dispatch({
            type: "UpdateProductFail",
            payload: error.response?.data?.message || "Failed to update product",
        });
        toast.error(error.response?.data?.message || "Failed to update product");
        return false;
    }
};
