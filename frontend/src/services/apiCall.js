import axios from "axios";
const BASE_URL = "http://localhost:3000";
export const fetchTodoApiCall = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/todos?userId=${localStorage.getItem("userId")}`
        );
        return response.data.data;
    } catch (error) {
        console.error(error);
        return {};
    }
};

export const updateStatus = async (id, status) => {
    try {
        const response = await axios.put(`${BASE_URL}/todo?todoId=${id}`, {
            status: status,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {};
    }
};

export const loginApiCall = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const signUpApiCall = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/sign-up`, data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteTodo = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/delete?todoId=${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const createTodo = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/create-todo`, data);
        console.log(response);
        return true;
    } catch (error) {
        console.error(error);
        return {};
    }
};
