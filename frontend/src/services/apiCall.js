import axios from "axios";
import ToastMessage from "../components/ToastMessage";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

// const BASE_URL = "http://ec2-52-206-22-233.compute-1.amazonaws.com:3000";
const BASE_URL =
  "https://jhjx6t47d4.execute-api.us-east-1.amazonaws.com/deploy";

// DONE
export const loginApiCall = async (data) => {
  try {
    const payload = {
      ...data,
      // password: await bcrypt.hash(data.password, 10),
      // TODO:
    };
    const response = await axios.post(`${BASE_URL}/login`, payload);
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Login failed", error.response.data.error);
    ToastMessage(error.response.data.error, "error");

    return null;
  }
};

// DONE
export const signUpApiCall = async (data) => {
  try {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      userId: uuidv4(),
      // password: await bcrypt.hash(data.password, 10),
    };
    const response = await axios.post(`${BASE_URL}/signup`, payload);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    console.error("Error", error.response.data.error);
    ToastMessage(error.response.data.error, "error");
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
    const response = await axios.put(`${BASE_URL}/todo?todoId=${id}`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const deleteTodo = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/todo?todoId=${id}`);
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
    return response.data.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const SendAllTasksInEmail = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/sendEmail?userId=${userId}`);
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};
