import React, { useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import UserFormModal from "./UserForm";
import CommonPagination from "../../components/Pagination";
import { useCreateUserMutation, useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from "../../services/Api/users.api";
import { useGetRolesQuery } from "../../services/Api/roles.api";

type UserRole = {
    id: number;
    name: string;
    role: string;
    status: "Active" | "Inactive";
};






const UsersAndRoles: React.FC = () => {


    const [addUser] = useCreateUserMutation()
    const [updateUser] = useUpdateUserMutation()


    const [search, setSearch] = useState("");
    const [addUserToggle, setAddUserToggle] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [isEdit, setIsEdit] = useState(false)
    const [initialValues, setInitialValues] = useState(null);


    const { data: rows } = useGetUsersQuery({
        limit: rowsPerPage,
        offset: page
    })

    const { data: rolesData } = useGetRolesQuery()

    const filteredRows = rows?.filter(
        (row) =>
            row.username.toLowerCase().includes(search.toLowerCase())
    );

    async function handleAdd(fom) {
        setIsEdit(false)
        const res = await addUser(fom)
        if (res.data) {
            console.log("User added successfully")
        } else {
            console.log("Failed to add user")
        }

    }


    const handleEditUserSubmit = async (data: any) => {

        console.log("UpdateSubmit", data);

        setAddUserToggle(false)
        try {
            await updateUser({ user_id: Number(data.user_id), ...data }).unwrap()
        }
        catch (error) {
            console.log(error)
        }

    }

    function roleNameFind(roleId) {
        return rolesData?.find((role) => role.role_id === roleId)?.role_name
    }


    //  -- update

    function handleIsEdit(user) {
        setIsEdit(true)
        setInitialValues(user)
        setAddUserToggle(true)

    }


    //  --- delete

    const [deleteUser] = useDeleteUserMutation()

    function handleDelete(userId) {
        deleteUser(userId)
    }


    return (
        <Box
            sx={{

                minHeight: "100vh",

            }}
        >
            {/* Page Title */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Users and Roles Management
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                }}
            >
                {/* Top Toolbar */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                    }}
                >


                    {/* Search */}
                    <TextField
                        size="small"
                        placeholder="Search User Names..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ fontSize: 16, color: "#9ca3af" }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            flex: 1,
                            maxWidth: 420,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                                fontSize: "0.8rem",
                                bgcolor: "#fff",
                                "& fieldset": { borderColor: "#e5e7eb" },
                                "&:hover fieldset": { borderColor: "#d1d5db" },
                                "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                            },
                        }}
                    />

                    <Box sx={{ flex: 1 }} />

                    {/* Add Rules Button */}
                    <Button
                        variant="contained"
                        startIcon={<Add sx={{ fontSize: 16 }} />}
                        onClick={() => { setAddUserToggle(true); setIsEdit(false) }}
                        sx={{
                            bgcolor: "#0d9488",
                            color: "#fff",
                            borderRadius: 3,
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            px: 2,
                            py: 0.85,
                            boxShadow: "none",
                            "&:hover": { bgcolor: "#0f766e", boxShadow: "none" },
                        }}
                    >
                        Add User
                    </Button>

                </Box>

                {/* Table */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor: "#f3f4f6",
                                }}
                            >
                                <TableCell sx={headCellStyle}>Name</TableCell>
                                <TableCell sx={headCellStyle}>Role</TableCell>
                                <TableCell sx={headCellStyle}>
                                    <Box
                                        sx={{
                                            ...headCellStyle,
                                            gap: 1,
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        Status
                                        <FilterAltOutlinedIcon
                                            sx={{ fontSize: 18, color: "#6b7280" }}
                                        />
                                    </Box>
                                </TableCell>

                                <TableCell sx={headCellStyle} align="center">
                                    Action
                                </TableCell>

                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredRows?.map((row) => (
                                <TableRow
                                    key={row.id}
                                    hover
                                    sx={{
                                        "& td": {
                                            borderBottom: "1px solid #f1f5f9",
                                        },
                                    }}
                                >
                                    <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid #f3f4f6" }}>
                                        <Typography
                                            sx={{ fontSize: "0.82rem", fontWeight: 500, color: "#111827", lineHeight: 1.4 }}
                                        >
                                            {row.full_name}
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500, lineHeight: 1 }}>
                                            {row.email}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid #f3f4f6" }}>
                                        <Typography
                                            sx={{ fontSize: "0.72rem", fontWeight: 500, color: "#52525b", lineHeight: 1.4, background: "#f7f7f7", padding: "2px 8px", borderRadius: "8px", width: "max-content", textTransform: "capitalize" }}
                                        >
                                            {roleNameFind(row.role)}
                                        </Typography>
                                    </TableCell>


                                    <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid #f3f4f6" }}>
                                        <Chip
                                            label={row.is_active ? "Active" : "Inactive"}
                                            sx={{
                                                fontSize: "0.7rem",
                                                backgroundColor: row.is_active ? "#E7F6EA" : "#fbeae8",
                                                color: row.is_active ? "#1B8E3E" : "#c62828",
                                                fontWeight: 600,
                                                borderRadius: "10px",

                                            }}
                                        />
                                    </TableCell>

                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => handleIsEdit(row)}
                                                size="small"

                                                sx={{
                                                    color: "#6b7280",
                                                    "&:hover": { color: "#0d9488", bgcolor: "#f0fdfa" },
                                                    borderRadius: 1.5,
                                                }}
                                            >
                                                <Edit sx={{ fontSize: 15 }} />
                                            </IconButton>

                                            <IconButton

                                                onClick={() => handleDelete(row?.id)}
                                                size="small"

                                                sx={{
                                                    color: "#dc2626",
                                                    "&:hover": { color: "#ac2020ff", bgcolor: "#fff7ed" },
                                                    borderRadius: 1.5,
                                                }}
                                            >
                                                <Delete sx={{ fontSize: 15 }} />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </TableContainer>

                {/* Footer */}
                <Box sx={{ position: "sticky", border: "1px solid #e5e7eb", borderTop: "none", borderCollapse: "collapse", background: "white", bottom: "2", width: "100%" }}>


                    <CommonPagination
                        page={page}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        total_items={rolesData?.length}
                        setPage={setPage}
                    />

                </Box>
            </Paper >

            {
                addUserToggle && (
                    <UserFormModal open={addUserToggle} onClose={() => setAddUserToggle(false)} onsubmit={isEdit ? handleEditUserSubmit : handleAdd} isEdit={isEdit} initialValues={isEdit ? initialValues : null} />
                )
            }
        </Box >
    );
};

const headCellStyle = {

    fontSize: "0.9rem",

    color: "#6b7280",
    borderBottom: "1px solid #f3f4f6",
    py: 1.25,
    px: 2,

};


export default UsersAndRoles;