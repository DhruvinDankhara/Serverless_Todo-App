import axios from "axios";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

// const BASE_URL = "http://ec2-52-206-22-233.compute-1.amazonaws.com:3000";
const BASE_URL = "https://l67uggec83.execute-api.us-east-1.amazonaws.com/dev";

// DONE
export const loginApiCall = async (data) => {
    try {
        const payload = {
            ...data,
            // password: await bcrypt.hash(data.password, 10),
            // TODO: 
        };
        const response = await axios.post(`${BASE_URL}/login`, payload);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// DONE
export const signUpApiCall = async (data) => {
    try {
        const payload = {
            ...data,
            userId: uuidv4(),
            // password: await bcrypt.hash(data.password, 10),
        };
        const response = await axios.post(`${BASE_URL}/sign-up`, payload);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchTodoApiCall = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/todo?userId=${localStorage.getItem("userId")}`
        );
        return response.data.data;
    } catch (error) {
        console.error(error);
        return {};
    }
};

export const updateStatus = async (id, status) => {
    try {
        console.log(id, status);
        const response = await axios.put(
            `${BASE_URL}/todo/update?todoId=${id}`,
            {
                status: status,
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return {};
    }
};

export const deleteTodo = async (id) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}/todo/delete?todoId=${id}`
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const createTodo = async (data) => {
    try {
        const payload = {
            ...data,
            id: uuidv4(),
        };
        const response = await axios.post(`${BASE_URL}/todo/create`, payload);
        console.log(response);
        return true;
    } catch (error) {
        console.error(error);
        return {};
    }
};
