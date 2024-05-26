import axios from "axios";

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('An error occurred. Please try again.');
        }
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, userData);
        const { token } = response.data;
        localStorage.setItem('token', token);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('An error occurred. Please try again.');
        }
    }
};