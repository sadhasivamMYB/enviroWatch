import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    FormControl,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";

import { inputStyles } from "../../theme";
import { useGetRolesQuery } from "../../services/Api/roles.api";

type UserModalProps = {
    open: boolean;
    initialValues?: any;
    onsubmit: (data: any) => void;
    onClose: () => void;
    isEdit?: boolean;
};

const defaultFormData = {
    username: "",
    email: "",
    role_id: 0,
    status: "",
    password: "",
    fullname: ""
};

const UserFormModal: React.FC<UserModalProps> = ({
    open,
    initialValues,
    onClose,
    isEdit = false,
    onsubmit,
}) => {
    const { data: roles = [] } = useGetRolesQuery();

    const [formData, setFormData] = useState(defaultFormData);

    useEffect(() => {
        if (initialValues) {
            console.log(initialValues, "✨👤👤👤👤")
            setFormData({
                username: initialValues.username ?? "",
                email: initialValues.email ?? "",
                role_id: initialValues.role_id ?? 0,
                status: initialValues.is_active ? "Active" : "Inactive",
                password: initialValues.password_hash,
                fullname: initialValues.full_name ?? ""
            });
        }
    }, [initialValues, open, isEdit]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleClose = () => {
        setFormData(defaultFormData);
        onClose();
    };

    const handleSubmit = () => {
        const payload = {
            ...(isEdit && {
                user_id: initialValues?.id,
            }),

            username: formData.username,
            email: formData.email,
            role_id: formData.role_id,
            password: formData.password,
            full_name: formData.fullname,

            ...(isEdit && {
                is_active: formData.status == "Active"
            }),
        };

        console.log("Payload:", payload);

        onsubmit(payload);
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
        >
            <DialogContent sx={{ p: 3, width: "450px" }}>
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1.3,
                        mb: 2,
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
                                fontWeight: 500,
                                color: "#111827",
                                fontSize: 18,
                            }}
                        >
                            {isEdit ? "Edit User" : "Create User"}
                        </Typography>

                        <Typography
                            sx={{
                                color: "#6B7280",
                                fontSize: 12,
                            }}
                        >
                            {isEdit
                                ? "Edit a user account and define their access level."
                                : "Create a new user account and define their access level."}
                        </Typography>
                    </Box>
                </Box>

                {/* Form */}
                <Box
                    sx={{
                        border: "1px solid #E5E7EB",
                        borderRadius: "18px",
                        p: 2,
                    }}
                >
                    <Stack spacing={2}>
                        {/* Username */}
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: "#4B5563",
                                }}
                            >
                                Full Name
                            </Typography>

                            <TextField
                                fullWidth
                                value={formData.fullname}
                                onChange={(e) =>
                                    handleChange("fullname", e.target.value)
                                }
                                sx={inputStyles}
                            />
                        </Box>
                        {/* Username */}
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: "#4B5563",
                                }}
                            >
                                Username
                            </Typography>

                            <TextField
                                fullWidth
                                value={formData.username}
                                onChange={(e) =>
                                    handleChange("username", e.target.value)
                                }
                                sx={inputStyles}
                            />
                        </Box>

                        {/* Email */}
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: "#4B5563",
                                }}
                            >
                                Email
                            </Typography>

                            <TextField
                                fullWidth
                                value={formData.email}
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                                sx={inputStyles}
                            />
                        </Box>

                        {/* Password */}
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: "#4B5563",
                                }}
                            >
                                Password
                            </Typography>

                            <TextField
                                fullWidth
                                // type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    handleChange("password", e.target.value)
                                }
                                sx={inputStyles}
                            />
                        </Box>

                        {/* Role */}
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: "#4B5563",
                                }}
                            >
                                Role
                            </Typography>

                            <FormControl sx={inputStyles} fullWidth>
                                <Select
                                    value={formData.role_id}
                                    onChange={(e) =>
                                        handleChange(
                                            "role_id",
                                            Number(e.target.value)
                                        )
                                    }
                                    IconComponent={KeyboardArrowDownRoundedIcon}
                                    sx={inputStyles}
                                >
                                    {roles.map((role: any) => (
                                        <MenuItem
                                            key={role.id}
                                            value={role.id}
                                        >
                                            {role.role_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Status (Edit only) */}
                        {isEdit && (
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: "#4B5563",
                                    }}
                                >
                                    Status
                                </Typography>

                                <FormControl sx={inputStyles} fullWidth>
                                    <Select
                                        value={formData.status}
                                        onChange={(e) =>
                                            handleChange("status", e.target.value)
                                        }
                                        IconComponent={KeyboardArrowDownRoundedIcon}
                                        sx={inputStyles}
                                    >
                                        <MenuItem value="Active">
                                            Active
                                        </MenuItem>

                                        <MenuItem value="Inactive">
                                            Inactive
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        )}
                    </Stack>
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",
                            backgroundColor: "#00796B",

                            "&:hover": {
                                backgroundColor: "#00695C",
                            },
                        }}
                    >
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default UserFormModal;