// src/layout/MainLayout.tsx
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import { Outlet, useSearchParams } from "react-router-dom";
import { theme } from "../theme";
import { CONTENT_ZOOM } from "../config/layout";

const MainLayout = () => {
    // The Facility Map's fullscreen (TV) mode covers the whole screen and is not scaled.
    const [params] = useSearchParams();
    const zoom = params.get("mode") === "fullscreen" ? 1 : CONTENT_ZOOM;

    return (
        <Box sx={{ display: "flex", bgcolor: theme.palette.primary.main, padding: 0, height: "100vh", overflow: "hidden" }}>
            <Box sx={{ width: "250px", }}>
                <Sidebar />
            </Box>
            <Box component="main" sx={{ flexGrow: 1, overflowY: "scroll", bgcolor: "white", margin: 1, borderRadius: 3, padding: 2 }}>
                {/* zoom lives on an inner box so <main> keeps its fixed size and is the only thing that scrolls */}
                <Box sx={{ zoom }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default MainLayout
