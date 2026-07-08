import { useState } from "react";
import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    Backdrop,
    CircularProgress
} from "@mui/material";

import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { inputStyles } from "../theme";
import { useLoginMutation } from "../services/Api/login.api";
import { useNavigate } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const LoginPage = () => {

    const navigate = useNavigate()



    const [login, { data, error, isLoading }] = useLoginMutation();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });


    const handleChange = (
        field: string,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {

        await login(formData)
            .unwrap()
            .then((response: any) => {
                if (response) {
                    localStorage.setItem("token", response.access_token)
                    localStorage.setItem("isAuthenticated", "true")
                    navigate("/");
                }
            })
            .catch((error: any) => {
                console.log(error);
            });

    };

    return (
        <Box
            sx={{
                borderRadius: "8px",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                display: "flex",
                height: "100vh",



            }}
        >
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2

                }}>
                    <Box sx={{ width: "35px", height: "35px", background: `linear-gradient(360deg, #000 0%, #01A897 50%, #015F73 100%)`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography
                            sx={{
                                variant: "h3",
                                fontWeight: 500,
                                color: "#fff",
                                fontSize: 18
                            }}
                        >
                            E
                        </Typography>
                    </Box>
                    <Typography
                        sx={{
                            variant: "h3",
                            fontWeight: 500,
                            color: "#111827",
                            fontSize: 18,
                        }}
                    >
                        Envrio Watch
                    </Typography>
                </Box>

                <Box sx={{
                    width: "450px", height: "360px", border: "1px solid #E5E7EB",
                    padding: "16px", borderRadius: "12px", boxShadow: "0px 4px 8px 0px #0000000D"
                }}>
                    {/* Header */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1.3,
                            mb: 2
                        }}
                    >

                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: "10px",
                                backgroundColor: "#00796B",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                            }}
                        >
                            <GroupOutlinedIcon sx={{ fontSize: 16 }} />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    variant: "h3",
                                    fontWeight: 500,
                                    color: "#111827",
                                    fontSize: 18
                                }}
                            >
                                Login
                            </Typography>
                            <Typography
                                sx={{
                                    variant: "body1",
                                    color: "#6B7280",
                                    fontSize: 12
                                }}
                            >
                                Welcome back! Please enter your email and password to access your account.
                            </Typography>
                        </Box>
                    </Box>


                    {/* Form Card */}
                    <Box
                        sx={{
                            border: "1px solid #E5E7EB",
                            borderRadius: "18px",
                            p: 2,
                            py: 4,
                        }}
                    >
                        <Stack spacing={2}>


                            {/* User name */}
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: "#4B5563"
                                    }}
                                >
                                    User Name
                                </Typography>

                                <TextField
                                    fullWidth
                                    value={formData.username}
                                    required
                                    onChange={(e) =>
                                        handleChange("username", e.target.value)
                                    }
                                    variant="outlined"
                                    sx={inputStyles}
                                />
                            </Box>

                            {/* Password */}
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: "#4B5563"
                                    }}
                                >
                                    Password
                                </Typography>

                                <TextField
                                    fullWidth
                                    required
                                    value={formData.password}
                                    onChange={(e) =>
                                        handleChange("password", e.target.value)
                                    }
                                    variant="outlined"
                                    sx={inputStyles}
                                />
                            </Box>

                            {error && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        mt: 1,
                                        color: "error.main",
                                    }}
                                >
                                    <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {(error as any)?.data?.detail || (error as any)?.error || "Server issue or incorrect credentials. Please try again later."}
                                    </Typography>
                                </Box>
                            )}

                        </Stack>
                    </Box>



                    {/* Footer Buttons */}
                    <Box
                        sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            float: "right"

                        }}
                    >


                        <Button
                            onClick={handleSubmit}

                            disabled={isLoading || !formData.username || !formData.password}
                            variant="contained"
                            sx={{
                                textTransform: "none",
                                borderRadius: "10px",

                                fontSize: "14px",
                                backgroundColor: "#00796B",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: "#00695C",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            {!isLoading ? "Login" : "Loading..."}
                        </Button>

                    </Box>
                </Box>

            </Box>

        </Box>
    );
};

export default LoginPage;