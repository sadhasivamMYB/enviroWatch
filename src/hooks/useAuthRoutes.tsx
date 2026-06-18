import { Navigate, useRoutes } from "react-router-dom";

import NotFound from "../pages/general/Notfound";
import MainLayout from "../layout/MainLayout";
import { Role } from "../config/roles";
import routesConfig from "../routes/routes";
import LoginRoutes from "../routes/LoginRoute"

const useAuthRoutes = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const token = localStorage.getItem("token");

    console.log(token, "token");

    const allowedRoutes = useGetRolesBasedRoutes();

    console.log(allowedRoutes, "allowedRoutes");

    if (!isAuthenticated) return useRoutes([LoginRoutes]);

    const dynamicRoutes = allowedRoutes.map((route) => ({
        path: route.path,
        element: <route.element />,
    }));



    const routes = [
        {
            path: "/",
            element: (
                <MainLayout />
            ),
            children: [
                {
                    index: true,
                    element: (
                        <Navigate
                            to={allowedRoutes[0]?.path || "/not-found"}
                            replace />
                    ),
                },

                ...dynamicRoutes,

                {
                    path: "*",
                    element: <NotFound />,
                },
            ],
        },
    ];

    return useRoutes(routes);
};

export default useAuthRoutes;

// get roles based routes

const useGetRolesBasedRoutes = () => {
    const role = Role.ADMIN;
    const routes = routesConfig.filter((route) => route.roles.includes(role));
    return routes;
}