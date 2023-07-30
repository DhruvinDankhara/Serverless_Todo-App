import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { Login, SignUp } from "./components";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import { Home } from "./components/HomePage/Home";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={"/login"} />}>
                {" "}
            </Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/sign-up" element={<SignUp />}></Route>
            {/* <Route path="/forgot-password" element={<ForgotPassword />}></Route> */}
            {/* <Route path="/userList" exact element={<UserList />}></Route>
                <Route path="/userProfile" exact element={<Profile />}></Route> */}
        </Routes>
    );
}

export default App;
