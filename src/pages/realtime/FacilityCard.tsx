import React from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Typography,
    Link,
    Divider,
} from "@mui/material";
import {
    ArrowForward,
    RoomPreferencesOutlined,
} from "@mui/icons-material";

import ThermostatOutlinedIcon from '@mui/icons-material/ThermostatOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import AirOutlinedIcon from '@mui/icons-material/AirOutlined';



// ─── Types ───────────────────────────────────────────────────────────────────

export type StatusTag = "normal" | "warning" | "alert";



type data = {
    id: string,
    name: string;
    description: string;
    status: string;
    temperature: number;
    humidity: number;
    aqi: number;
    totalDevices: number;
    activeDevices: number;
    inactiveDevices: number;
    icon?: React.ReactNode;

}

export interface FacilityCardProps {
    data: data,
    onViewDetails?: (id: string) => any;
}

// ─── Status

const STATUS_CONFIG: Record<
    string,
    {
        label: string;
        chipBg: string;
        chipColor: string;
        cardBg: string;
        borderColor: string;
        glowColor: string;
    }
> = {
    normal: {
        label: "Normal",
        chipBg: "#22c55e",
        chipColor: "#fff",
        cardBg: "linear-gradient(200deg, #dcfce7 0%, #ffffff 70%)",
        borderColor: "#bbf7d0",
        glowColor: "rgba(34, 197, 94, 0.12)",
    },
    warning: {
        label: "Warning",
        chipBg: "#ca8a04",
        chipColor: "#fff",
        cardBg: "linear-gradient(200deg, #fef9c3 0%, #ffffff 70%)",
        borderColor: "#fde68a",
        glowColor: "rgba(202, 138, 4, 0.12)",
    },
    alert: {
        label: "Alert",
        chipBg: "#ef4444",
        chipColor: "#fff",
        cardBg: "linear-gradient(200deg, #ffe4e6 0%, #ffffff 70%)",
        borderColor: "#fecdd3",
        glowColor: "rgba(239, 68, 68, 0.12)",
    },
};

// ─── Metric 

// const getAQIColor = (value: string) => {
//     const lower = value.toLowerCase();
//     if (lower === "good") return "#22c55e";
//     if (lower === "moderate") return "#eab308";
//     return "#ef4444";
// };

const MetricIcon: React.FC<{ type: string }> = ({
    type,
}) => {
    const styles = {
        temperature: { color: "#b38600" },
        humidity: { color: "#00a395" },
        aqi: { color: "#039900" },
    };

    const icons = {
        temperature: <ThermostatOutlinedIcon sx={{ ...styles.temperature, fontSize: "18px" }} />,
        humidity: <WaterDropOutlinedIcon sx={{ ...styles.humidity, fontSize: "18px" }} />,
        aqi: <AirOutlinedIcon sx={{ ...styles.aqi, fontSize: "18px" }} />,
    };

    return icons[type];
};

// ─── Metric Card 

const MetricTile: React.FC<{
    metric: number;
    type: string;
}> = ({ metric, type }) => {

    const labelColors = {
        temperature: "#b38600",
        humidity: "#00a395",
        aqi: "#039900",
    };

    const unit = {
        temperature: "°C",
        humidity: "%",
        aqi: "Good"
    }

    return (
        <Box
            sx={{

                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(241, 241, 241, 0.9)",
                borderRadius: "8px",
                padding: "4px 4px ",
                flex: 1,
                minWidth: 0,
            }}
        >


            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <MetricIcon type={type} />
                <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "#000", }}
                >
                    {metric}
                    <span style={{ marginLeft: "1px" }}>{unit[type]}</span>
                </Typography>

            </Box>

            <Typography
                sx={{ color: labelColors[type], fontWeight: 500, fontSize: "0.6rem" }}
            >
                {type}
            </Typography>
        </Box>
    );
};


// ─── Main Component

