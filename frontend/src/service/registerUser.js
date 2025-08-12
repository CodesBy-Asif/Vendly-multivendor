import axios from "axios";
import { server } from "../Data";

const registerUser = async (full_name, email, password) => {
    const formData = new FormData();
    formData.append("full_name", full_name);
    formData.append("email", email);
    formData.append("password", password);

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    const res = await axios.post(`${server}/user/register`, formData, config);
    return res.data;
};

export default registerUser;
