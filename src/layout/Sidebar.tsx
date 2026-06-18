import { NavLink } from "react-router-dom";
import { navItems } from "../config/navConfig";
import { iconMap } from "../config/IconMapping";
import { Role } from "../config/roles";

import { Box, Typography, Avatar } from "@mui/material";

const Sidebar = () => {
    const role = Role.ADMIN;


    const allowedNavItems = navItems.filter(
        (item) =>
            item.roles.includes(role)
    );

    return (
        <Box
            sx={{
                width: "250px",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "16px",
                color: "#fff"
            }}
        >
            {/* Top Section */}
            <Box>
                {/* Logo */}
                <Box sx={{ mb: 4 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: "18px" }}>
                        Enviro Watch
                    </Typography>
                </Box>

                {/* Nav Items */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.1, paddingRight: 2 }}>
                    {allowedNavItems
                        .filter(item => item.roles.includes(role))
                        .map(item => {
                            const Icon = iconMap[item.icon];

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    style={({ isActive }) => ({
                                        display: "flex",
                                        alignItems: "center",

                                        gap: "10px",
                                        padding: "10px",
                                        borderRadius: "16px",
                                        textDecoration: "none",

                                        background: isActive
                                            ? "rgba(217, 217, 217, 0.08)"
                                            : "transparent",
                                        color: isActive ? "#00a395" : "#e6f4f1",
                                        transition: "all 0.2s ease"
                                    })}
                                >
                                    {/* Icon bubble */}
                                    <Box
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            padding: 0.5,
                                            borderRadius: "8px",
                                            border: "1px solid transparent",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "linear-gradient(180deg, rgba(217, 217, 217, 0.08), rgba(217, 217, 217, 0.04)) padding-box, linear-gradient(225.04deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0)) border-box"
                                            // background: "linear-gradient(rgba(0, 163, 149, 0.3), rgba(0, 163, 149, 0.3)) padding-box, linear-gradient(180deg, rgba(217, 217, 217, 0.08), rgba(217, 217, 217, 0.04)) padding-box, linear-gradient(225.04deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0)) border-box"
                                        }}
                                    >
                                        <Icon sx={{ fontSize: "16px", color: "#D9D9D980" }} />
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontSize: "12px",
                                            fontWeight: 400,

                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </NavLink>
                            );
                        })}
                </Box>
            </Box>

            {/* Bottom User Card */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,

                    padding: "12px",
                    marginRight: 2,
                    marginBottom: 3,
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.06)"
                }}
            >
                <Avatar
                    sx={{
                        bgcolor: "#e0e0e0",
                        color: "#1a1a1a",
                        fontWeight: 600
                    }}
                >
                    SJ
                </Avatar>

                <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 12 }}>
                        Sarah Johnson
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "10px",
                            opacity: 0.7
                        }}
                    >
                        Manager
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Sidebar;