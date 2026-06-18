import { useEffect, useState } from "react";
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
    Delete
} from "@mui/icons-material";
import AddRuleDialog from "./AlertRuleForm";
import SearchBar from "../../components/SearchBar";
import PageTitle from "../../components/Pagetitle";
import StatusBadge from "../../components/StatusBadge";
import CommonPagination from "../../components/Pagination";
import { useGetLocationsQuery } from "../../services/Api/location.api";
import { useAddAlertRuleMutation, useGetAlertRulesQuery } from "../../services/Api/alerts.api";

// Types



export default function AlertManagement() {
    const [activeLocation, setActiveLocation] = useState("warehouse-a");
    const [search, setSearch] = useState("");
    const [sensorFilter, setSensorFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState(null);

    const { data: locationData } = useGetLocationsQuery({ limit: null, offset: null })
    const { data: alertData } = useGetAlertRulesQuery()

    console.log(alertData, "🔃🔃🔃🔃")

    const LocationData = locationData?.locations

    // const { data: DeviceData } = useGetDevicesQuery(activeLocation);
    const [AddAlertRule, { isLoading }] = useAddAlertRuleMutation()

    const activeLabel = LocationData?.find((l) => l.id === activeLocation)?.name ?? "";

    useEffect(() => {
        setActiveLocation(LocationData?.[0].id || "");
    }, [LocationData]);

    const filtered = alertData?.filter((r) => {
        const matchesSearch =
            search === "" ||
            r?.rule_name?.toLowerCase()?.includes(search?.toLowerCase())
        //     r?.deviceCode?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //     r?.sensors?.some((s: any) => s?.toLowerCase()?.includes(search?.toLowerCase()));
        // const result = matchesSearch
        return matchesSearch
    });

    const handleDelete = (id: string) => {
        // handler placeholder
        console.log("Delete", id);
    };

    const handleEdit = (id: string) => {
        console.log("Edit", id);
    };

    const [open, setOpen] = useState(false)


    const handleSubmit = async (data: any) => {
        try {
            await AddAlertRule(data).unwrap()
            setOpen(false)
        } catch (error) {
            console.log(error)
        }
    }


    if (open) {
        return <AddRuleDialog open={open} onclose={() => setOpen(false)} isEdit={false} initialValues={undefined} onsubmit={handleSubmit} />
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
            <PageTitle title="Alert Management" />

            {/* Body */}
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                {/* Sidebar */}
                <Sidebar
                    LocationData={LocationData}
                    activeLocation={activeLocation}
                    setActiveLocation={setActiveLocation}
                    setSearch={setSearch}
                    setSensorFilter={setSensorFilter}
                    setStatusFilter={setStatusFilter}
                />

                {/* Main Content */}
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        border: "1px solid #e5e7eb",
                        borderRadius: "16px",
                        bgcolor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                >
                    {/* Header */}
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
                        <Typography
                            sx={{
                                fontSize: "0.95rem",
                                fontWeight: 700,
                                color: "#111827",
                                flexShrink: 0,
                            }}
                        >
                            {activeLabel}
                        </Typography>

                        {/* Search */}
                        <SearchBar
                            placeholder="Search Location Name, Devices and so on..."
                            value={search}
                            onChange={setSearch}
                            onSearch={(value) => setSearch(value)}
                        />

                        <Box sx={{ flex: 1 }} />

                        {/* Add Rules */}
                        <Button
                            variant="contained"
                            startIcon={<Add sx={{ fontSize: 16 }} />}
                            onClick={() => setOpen(true)}
                            sx={{
                                bgcolor: "#0d9488",
                                color: "#fff",
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                px: 2,
                                py: 0.9,
                                boxShadow: "none",
                                "&:hover": {
                                    bgcolor: "#0f766e",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Add Rules
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
                        <TableContainer
                            sx={{
                                bgcolor: "#fff",
                                height: "100%",
                            }}
                        >
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                                        {[
                                            { label: "Device Name", hasFilter: false, width: "35%" },
                                            { label: "Sensor", hasFilter: false, width: "16%" },
                                            { label: "Min", hasFilter: false, width: "16%" },
                                            { label: "Max", hasFilter: false, width: "16%" },
                                            { label: "Status", hasFilter: false, width: "16%" },
                                            {
                                                label: "Action",
                                                hasFilter: false,
                                                width: "14%",
                                                align: "center" as const,
                                            },
                                        ].map((col) => (
                                            <TableCell
                                                key={col.label}
                                                align={col.align ?? "left"}
                                                sx={{
                                                    width: col.width,
                                                    fontSize: "14px",

                                                    color: "#6b7280",
                                                    borderBottom: "1px solid #edf2f7",
                                                    py: 1.4,
                                                    px: 2,
                                                    bgcolor: "#f8fafc",
                                                }}
                                            >
                                                {/* <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                        justifyContent:
                                                            col.align === "center"
                                                                ? "center"
                                                                : "flex-start",
                                                    }}
                                                > */}
                                                {col.label}

                                                {/* {col.hasFilter && (
                                                        <Tooltip title={`Filter by ${col.label}`}>
                                                            <FilterAlt
                                                                sx={{
                                                                    fontSize: 13,
                                                                    color:
                                                                        (col.label === "Sensor" && sensorFilter) ||
                                                                            (col.label === "Status" && statusFilter)
                                                                            ? "#0d9488"
                                                                            : "#d1d5db",
                                                                    cursor: "pointer",
                                                                    transition: "0.2s",
                                                                    "&:hover": { color: "#0d9488" },
                                                                }}
                                                                onClick={() => {
                                                                    if (col.label === "Status") {
                                                                        setStatusFilter((prev) =>
                                                                            prev === null
                                                                                ? "Active"
                                                                                : prev === "Active"
                                                                                    ? "Inactive"
                                                                                    : null
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    )} */}
                                                {/* </Box> */}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {filtered?.length === 0 ? (
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
                                                No Alerts Found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filtered?.map((row, idx) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{
                                                    "&:last-child td": { border: 0 },
                                                    "&:hover": {
                                                        bgcolor: "#f9fafb",
                                                    },
                                                    transition: "0.15s ease",
                                                    bgcolor: idx % 2 === 0 ? "#fff" : "#fcfcfc",
                                                }}
                                            >
                                                {/* Device Name */}
                                                <TableCell
                                                    sx={{
                                                        px: 2,
                                                        py: 1.8,
                                                        borderBottom: "1px solid #f3f4f6",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.65rem",
                                                            color: "#9ca3af",
                                                            fontWeight: 500,
                                                            lineHeight: 1,
                                                        }}
                                                    >
                                                        {row?.deviceCode || "-"}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: "14px",

                                                            color: "#111827",
                                                            lineHeight: 1.4,
                                                            mt: 0.25,
                                                        }}
                                                    >
                                                        {row.rule_name}
                                                    </Typography>
                                                </TableCell>

                                                {/* Sensor */}
                                                <TableCell
                                                    sx={{
                                                        px: 2,
                                                        py: 1.75,
                                                        borderBottom: "1px solid #f3f4f6",
                                                    }}
                                                >
                                                    {row?.metric_id}
                                                    {/* <Tooltip
                                                        arrow
                                                        placement="top"
                                                        slotProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    backgroundColor: "white",
                                                                    color: "#111",
                                                                    border: "1px solid #d9d9d9ff",
                                                                    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                                                },
                                                            },
                                                        }}
                                                        title={
                                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                                <Typography

                                                                    sx={{
                                                                        fontSize: "0.7rem",
                                                                        backgroundColor: "#ffffffff",
                                                                        borderRadius: "4px",
                                                                        padding: "2px 6px",
                                                                        color: "#374151",
                                                                        border: "1px solid #b1b1b1b1"
                                                                    }}
                                                                >
                                                                    {row?.metric_id}
                                                                </Typography>

                                                            </Box>
                                                        }
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                gap: 0.5,
                                                                cursor: "pointer",
                                                                width: "fit-content",
                                                            }}
                                                        >
                                                            {row?.sensors?.slice(0, 2).map((sensor: string) => (
                                                                <Typography
                                                                    key={sensor}
                                                                    sx={{
                                                                        fontSize: "0.7rem",
                                                                        backgroundColor: "#eaeaea",
                                                                        borderRadius: "4px",
                                                                        padding: "2px 4px",
                                                                        width: "fit-content",
                                                                        color: "#474747",
                                                                    }}
                                                                >
                                                                    {sensor}
                                                                </Typography>
                                                            ))}

                                                            {row.sensors.length - 2 > 0 && (
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "0.7rem",
                                                                        backgroundColor: "#e4f6ff",
                                                                        borderRadius: "4px",
                                                                        padding: "2px 4px",
                                                                        width: "fit-content",
                                                                        color: "#474747",
                                                                    }}
                                                                >
                                                                    {`+${row.sensors.length - 2}`}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Tooltip> */}
                                                </TableCell>

                                                {/* Min */}
                                                <TableCell
                                                    sx={{
                                                        px: 2,
                                                        py: 1.8,
                                                        borderBottom: "1px solid #f3f4f6",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.82rem",
                                                            color: "#6b7280",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {row.min_value}
                                                    </Typography>
                                                </TableCell>

                                                {/* Max */}
                                                <TableCell
                                                    sx={{
                                                        px: 2,
                                                        py: 1.8,
                                                        borderBottom: "1px solid #f3f4f6",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.82rem",
                                                            color: "#6b7280",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {row.max_value}
                                                    </Typography>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell
                                                    sx={{
                                                        px: 2,
                                                        py: 1.8,
                                                        borderBottom: "1px solid #f3f4f6",
                                                    }}
                                                >
                                                    <StatusBadge status={row?.is_active ? "Active" : "Inactive"} />
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        px: 2,
                                                        py: 1.8,
                                                        borderBottom: "1px solid #f3f4f6",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            gap: 0.75,
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleEdit(row.id)}
                                                                sx={{
                                                                    color: "#6b7280",
                                                                    borderRadius: "10px",
                                                                    transition: "0.2s",
                                                                    "&:hover": {
                                                                        color: "#0d9488",
                                                                        bgcolor: "#f0fdfa",
                                                                    },
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
                                                                    borderRadius: "10px",
                                                                    transition: "0.2s",
                                                                    "&:hover": {
                                                                        bgcolor: "#fef2f2",
                                                                    },
                                                                }}
                                                            >
                                                                <Delete sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
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
                            page={1}
                            rowsPerPage={5}
                            setRowsPerPage={10}
                            total_items={2}
                            setPage={1}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}




interface IsideBar {
    LocationData: any[];
    activeLocation: string;
    setActiveLocation: (id: string) => void;
    setSearch: (value: string) => void;
    setSensorFilter: (value: string | null) => void;
    setStatusFilter: (value: any | null) => void;
}

export const Sidebar = ({ LocationData, activeLocation, setActiveLocation, setSearch, setSensorFilter, setStatusFilter }: IsideBar) => {
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
