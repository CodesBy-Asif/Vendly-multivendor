import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../Data";


// CREATE ORDER
export const createOrder = (orderData) => async (dispatch) => {
    try {
        dispatch({ type: "CreateOrderRequest" });

        const { data } = await axios.post(`${server}/order/create`, orderData, {
            withCredentials: true,
        });

        dispatch({ type: "CreateOrderSuccess", payload: data.order });
        toast.success(data.message || "Order placed successfully!");
        return data;
    } catch (error) {
        const errorMsg =
            error?.response?.data?.message || "Failed to place the order";

        dispatch({
            type: "CreateOrderFail",
            payload: errorMsg,
        });

        toast.error(errorMsg);
        return { error: errorMsg };
    }
};

// UPDATE ORDER
export const updateOrder = (orderId, updatedData) => async (dispatch) => {
    try {
        dispatch({ type: "UpdateOrderRequest" });

        const { data } = await axios.put(
            `${server}/order/update/${orderId}`,
            updatedData,
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );

        dispatch({ type: "UpdateOrderSuccess", payload: data.order });

        toast.success("Order updated successfully");
        return true;
    } catch (error) {
        dispatch({
            type: "UpdateOrderFail",
            payload: error.response?.data?.message || "Failed to update order",
        });
        toast.error(error.response?.data?.message || "Failed to update order");
        return false;
    }
};


// DELETE ORDER
export const deleteOrder = (orderId) => async (dispatch) => {
    try {
        dispatch({ type: "DeleteOrderRequest" });

        await axios.delete(`${server}/order/delete/${orderId}`, {
            withCredentials: true,
        });

        dispatch({ type: "DeleteOrderSuccess", payload: orderId });
        toast.success("Order deleted successfully");
        return true;
    } catch (error) {
        dispatch({
            type: "DeleteOrderFail",
            payload: error.response?.data?.message || "Failed to delete order",
        });
        toast.error(error.response?.data?.message || "Failed to delete order");
        return false;
    }
};

// RESET ORDERS
export const resetOrders = () => (dispatch) => {
    dispatch({ type: "ResetOrders" });
};
// FETCH SHOP ORDERS
export const fetchShopOrders = () => async (dispatch) => {
    try {
        dispatch({ type: "FetchShopOrdersRequest" });

        const { data } = await axios.get(`${server}/order/shop`, {
            withCredentials: true,
        });

        dispatch({ type: "FetchShopOrdersSuccess", payload: data.orders });
    } catch (error) {
        dispatch({
            type: "FetchShopOrdersFail",
            payload: error.response?.data?.message || "Failed to fetch shop orders",
        });
        toast.error(error.response?.data?.message || "Failed to fetch shop orders");
    }
};

