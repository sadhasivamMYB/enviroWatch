// src/layout/MainLayout.tsx
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { theme } from "../theme";

const MainLayout = () => {
    return (
        <Box sx={{ display: "flex", bgcolor: theme.palette.primary.main, padding: 0, height: "100vh" }}>
            <Box sx={{ width: "250px", }}>
                <Sidebar />
            </Box>
            <Box component="main" sx={{ flexGrow: 1, overflowY: "scroll", bgcolor: "white", margin: 1, borderRadius: 3, padding: 2 }}>
                <Outlet />
            </Box>
        </Box>
    );
}

export default MainLayout
