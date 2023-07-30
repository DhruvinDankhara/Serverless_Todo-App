import classes from "./ForgotPassword.module.css";
import { AuthLayout } from "../index";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";

function ForgotPassword() {
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log("Received values of form: ", values);
        //Call API for login
        // localStorage.setItem("token", "FKLDSAJKLFJAKLS");
        // localStorage.setItem("password", values.password);
        // navigate("/home", { replace: true });
    };
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/home");
        }
    }, []);
    return (
        <AuthLayout>
            <h2>Forgot Password</h2>
            <Form onFinish={onFinish}>
                <Form.Item
                    name={["user", "email"]}
                    label="Email"
                    rules={[
                        {
                            type: "email",
                        },
                    ]}
                >
                    <Input placeholder="Enter email " />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Send email
                    </Button>
                </Form.Item>
            </Form>
        </AuthLayout>
    );
}

export default ForgotPassword;
