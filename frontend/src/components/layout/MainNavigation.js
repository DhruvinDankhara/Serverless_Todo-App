import { Link } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import {
    HomeOutlined,
    FundOutlined,
    SettingOutlined,
    TeamOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

function MainNavigation(props) {
    return (
        <header className={classes.header}>
            <div className={classes.logo}>{process.env.REACT_APP_NAME}</div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Login</Link>
                    </li>
                    <li>
                        <Link to="/sign-up">Sign up</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default MainNavigation;
