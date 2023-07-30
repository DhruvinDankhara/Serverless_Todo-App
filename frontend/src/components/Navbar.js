import React from "react";
import { ConfigProvider, Menu } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { PRIMARY_COLOR } from "../services/constant";

const NavBar = () => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: PRIMARY_COLOR,
                },
            }}
        >
            <Menu
                mode="horizontal"
                theme="dark"
                itemType="primary"
                style={{
                    fontSize: "large",
                    display: "flex",
                    flexDirection: "row-reverse",
                }}
            >
                <Menu.Item key="home" icon={<LogoutOutlined />}>
                    <Link
                        to="/login"
                        onClick={() => {
                            localStorage.clear();
                        }}
                    >
                        Logout
                    </Link>
                </Menu.Item>
            </Menu>
        </ConfigProvider>
    );
};

export default NavBar;
