import { useState } from "react";
import {
    Box,
    Tab,
    Tabs,
    Typography,
    Chip,
} from "@mui/material";
// import { createTheme } from "@mui/material/styles";
import {
    LocationOnOutlined,
    Thermostat,
} from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart";

// ─── Theme ────────────────────────────────────────────────────────────────────
// const theme = createTheme({
//     palette: {
//         mode: "light",
//         primary: { main: "#0d9488" },   // teal-600
//         background: { default: "#f0faf9", paper: "#ffffff" },
//         text: { primary: "#134e4a", secondary: "#5eead4" },
//     },
//     typography: {
//         fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
//         h5: { fontWeight: 700, color: "#134e4a" },
//     },
//     components: {
//         MuiTab: {
//             styleOverrides: {
//                 root: {
//                     textTransform: "none",
//                     fontWeight: 500,
//                     fontSize: 14,
//                     color: "#6b7280",
//                     "&.Mui-selected": { color: "#0d9488", fontWeight: 700 },
//                 },
//             },
//         },
//         MuiTabs: {
//             styleOverrides: {
//                 indicator: { backgroundColor: "#0d9488", height: 2.5, borderRadius: 2 },
//             },
//         },
//         MuiSelect: {
//             styleOverrides: {
//                 root: { borderRadius: 10, background: "#fff" },
//             },
//         },
//         MuiOutlinedInput: {
//             styleOverrides: {
//                 root: {
//                     borderRadius: 10,
//                     "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0d9488" },
//                     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#0d9488",
//                     },
//                 },
//             },
//         },
//         MuiButton: {
//             styleOverrides: {
//                 root: { textTransform: "none", borderRadius: 10, fontWeight: 600 },
//             },
//         },
//         MuiPaper: {
//             styleOverrides: {
//                 root: { borderRadius: 16 },
//             },
//         },
//     },
// });

// ─── Mock data ─────────────────────────────────────────────────────────────────
const day = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    const format = `${String(date.getDate())}/${String(date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth())} \n ${((i + 1) * 2) + ":00"} `
    return format


});

// ─── Device Card (Location Wise) ───────────────────────────────────────────────
const LocationWise = ({ tempData, humidityData }: any) => {
    const [metric, setMetric] = useState(0); // 0=Temperature, 1=Humidity

    const chartData = metric === 0 ? tempData : humidityData;
    const label = metric === 0 ? "Temperature (°C)" : "Humidity (%)";
    const color = metric === 0 ? "#ef4444" : "#3b82f6";

    return (
        <Box sx={{ display: "flex", gap: "16px", flexDirection: "column", mt: "16px" }}>
            {/* Device header */}
            <Box sx={{ display: "flex", p: 2, justifyContent: "space-between", border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", alignItems: "center", gap: 1.5, }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,

                        borderRadius: 2.5,
                        bgcolor: "#e6fdfa",
                        border: "1px solid transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Thermostat sx={{ color: "#00A395", fontSize: 22 }} />
                </Box>
                <Typography sx={{ fontWeight: 500, fontSize: "16px" }}>
                    TempSense Pro 3000
                </Typography>
                <Chip
                    label="Active"
                    size="small"
                    sx={{
                        bgcolor: "#e6f6e6",
                        color: "#027700",
                        fontWeight: 700,
                        fontSize: 11,
                        height: 22,
                        borderRadius: 1.5,
                    }}
                />
                <Box sx={{ display: "flex", alignItems: "center", padding: "4px 8px", borderRadius: 1.5, border: "1px solid rgba(11, 11, 15, 0.06)", gap: 0.5, ml: 0.5 }}>
                    <LocationOnOutlined sx={{ fontSize: 12, color: "#494949ff" }} />
                    <Typography sx={{ fontSize: "12px", color: "#494949ff" }}>
                        Warehouse A
                    </Typography>
                </Box>
                <Box sx={{ flex: 1 }} />
                <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
                    Last updated: 2 min ago
                </Typography>
            </Box>


            <Box sx={{ border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", padding: 2 }}>
                {/* Metric tabs */}
                <Tabs
                    value={metric}
                    onChange={(_, v) => setMetric(v)}
                    sx={{

                        mb: "16px",

                        "& .MuiTabs-indicator": {
                            display: "none",
                        },
                    }}
                >
                    <Tab
                        label="Temperature"
                        sx={{
                            fontSize: 12,
                            fontWeight: 500,

                            borderRadius: "10px",
                            color: "black",
                            textTransform: "none",

                            "&.Mui-selected": {
                                background: "#e6fbf8",
                                color: "#00a395",

                            },
                        }}
                    />

                    <Tab
                        label="Humidity"
                        sx={{
                            fontSize: 12,
                            fontWeight: 500,

                            borderRadius: "10px",
                            color: "black",
                            textTransform: "none",

                            "&.Mui-selected": {
                                background: "#e6fbf8",
                                color: "#00a395",


                            },
                        }}
                    />
                </Tabs>

                <Typography sx={{ fontSize: "16px", fontWeight: 500, textTransform: "capitalize" }}>
                    {label.split(" ")[0]} Data
                </Typography>



                <LineChart
                    height={500}

                    style={{
                        padding: 0,
                        width: "100%"

                    }}
                    series={[
                        {
                            data: chartData,
                            label,
                            color,
                            showMark: false,
                            curve: "catmullRom",
                        },
                    ]}
                    xAxis={[
                        {
                            data: day,
                            scaleType: "point",
                            tickLabelStyle: { fontSize: 10, fill: "#9ca3af" },
                        },
                    ]}
                    yAxis={[
                        {
                            min: 0,
                            max: metric === 0 ? 1000 : 100,
                            tickLabelStyle: { fontSize: 10, fill: "#9ca3af" },
                        },
                    ]}
                    sx={{
                        ".MuiLineElement-root": { strokeWidth: 2 },
                        ".MuiChartsAxis-line": { stroke: "#e5e7eb" },
                        ".MuiChartsGrid-line": { stroke: "#f3f4f6" },
                    }}
                    grid={{ horizontal: true }}
                    margin={{ left: 50, right: 20, top: 10, bottom: 30 }}
                />
            </Box>
        </Box>
    );
}

export default LocationWise;
