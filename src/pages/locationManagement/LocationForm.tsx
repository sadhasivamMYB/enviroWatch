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
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import { ApartmentOutlined } from "@mui/icons-material";


type LocationModalProps = {
    open: boolean;
    initialValues?: any;
    onsubmit: any;
    onClose: () => void;
    isEdit?: boolean;
};

const LocationFormModal: React.FC<LocationModalProps> = ({
    open,
    initialValues,
    onClose,
    onsubmit,
    isEdit,
}) => {




    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "",
        code: ""

    });

    const [defaultFormData] = useState({
        name: "",
        description: "",
        status: "",
        code: ""

    });


useEffect(() => {
    if(initialValues){

    
    setFormData({
                  name: initialValues.name ,
                  description: initialValues.description ,
                  status: String(initialValues.is_active ?? ""),
                  code: initialValues.code
              })
            }
}, [initialValues, open]);




    const handleChange = (
        field: string,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        console.log(formData, "🙌🙌🙌🙌");
        const payload = {

            name: formData.name,
            description: formData.description,
            code: formData.name.slice(0, 2).toUpperCase() + Math.floor(Math.random() * 1000),
            ...(isEdit && { is_active: formData.status, location_id: Number( initialValues?.id) })
        }
        onsubmit(payload)
        onClose();
    };

 

    return (
        <Dialog
            open={open}
            onClose={onClose}

            sx={{

                borderRadius: "24px",

            }}
        >
            <DialogContent
                sx={{
                    p: "24px",
                    width: "400px",
                    maxWidth: "620px",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1.3,
                        mb: 2,
                        width: "100%"
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
                        <ApartmentOutlined sx={{ fontSize: 16 }} />
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
                            {isEdit ? "Edit Location" : "Add Location"}
                        </Typography>

                        <Typography
                            sx={{
                                variant: "body1",
                                color: "#6B7280",
                                fontSize: 12
                            }}
                        >
                            {isEdit ? "Edit this location" : "Create a new location"}
                        </Typography>
                    </Box>
                </Box>


                {/* Form Card */}
                <Box
                    sx={{
                        border: "1px solid #E5E7EB",
                        borderRadius: "18px",
                        p: 2,
                    }}
                >
                    <Stack spacing={2}>
                        {/* Full Name */}
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: "#4B5563"
                                }}
                            >
                                Location
                            </Typography>

                            <TextField

                                fullWidth
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                variant="outlined"
                                sx={inputStyles}
                            />
                        </Box>

                        {/* Description */}
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: "#4B5563"
                                }}
                            >
                                Description
                            </Typography>

                            <TextField
                                multiline
                                fullWidth
                                rows={2}
                                sx={{ borderRadius: "10px" }}
                                value={formData.description}
                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }


                            />
                        </Box>


                        {/* Status */}
                        {
                            isEdit &&
                            <Box>

                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: "#4B5563"

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
                                        IconComponent={
                                            KeyboardArrowDownRoundedIcon
                                        }
                                        sx={inputStyles}
                                    >
                                        <MenuItem sx={{ fontSize: 14, }} value="true">
                                            Active
                                        </MenuItem>
                                        <MenuItem sx={{ fontSize: 14, }} value="false">
                                            Inactive
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        }

                    </Stack>
                </Box>

                {/* Footer Buttons */}
                <Box
                    sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",

                            fontSize: "14px",
                            borderColor: "#D1D5DB",
                            color: "#374151",
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

                            fontSize: "14px",
                            backgroundColor: "#00796B",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "#00695C",
                                boxShadow: "none",
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

const inputStyles = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        fontSize: "14px",
        height: 40,
        backgroundColor: "#fff",

        "& fieldset": {
            borderColor: "#D1D5DB",
        },

        "&:hover fieldset": {
            borderColor: "#9CA3AF",
        },

        "&.Mui-focused fieldset": {
            borderColor: "#00796B",
            borderWidth: "1px",
        },
    },
};

export default LocationFormModal;