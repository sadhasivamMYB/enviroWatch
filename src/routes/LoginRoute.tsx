
import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import MiniMalLayout from "../layout/MiniMalLayout";
import Successs from "../pages/Successs"


const LoginRoutes = {
    path: '/',
    element: <MiniMalLayout />,
    children: [
        {
            index: true,
            element: <Login />
        },
        {
            path:"/success",
            element : <Successs/>
        },
        {
            path: '*',
            element: <Navigate to="/" />
        }
    ]
};


export default LoginRoutes