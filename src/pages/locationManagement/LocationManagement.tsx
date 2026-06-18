import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import LocationFormModal from "./LocationForm";
import { useAddLocationMutation, useDeleteLocationMutation, useGetLocationsQuery, useUpdateLocationMutation } from "../../services/Api/location.api";
import SearchBar from "../../components/SearchBar";
import PageTitle from "../../components/Pagetitle";
import CommonPagination from "../../components/Pagination";
import StatusBadge from "../../components/StatusBadge";



const LocationManagement: React.FC = () => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [isEditValue, setIsEditValue] = useState()
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);


    const { data: locationInfo, isLoading } = useGetLocationsQuery({ limit: rowsPerPage, offset: page })

    const locationInfoData = locationInfo?.locations || []
    console.log("locationInfoData", locationInfoData)


    const totalItems = useMemo(() => locationInfo?.total, [locationInfo])



    useEffect(() => {

        console.log("rowsPerPage", rowsPerPage, page)

    }, [rowsPerPage])


    const [addLocation, { isLoading: isAddLoading }] = useAddLocationMutation()

    const [updateLocation] = useUpdateLocationMutation()

    const [deleteLcoation] = useDeleteLocationMutation()

    const filteredRows = useMemo(() => {
        return locationInfoData?.filter(
            (row) =>
                row.name.toLowerCase().includes(search.toLowerCase()) ||
                row.description.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, locationInfoData]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleSubmit = async (data: any) => {
        console.log("handleSubmit", data);
        setOpen(false)
        try {
            await addLocation(data).unwrap()
        }
        catch (error) {
            console.log(error)
        }

    }


    const handleEditLocation = (e: any) => {

        console.log(e)
        setIsEditValue(e)
        setOpen(true)
        setEditOpen(true)


    }

    const handleEditLocationSubmit = async (data: any) => {

        console.log("UpdateSubmit", data);

        setOpen(false)
        try {
            await updateLocation({ location_id: data.location_id, ...data }).unwrap()
        }
        catch (error) {
            console.log(error)
        }

    }

    const handleDeleteLocation = async (e: any) => {

        let location_id = e?.id

        try {
            await deleteLcoation(location_id)
        }
        catch (err) {
            console.log(err)
        }
    }



    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
            }}
        >
            {/* Page Title */}
            <PageTitle title="Location Management" />

            <Paper
                elevation={0}
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    minHeight: 0,
                }}
            >
                {/* Toolbar */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 3,
                        py: 2,
                        borderBottom: "1px solid #f3f4f6",
                        bgcolor: "#fcfcfc",
                        flexShrink: 0,
                    }}
                >
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        onSearch={setSearch}
                        placeholder="Search Location Name..."
                    />

                    <Box sx={{ flex: 1 }} />

                    <Button
                        variant="contained"
                        startIcon={<Add sx={{ fontSize: 16 }} />}
                        onClick={() => { setOpen(true); setEditOpen(false) }}
                        sx={{
                            bgcolor: "#0d9488",
                            color: "#fff",
                            borderRadius: "12px",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            px: 2,
                            py: 0.9,
                            boxShadow: "none",
                            "&:hover": {
                                bgcolor: "#0f766e",
                                boxShadow: "none",
                            },
                        }}
                    >
                        Add Location
                    </Button>
                </Box>

                {/* Scrollable Table */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        minHeight: 0,
                    }}
                >
                    <TableContainer sx={{ height: "100%" }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow
                                    sx={{
                                        backgroundColor: "#f8fafc",
                                    }}
                                >
                                    <TableCell sx={headCellStyle}>
                                        Location Name
                                    </TableCell>

                                    <TableCell sx={headCellStyle}>
                                        Description
                                    </TableCell>

                                    <TableCell sx={headCellStyle}>

                                        Devices


                                    </TableCell>

                                    <TableCell sx={headCellStyle}>
                                        {/* <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        > */}
                                        Status
                                        {/* <FilterAltOutlinedIcon
                                            sx={{
                                                fontSize: "14px",
                                                color: "#9ca3af",
                                            }}/> */}
                                        {/* </Box> */}
                                    </TableCell>

                                    <TableCell
                                        sx={headCellStyle}
                                        align="center"

                                    >
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {filteredRows?.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            align="center"
                                            sx={{
                                                py: 10,
                                                color: "#9ca3af",
                                                fontSize: "0.82rem",
                                                borderBottom: "none",
                                            }}
                                        >
                                            No Location found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRows?.map((row, idx) => (
                                        <TableRow
                                            key={row.id}
                                            hover
                                            sx={{
                                                transition: "0.15s ease",
                                                bgcolor:
                                                    idx % 2 === 0
                                                        ? "#fff"
                                                        : "#fcfcfc",
                                                "& td": {
                                                    borderBottom:
                                                        "1px solid #f1f5f9",
                                                },
                                                "&:hover": {
                                                    bgcolor: "#f9fafb",
                                                },
                                            }}
                                        >
                                            <TableCell
                                                sx={{
                                                    px: 2,
                                                    py: 1.8,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: "14px",

                                                        color: "#111827",
                                                    }}
                                                >
                                                    {row.name}
                                                </Typography>
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    px: 2,
                                                    py: 1.8,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: "13px",
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    {row.description}
                                                </Typography>
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    px: 2,
                                                    py: 1.8,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.82rem",
                                                        fontWeight: 500,
                                                        color: "#111827",
                                                    }}
                                                >
                                                    {row?.device_count}
                                                </Typography>
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    px: 2,
                                                    py: 1.8,
                                                }}
                                            >
                                                <StatusBadge status="Active" />
                                            </TableCell>

                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: 0.75,
                                                    }}
                                                >
                                                    <IconButton

                                                        onClick={() => handleEditLocation(row)}
                                                        size="small"
                                                        sx={{
                                                            color: "#6b7280",
                                                            borderRadius: "10px",
                                                            "&:hover": {
                                                                color: "#0d9488",
                                                                bgcolor: "#f0fdfa",
                                                            },
                                                        }}
                                                    >
                                                        <Edit
                                                            sx={{
                                                                fontSize: 15,
                                                            }}
                                                        />
                                                    </IconButton>

                                                    <IconButton
                                                        onClick={() => handleDeleteLocation(row)}
                                                        size="small"
                                                        sx={{
                                                            color: "#dc2626",
                                                            borderRadius: "10px",
                                                            "&:hover": {
                                                                bgcolor: "#fff7ed",
                                                            },
                                                        }}
                                                    >
                                                        <Delete
                                                            sx={{
                                                                fontSize: 15,
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        borderTop: "1px solid #e5e7eb",
                        bgcolor: "#fff",
                        px: 2,

                        flexShrink: 0,
                    }}
                >
                    <CommonPagination
                        page={page}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        total_items={totalItems}
                        setPage={setPage}
                    />
                </Box>
            </Paper >

            {open && (

                <LocationFormModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onsubmit={editOpen ? handleEditLocationSubmit : handleSubmit}
                    isEdit={editOpen}
                    initialValues={editOpen ? isEditValue : null}
                />
            )}
        </Box >
    );
};

const headCellStyle = {

    fontSize: "14px",

    color: "#6b7280",
    borderBottom: "1px solid #f3f4f6",


};


export default LocationManagement;