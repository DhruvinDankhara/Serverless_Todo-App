import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import classes from "./Login.module.css";
import { AuthLayout } from "../index";
import { loginApiCall } from "../../services/apiCall";

const Login = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        console.log("Received values of form: ", values);
        //Call API for login

        const response = await loginApiCall(values);
        if (response) {
            localStorage.setItem("token", response.data.email);
            localStorage.setItem("username", response.data.firstName);
            localStorage.setItem("userId", response.data.id);
            // localStorage.setItem("password", values.password);
            navigate("/home", { replace: true });
        }
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    const handleRegisterNow = () => {
        navigate("/sign-up");
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/home");
        }
    }, []);

    return (
        <AuthLayout>
            <h1>Login</h1>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Email!",
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="Email"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Password!",
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                {/* <Form.Item>
                    <a
                        className="login-form-forgot"
                        onClick={() => {
                            handleForgotPassword();
                        }}
                    >
                        Forgot password ?
                    </a>
                </Form.Item> */}
                <div className={classes.link_division}>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            style={{
                                width: "200px",
                            }}
                        >
                            Log in
                        </Button>
                    </Form.Item>
                    {/* <a onClick={() => handleRegisterNow()}>register now!</a> */}
                </div>
            </Form>
        </AuthLayout>
    );
};
export default Login;