export const FacilityCard: React.FC<FacilityCardProps> = ({
    data,
    onViewDetails
}) => {


    console.log(data, "🔃🔃🔃")
    // const navigate = useNavigate();


    const {
        id,
        name,
        description,
        status,
        temperature,
        humidity,
        aqi,
        totalDevices,
        activeDevices,
        inactiveDevices,
        icon } = data

    const cfg = STATUS_CONFIG[status];
    const handleb = () => {
        console.log("From Facility Card...",)
        onViewDetails(id);

    }
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: `1.5px solid rgba(244, 244, 244, 1)`,
                paddingBottom: 0,

                transition: "box-shadow 0.25s ease, transform 0.2s ease",
                "&:hover": {
                    // boxShadow: `0 8px 36px ${cfg.glowColor}, 0 2px 8px rgba(0,0,0,0.08)`,
                    transform: "translateY(-2px)",
                },
                overflow: "hidden",
                position: "relative",
            }}
        >

            <CardContent sx={{
                p: 0,
                "&:last-child": {
                    pb: 0,
                },
            }}>

                <Box sx={{
                    background: cfg?.cardBg,
                    px: 2,
                    pt: 1,
                    overflow: "hidden"
                }}>
                    {/* Header */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 1.5,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {/* {icon && (
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        bgcolor: "rgba(255,255,255,0.8)",
                                        border: "1px solid rgba(255,255,255,0.95)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
                                        fontSize: 20,
                                        flexShrink: 0,
                                    }}
                                >
                                    {icon}
                                </Box>
                            )} */}
                            <RoomPreferencesOutlined sx={{ color: "#1a1a2e" }} />
                            <Box>
                                <Typography
                                    sx={{ lineHeight: 1.25, fontSize: "12px", fontWeight: 600, color: "#1a1a2e" }}
                                >
                                    {name}
                                </Typography>
                                <Typography
                                    sx={{ color: "#9ca3af", fontSize: "10.2px", lineHeight: 1.3 }}
                                >
                                    {description}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Status Chip */}
                        <Chip
                            label={cfg?.label}
                            size="small"
                            sx={{
                                bgcolor: cfg?.chipBg,
                                color: cfg?.chipColor,
                                fontWeight: 700,
                                fontSize: "0.5rem",
                                height: 22,
                                borderRadius: 1.5,
                                letterSpacing: 0.2,
                                boxShadow: `0 2px 6px ${cfg?.glowColor}`,
                                flexShrink: 0,
                            }}
                        />
                    </Box>

                    {/* Metrics Row */}
                    <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                        <MetricTile metric={temperature} type="temperature" />
                        <MetricTile metric={humidity} type="humidity" />
                        <MetricTile metric={aqi} type="aqi" />
                    </Box>

                </Box>

                <Divider sx={{ borderColor: "rgba(0,0,0,0.06)", paddingBottom: 0 }} />

                {/* Footer */}
                <Box
                    sx={{

                        paddingX: 1.2,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "white"
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, paddingBottom: 0 }}>
                        <Typography sx={{ color: "#6b7280", fontWeight: 600, fontSize: "0.6rem" }}>
                            {totalDevices} Devices
                        </Typography>
                        <Typography sx={{ color: "#22c55e", fontWeight: 700, fontSize: "0.6rem" }}>
                            {activeDevices} Active
                        </Typography>
                        <Typography sx={{ color: "#ef4444", fontWeight: 700, fontSize: "0.6rem" }}>
                            {inactiveDevices} InActive
                        </Typography>
                    </Box>

                    <Link

                        component="button"
                        // onClick={() => navigate("/view-detail/90")}
                        onClick={() => handleb()}
                        underline="none"
                        sx={{
                            padding: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.4,
                            color: "#5c5c5cff",

                            fontSize: "0.6rem",
                            cursor: "pointer",
                            "&:hover": { color: "#111827" },
                        }}
                    >
                        View Details <ArrowForward sx={{ fontSize: 12 }} />
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
};
