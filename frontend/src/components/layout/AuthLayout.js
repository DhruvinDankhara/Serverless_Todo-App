import MainNavigation from "./MainNavigation";
import { ConfigProvider } from "antd";
import { PRIMARY_COLOR } from "../../services/constant";
import classes from "./Layout.module.css";
const AuthLayout = (props) => {
    return (
        <div>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: PRIMARY_COLOR,
                    },
                }}
            >
                <MainNavigation />
                <main className={classes.main}>{props.children}</main>
            </ConfigProvider>
        </div>
    );
};

export default AuthLayout;
