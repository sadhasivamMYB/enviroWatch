import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    Add,
    Edit,
    Delete,
    Rowing,
} from "@mui/icons-material";

import DeviceManagementForm, { sensorsList } from "./DeviceForm";
import { useGetLocationIdDevicesQuery, useGetLocationsQuery } from "../../services/Api/location.api";
import { useAddDeviceMutation, useDeleteDeviceMutation, useGetDevicesQuery, useUpdateDeviceMutation } from "../../services/Api/device.api";
import PageTitle from "../../components/Pagetitle";
import SearchBar from "../../components/SearchBar";
import CommonPagination from "../../components/Pagination";
import StatusBadge from "../../components/StatusBadge";
import { useGetMetricsQuery } from "../../services/Api/metrics";

const columns = [
    { label: "Sensor Name", width: 180 },
    { label: "Type", width: 120 },
    { label: "Status", width: 100 },
    { label: "Sensors", width: 130 },
    { label: "Actions", width: 90, align: "center" },
];


// ─── Main Page 
export default function AlertManagement() {
    const [search, setSearch] = useState("");
    const [sensorFilter, setSensorFilter] = useState<string | null>(null);
    const [activeLocation, setActiveLocation] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const { data: locationData } = useGetLocationsQuery({ limit: null, offset: null });

    const LocationData = locationData?.locations

    const [addDevice, { isLoading: isAddLoading }] = useAddDeviceMutation();
    const [updateDevice, { error: updateError, isLoading: isUpdateLoading }] = useUpdateDeviceMutation()

    const [deleteDevice] = useDeleteDeviceMutation()

    const selectedLocationId =
        activeLocation ??
        (locationData?.locations?.[0]?.id
            ? Number(locationData.locations[0].id)
            : undefined);

    const { data: locationDevices } = useGetLocationIdDevicesQuery(
        {
            location_id: selectedLocationId,
            limit: rowsPerPage,
            offset: page,
        },
        {
            skip: !selectedLocationId,
        }
    ); console.log(locationDevices?.devices, "Location Devices")


    const [open, setOpen] = useState(false);

    const filtered = locationDevices?.devices?.filter((r) => {
        const matchesSearch =
            search === "" || r.name.toLowerCase().includes(search.toLowerCase())
        // r.sensors.some((sensor) => sensor.toLowerCase().includes(search.toLowerCase()));
        // const matchesSensor = !sensorFilter || r.sensors.includes(sensorFilter);
        const matchesStatus = statusFilter === undefined ||
            statusFilter === null
            ? true
            : statusFilter === 1
                ? r.is_active
                : !r.is_active;
        // return matchesSearch && matchesSensor && matchesStatus;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (ids: string) => {
        try {
            deleteDevice(ids).unwrap()
        } catch (error) {
            console.log(error)
        }
    };

    const handleEdit = (row) => {
        console.log(row)
        setIsEdit(true)
        setSelectedRow(row)
        setOpen(true)


    };

    const handleAddDevice = async (data: any) => {
        console.log(data, "😎😎😎")
        try {
            await addDevice(data).unwrap()
            setOpen(false)
        } catch (error) {
            console.log(updateError, "❌❌❌❌❌❌❌❌❌❌❌❌❌")
            console.log(error)
        }
    }

    const handleEditedDevice = async (payload: any) => {



        try {
            await updateDevice(payload).unwrap()
            setOpen(false)
            setIsEdit(false)
            setSelectedRow(null)
        } catch (error) {
            console.log(error)
        }

    }

    return (

        <>
            <PageTitle title="Device Management" />
            <Box sx={{ display: "flex", gap: 2, height: "100%" }}>



                <LocationSideBar LocationData={LocationData} activeLocation={activeLocation} setActiveLocation={setActiveLocation} setSearch={setSearch} setSensorFilter={setSensorFilter} setStatusFilter={setStatusFilter} />

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        height: "100%",
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            px: 2,
                            py: 1.5,
                            borderBottom: "1px solid #f3f4f6",
                            flexShrink: 0,
                        }}
                    >
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            onSearch={setSearch}
                            placeholder="Search Device Name and Sensors..."
                        />

                        <Box sx={{ flex: 1 }} />

                        <Button
                            variant="contained"
                            startIcon={<Add sx={{ fontSize: 16 }} />}
                            onClick={() => { setOpen(true); setIsEdit(false) }}
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
                                "&:hover": {
                                    bgcolor: "#0f766e",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Add Device
                        </Button>
                    </Box>

                    {/* Scrollable Table Area */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            minHeight: 0,
                        }}
                    >
                        <TableContainer
                            sx={{
                                bgcolor: "#fff",
                                height: "100%",
                            }}
                        >
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#f9fafb" }}>
                                        {columns.map((col) => (
                                            <TableCell
                                                key={col.label}
                                                align={"left"}
                                                // align={col?.align || "left"}
                                                sx={{
                                                    width: col.width,
                                                    fontSize: "14px",

                                                    color: "#6b7280",
                                                    borderBottom: "1px solid #f3f4f6",
                                                    py: 1.25,
                                                    px: 2,
                                                    bgcolor: "#f9fafb",
                                                }}
                                            >
                                                {col.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {filtered?.length == 0 ?
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
                                            >No Data Found</TableCell>
                                        </TableRow>


                                        : filtered?.map((row, idx) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{
                                                    "&:hover": { bgcolor: "#f9fafb" },
                                                    bgcolor: idx % 2 === 0 ? "#fff" : "#fdfdfd",
                                                }}
                                            >
                                                {/* Device Name */}
                                                <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid #f3f4f6" }}>
                                                    <Typography sx={{ fontSize: "0.65rem", color: "#9ca3af", fontWeight: 500, lineHeight: 1 }}>
                                                        {row.device_uid}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#111827", lineHeight: 1.4 }}>
                                                        {row.name}
                                                    </Typography>
                                                </TableCell>

                                                {/* Type */}
                                                <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid #f3f4f6" }}>
                                                    <Typography sx={{ fontSize: "14px" }}>
                                                        {row.device_type}
                                                    </Typography>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid #f3f4f6" }}>
                                                    <StatusBadge status={row.is_active ? "Active" : "Inactive"} />
                                                </TableCell>

                                                {/* Sensor */}
                                                <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid #f3f4f6" }}>
                                                    <Box sx={{ display: "flex", gap: 0.5 }}>
                                                        {
                                                            row?.sensors && row?.sensors?.length > 0 ? (
                                                                row?.sensors?.map((sensor: any) => (
                                                                    <Typography key={sensor.metric_key} sx={{ fontSize: "0.7rem", backgroundColor: "#eaeaeaff", borderRadius: "4px", padding: "2px 4px", width: "fit-content", color: "#474747ff" }}>
                                                                        {sensor.display_name}
                                                                    </Typography>
                                                                ))
                                                            ) : (
                                                                <Typography sx={{ fontSize: "0.7rem", color: "#474747ff" }}>
                                                                    -
                                                                </Typography>
                                                            )
                                                        }


                                                    </Box>
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell align="center" sx={{ px: 2, py: 1.75, borderBottom: "1px solid #f3f4f6" }}>
                                                    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleEdit(row)}
                                                                sx={{
                                                                    color: "#6b7280",
                                                                    "&:hover": { color: "#0d9488", bgcolor: "#f0fdfa" },
                                                                    borderRadius: 1.5,
                                                                }}
                                                            >
                                                                <Edit sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDelete(row.id)}
                                                                sx={{
                                                                    color: "#ef4444",
                                                                    "&:hover": { bgcolor: "#fef2f2" },
                                                                    borderRadius: 1.5,
                                                                }}
                                                            >
                                                                <Delete sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {/* Fixed Pagination Footer */}
                    <Box
                        sx={{
                            borderTop: "1px solid #e5e7eb",

                            bgcolor: "#fff",
                            flexShrink: 0,
                        }}
                    >
                        <CommonPagination
                            page={page}
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
                            total_items={locationDevices?.total}
                            setPage={setPage}
                        />
                    </Box>
                </Box>
            </Box>

            {
                open && (
                    <DeviceManagementForm open={open} onclose={() => setOpen(false)} isEdit={isEdit} initialValues={isEdit ? selectedRow : null} onsubmit={isEdit ? handleEditedDevice : handleAddDevice} />

                )
            }

        </>
    );
}


const LocationSideBar = ({ LocationData, activeLocation, setActiveLocation, setSearch, setSensorFilter, setStatusFilter }) => {
    return (
        <Box
            sx={{
                width: 200,
                flexShrink: 0,
                borderRight: "1px solid #e5e7eb",
                pr: 1,
            }}
        >
            {LocationData?.map((loc) => {
                const isActive = loc.id === activeLocation;
                return (
                    <Box
                        key={loc.id}
                        onClick={() => { setActiveLocation(loc.id); setSearch(""); setSensorFilter(null); setStatusFilter(null); }}
                        sx={{
                            px: 2,
                            py: 1.1,
                            borderRadius: 2,
                            cursor: "pointer",
                            mb: 0.25,
                            bgcolor: isActive ? "#e6fbf8" : "transparent",
                            border: isActive ? "1px solid #c5e8e4" : "none",
                            transition: "background 0.15s",
                            "&:hover": {
                                bgcolor: isActive ? "#ccfbf1" : "#f3f4f6",
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "0.85rem",
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? "#007a70" : "#374151",
                            }}
                        >
                            {loc.name}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    )
}


