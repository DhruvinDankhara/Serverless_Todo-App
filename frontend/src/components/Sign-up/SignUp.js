import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import classes from "./SignUp.module.css";
import { AuthLayout } from "../index";
import { createUser, signUpApiCall } from "../../services/apiCall";

const SignUp = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        console.log("Received values of form: ", values);
        //Call API for login
        const response = await signUpApiCall(values);
        if (response) {
            navigate("/login", { replace: true });
        } else {
            console.error("Something went wrong");
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

    const formLayout = {
        labelCol: {
            span: 6,
        },
    };

    return (
        <AuthLayout>
            <h1>Sign Up</h1>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                {...formLayout}
            >
                <Form.Item
                    name="firstName"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your first name!",
                        },
                    ]}
                    label="First name"
                >
                    <Input placeholder="Enter your first name" />
                </Form.Item>
                <Form.Item
                    name="lastName"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your last name!",
                        },
                    ]}
                    label="Last name"
                >
                    <Input placeholder="Enter your last name" />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your Email!",
                        },
                    ]}
                    label="Email"
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your password!",
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue("password") === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(
                                        "The new password that you entered do not match!"
                                    )
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Enter confirm password" />
                </Form.Item>
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
                            Sign up
                        </Button>
                    </Form.Item>
                    {/* <a onClick={() => handleRegisterNow()}>register now!</a> */}
                </div>
            </Form>
        </AuthLayout>
    );
};
export default SignUp;
