import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import { useGetActiveAlertsQuery } from "../../services/Api/alerts.api";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PageTitle from "../../components/Pagetitle";
import SearchBar from "../../components/SearchBar";
import { useEffect, useState } from "react";
import { sensorsList } from "../deviceManagement/DeviceForm";
import { useGetLocationsQuery } from "../../services/Api/location.api";

const AlertCard = ({ item, onViewDetails }: any) => {
    const isCO2 = item.sensor_name === "CO2";
    const thresholdLabel = item.threshold_value != null
        ? `${item.threshold_value}${item.unit ? " " + item.unit : ""}`
        : "-";



    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2.5,
                borderRadius: "20px",
                border: "1px solid #f1caca",
                background: "linear-gradient(135deg, #fff6f6ff, #ffffff)",
            }}
        >
            {/* LEFT */}
            <Box sx={{ display: "flex", gap: 2 }}>
                {/* ICON */}
                <Box
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#fde6e6",
                        border: "1px solid #f1caca"
                    }}
                >
                    {isCO2 ? (
                        <AirIcon sx={{ color: "#c62828", }} />
                    ) : (
                        <ThermostatIcon sx={{ color: "#c62828" }} />
                    )}
                </Box>

                {/* TEXT */}
                <Box>
                    <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                        {item.alert_name}
                    </Typography>

                    <Typography sx={{ color: "#666", fontSize: 12, mt: 0.5, }}>
                        The {item?.sensor_name} Exceed its   <span style={{ color: "#d32f2f", fontWeight: 500, }}>
                            {thresholdLabel}
                        </span>

                    </Typography>

                    {/* <Typography sx={{ color: "#666", fontSize: 12, mt: 0.5, }}>
                        {item.description.split(/(\d+°C|\d+ ppm)/g).map((part: any, i: number) =>
                            part.match(/(\d+°C|\d+ ppm)/) ? (
                                <span key={i} style={{ color: "#d32f2f", fontWeight: 500, }}>
                                    {part}
                                </span>
                            ) : (
                                part
                            )
                        )}
                    </Typography> */}

                    {/* TAGS */}
                    <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                        <Tag icon={<LocationOnIcon sx={{ fontSize: "14px" }} />} label={item.location_name} />
                        <Tag
                            icon={isCO2 ? <AirIcon sx={{ fontSize: "14px" }} /> : <ThermostatIcon sx={{ fontSize: "14px" }} />}
                            label={item.sensor_name}
                        />
                        <Tag icon={<AccessTimeIcon sx={{ fontSize: "14px" }} />} label={new Date(item.created_at).toLocaleDateString()} />
                    </Box>
                </Box>
            </Box>

            {/* BUTTON */}
            <Button
                onClick={() => onViewDetails?.(item)}
                sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    border: "1px solid #ececec",
                    px: 1,
                    fontSize: 12,
                    bgcolor: "#f3f3f3",
                    "&:hover": { bgcolor: "#0c4a3d", color: "white" },
                }}
                endIcon={<KeyboardArrowRightIcon sx={{ fontSize: 12 }} />}
            >
                View Details
            </Button>
        </Box>
    );
};

const Tag = ({ icon, label }: any) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 0.7,
            py: 0.1,
            border: "1px solid #d3d3d3ff",
            borderRadius: "10px",
            bgcolor: "#f2f2f2",
            fontSize: 12,
            color: "#555",
            input: {
                fontSize: 12,
                color: "#333",
            },

        }}
    >
        {icon}

        <Typography sx={{ fontSize: 10, color: "#333" }}>
            {label}
        </Typography>

    </Box>
);

