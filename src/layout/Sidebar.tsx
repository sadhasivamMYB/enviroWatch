import { useState } from "react";
import { NavLink } from "react-router-dom";
import { navItems } from "../config/navConfig";
import { Role } from "../config/roles";
import { 
    Box, 
    Typography, 
    Avatar, 
    IconButton, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    DialogActions, 
    Button 
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { iconMap } from "../config/IconMapping";

const Sidebar = () => {
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    // Retrieve user from localStorage
    const userStr = localStorage.getItem("user");
    const currentUser = userStr ? JSON.parse(userStr) : null;

    // Default username/role if not in local storage
    const fullName = currentUser?.full_name || "Sarah Johnson";
    const roleName = currentUser?.role_name || "Manager";

    // Helper to get initials
    const getInitials = (name: string) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    // Determine normalized role for sidebar links filtering
    const getNormalizedRole = (rName: string) => {
        if (!rName) return Role.ADMIN;
        const r = rName.toLowerCase();
        if (r.includes("admin")) return Role.ADMIN;
        if (r.includes("manager")) return Role.MANAGER;
        return Role.VIEWER;
    };

    const activeRole = getNormalizedRole(roleName);

    const allowedNavItems = navItems.filter((item) =>
        item.roles.includes(activeRole)
    );

    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

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
                    {allowedNavItems.map((item: any) => {
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
                    justifyContent: "space-between",
                    padding: "12px",
                    marginRight: 2,
                    marginBottom: 3,
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.06)"
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#e0e0e0",
                            color: "#1a1a1a",
                            fontWeight: 600,
                            fontSize: 12
                        }}
                    >
                        {getInitials(fullName)}
                    </Avatar>

                    <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 11, color: "#fff" }}>
                            {fullName}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "9px",
                                opacity: 0.7,
                                color: "#fff"
                            }}
                        >
                            {roleName}
                        </Typography>
                    </Box>
                </Box>

                <IconButton 
                    onClick={handleLogoutClick}
                    size="small"
                    sx={{ 
                        color: "rgba(255, 255, 255, 0.6)",
                        "&:hover": {
                            color: "#ff4d4d",
                            background: "rgba(255, 255, 255, 0.05)"
                        }
                    }}
                >
                    <LogoutIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Box>

            {/* Premium Logout Confirmation Dialog */}
            <Dialog
                open={openLogoutDialog}
                onClose={() => setOpenLogoutDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        padding: 1,
                        background: "#fff",
                        maxWidth: "340px"
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 600, fontSize: "15px", pb: 1, color: "#1f2937" }}>
                    Confirm Logout
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: "13px", color: "#4b5563" }}>
                        Are you sure you want to log out of EnviroWatch?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pt: 1.5 }}>
                    <Button 
                        onClick={() => setOpenLogoutDialog(false)} 
                        sx={{ 
                            textTransform: "none", 
                            color: "#4b5563", 
                            fontSize: 12,
                            fontWeight: 500
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmLogout} 
                        variant="contained" 
                        sx={{ 
                            textTransform: "none", 
                            background: "#ef4444", 
                            "&:hover": { background: "#dc2626" }, 
                            fontSize: 12,
                            fontWeight: 500,
                            borderRadius: "8px",
                            boxShadow: "none"
                        }}
                    >
                        Log Out
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Sidebar;