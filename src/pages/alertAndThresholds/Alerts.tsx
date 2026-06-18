import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useGetActiveAlertsQuery } from "../../services/Api/alerts.api";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PageTitle from "../../components/Pagetitle";
import SearchBar from "../../components/SearchBar";
import { useEffect, useState } from "react";
import { sensorsList } from "../deviceManagement/DeviceForm";
import { useGetLocationsQuery } from "../../services/Api/location.api";

const AlertCard = ({ item }: any) => {
    const isCO2 = item.sensor === "CO2";



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
                        {item.title}
                    </Typography>

                    <Typography sx={{ color: "#666", fontSize: 12, mt: 0.5, }}>
                        The {item?.sensor} Exceed its   <span style={{ color: "#d32f2f", fontWeight: 500, }}>
                            {item?.threshold}
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
                        <Tag icon={<LocationOnIcon sx={{ fontSize: "14px" }} />} label={item.locationId} />
                        <Tag
                            icon={isCO2 ? <AirIcon sx={{ fontSize: "14px" }} /> : <ThermostatIcon sx={{ fontSize: "14px" }} />}
                            label={item.sensor}
                        />
                        <Tag icon={<AccessTimeIcon sx={{ fontSize: "14px" }} />} label={new Date(item.createdAt).toLocaleDateString()} />
                    </Box>
                </Box>
            </Box>

            {/* BUTTON */}
            <Button

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
    const [filteredAlerts, setFilteredAlerts] = useState([])

    const { data: activeAlerts, isLoading, isError } = useGetActiveAlertsQuery()
    const { data: locations, isLoading: locationsLoading, isError: locationsError } = useGetLocationsQuery()

    console.log(activeAlerts, "activeAlerts")

    const filterData = (data) => {
        return data.filter((item) => {
            return item.locationId.toLowerCase().includes(search.toLowerCase()) ||
                item.sensor.toLowerCase().includes(search.toLowerCase()) ||
                item.threshold.toLowerCase().includes(search.toLowerCase())
        })
    }

    useEffect(() => {
        if (activeAlerts) {
            setFilteredAlerts(filterData(activeAlerts))
        }
    }, [activeAlerts, search])

    console.log(activeAlerts, "alertlist")

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
                    defaultValue="All"
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
                        locations?.map((location: any) => (
                            <MenuItem key={location.id} value={location.name} sx={{ fontSize: "12px" }}>{location.name}</MenuItem>
                        ))
                    }

                </TextField>

                <TextField
                    select
                    label="Sensor"
                    defaultValue="All"
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
                            <MenuItem key={sensor.id} value={sensor?.name} sx={{ fontSize: "12px" }}>{sensor?.name}</MenuItem>
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
                    <SearchBar placeholder="Search Location Name, Devices and so on..." value={search} onChange={setSearch} onSearch={(value) => setSearch(value)} />

                    <Button
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
                        Sort by: Latest
                    </Button>
                </Box>

                {/* ALERT LIST */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {filteredAlerts?.length == 0 ? (
                        <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: "center", mt: 2, color: "#787878ff" }}>No alerts found</Typography>
                    ) : (
                        filteredAlerts?.map((item: any, i: number) => (
                            <AlertCard key={i} item={item} />
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default AlertOverview;