const AlertOverview = () => {

    const [search, setSearch] = useState("")
    const [locationFilter, setLocationFilter] = useState("All")
    const [sensorFilter, setSensorFilter] = useState("All")
    const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest")
    const [detailsAlert, setDetailsAlert] = useState<any>(null)
    const [filteredAlerts, setFilteredAlerts] = useState([])

    const { data: activeAlerts, isLoading } = useGetActiveAlertsQuery()
    const { data: locations } = useGetLocationsQuery({})

    const filterData = (data: any) => {
        const q = search.toLowerCase();
        return data
            .filter((item: any) => {
                const matchesSearch = (item.location_name || "").toLowerCase().includes(q) ||
                    (item.sensor_name || "").toLowerCase().includes(q) ||
                    String(item.threshold_value ?? "").toLowerCase().includes(q);
                const matchesLocation = locationFilter === "All" || item.location_name === locationFilter;
                const matchesSensor = sensorFilter === "All" || item.sensor_name === sensorFilter;
                return matchesSearch && matchesLocation && matchesSensor;
            })
            .sort((a: any, b: any) => {
                const da = new Date(a.created_at).getTime();
                const db = new Date(b.created_at).getTime();
                return sortOrder === "latest" ? db - da : da - db;
            })
    }

    useEffect(() => {
        if (activeAlerts) {
            setFilteredAlerts(filterData(activeAlerts))
        }
    }, [activeAlerts, search, locationFilter, sensorFilter, sortOrder])

    return (
        <Box >
            <PageTitle title="Alerts" />


            {/* FILTERS */}
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    mb: 3,
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    p: 2.5,
                }}

            >
                <TextField
                    select
                    label="Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    size="small"
                    sx={{
                        width: 200, fontSize: "12px",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            fontSize: "0.8rem",
                            bgcolor: "#fff",
                            "& fieldset": { borderColor: "#e5e7eb" },
                            "&:hover fieldset": { borderColor: "#d1d5db" },
                            "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                        },
                    }}
                >
                    <MenuItem value="All" sx={{ fontSize: "12px" }}>All</MenuItem>
                    {
                        locations?.locations?.map((location: any) => (
                            <MenuItem key={location.id} value={location.name} sx={{ fontSize: "12px" }}>{location.name}</MenuItem>
                        ))
                    }

                </TextField>

                <TextField
                    select
                    label="Sensor"
                    value={sensorFilter}
                    onChange={(e) => setSensorFilter(e.target.value)}
                    size="small"
                    sx={{
                        width: 200,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            fontSize: "0.8rem",
                            bgcolor: "#fff",
                            "& fieldset": { borderColor: "#e5e7eb" },
                            "&:hover fieldset": { borderColor: "#d1d5db" },
                            "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                        },
                    }}
                >
                    <MenuItem value="All">All</MenuItem>
                    {
                        sensorsList?.map((sensor: any) => (
                            <MenuItem key={sensor.metric_key} value={sensor.display_name} sx={{ fontSize: "12px" }}>{sensor.display_name}</MenuItem>
                        ))
                    }
                </TextField>
            </Box>

            {/* SEARCH + SORT */}
            <Box
                sx={
                    {
                        borderRadius: "10px",
                        padding: 2,
                        border: "1px solid #ccc"

                    }
                }            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 3,
                    }}
                >
                    {/* Search */}
                    <SearchBar placeholder="Search by location or sensor" value={search} onChange={setSearch} onSearch={(value) => setSearch(value)} />

                    <Button
                        onClick={() => setSortOrder((o) => (o === "latest" ? "oldest" : "latest"))}
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{
                            borderRadius: "8px",
                            bgcolor: "#fff",
                            border: "1px solid #ddd",
                            textTransform: "none",
                            fontSize: "12px",
                            padding: "8px 10px"
                        }}
                    >
                        Sort by: {sortOrder === "latest" ? "Latest" : "Oldest"}
                    </Button>
                </Box>

                {/* ALERT LIST */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {isLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                            <CircularProgress size={32} sx={{ color: "#0d9488" }} />
                        </Box>
                    ) : filteredAlerts?.length == 0 ? (
                        <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: "center", mt: 2, color: "#787878ff" }}>No alerts found</Typography>
                    ) : (
                        filteredAlerts?.map((item: any, i: number) => (
                            <AlertCard key={i} item={item} onViewDetails={setDetailsAlert} />
                        ))
                    )}
                </Box>
            </Box>

            {/* DETAILS DIALOG */}
            <Dialog open={!!detailsAlert} onClose={() => setDetailsAlert(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 16, fontWeight: 600 }}>
                    {detailsAlert?.alert_name}
                    <IconButton size="small" onClick={() => setDetailsAlert(null)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                        {/* RULE CONFIGURATION */}
                        <Box>
                            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.3, mb: 1 }}>
                                Rule configuration
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {[
                                    ["Min threshold", detailsAlert?.min_value != null ? `${detailsAlert.min_value} ${detailsAlert?.unit || ""}` : "Not set"],
                                    ["Max threshold", detailsAlert?.max_value != null ? `${detailsAlert.max_value} ${detailsAlert?.unit || ""}` : "Not set"],
                                    ["Required duration", detailsAlert?.duration_minutes ? `${detailsAlert.duration_minutes} min continuous` : "Immediate (0 min)"],
                                    ["Start time", detailsAlert?.start_time || "00:00"],
                                    ["End time", detailsAlert?.end_time || "23:59"],
                                ].map(([label, value]) => (
                                    <Box key={label} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                        <Typography sx={{ fontSize: 13, color: "#6b7280" }}>{label}</Typography>
                                        <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{value}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <Box sx={{ borderTop: "1px solid #f3f4f6" }} />

                        {/* ALERT DETAILS */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {[
                                ["Location", detailsAlert?.location_name],
                                ["Device", detailsAlert?.device_name],
                                ["Sensor", detailsAlert?.sensor_name],
                                ["Actual value", detailsAlert?.actual_value != null ? `${detailsAlert.actual_value} ${detailsAlert?.unit || ""}` : "-"],
                                ["Severity", detailsAlert?.severity],
                                ["Status", detailsAlert?.status],
                                ["Created at", detailsAlert?.created_at ? new Date(detailsAlert.created_at).toLocaleString() : "-"],
                            ].map(([label, value]) => (
                                <Box key={label} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                    <Typography sx={{ fontSize: 13, color: "#6b7280" }}>{label}</Typography>
                                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#111827", textTransform: label === "Status" || label === "Severity" ? "capitalize" : "none" }}>{value ?? "-"}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default AlertOverview;