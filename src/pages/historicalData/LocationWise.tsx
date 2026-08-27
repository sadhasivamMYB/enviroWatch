import { useState } from "react";
import {
    Box,
    Tab,
    Tabs,
    Typography,
    Chip,
} from "@mui/material";
import {
    LocationOnOutlined,
    Thermostat,
} from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart";

const LocationWise = ({ locationName, devices, from, to, historyData, isFetchingHistory }: any) => {
    const [metric, setMetric] = useState(0); // 0=Temperature, 1=Humidity

    if (!locationName) {
        return (
            <Box sx={{ border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", p: 6, mt: "16px", textAlign: "center", backgroundColor: "#fff" }}>
                <Typography variant="body1" sx={{ color: "#6b7280", fontWeight: 500 }}>
                    Please select a location to view historical trends.
                </Typography>
            </Box>
        );
    }

    if (isFetchingHistory) {
        return (
            <Box sx={{ border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", p: 6, mt: "16px", textAlign: "center", backgroundColor: "#fff" }}>
                <Typography variant="body1" sx={{ color: "#6b7280", fontWeight: 500 }}>
                    Loading historical data from database...
                </Typography>
            </Box>
        );
    }

    const metricName = metric === 0 ? "Temperature" : "Humidity";
    
    // Filter database rows matching current metric
    const metricRows = (historyData || []).filter((r: any) => 
        r.metric_key?.toLowerCase() === metricName.toLowerCase()
    );

    if (metricRows.length === 0) {
        return (
            <Box sx={{ display: "flex", gap: "16px", flexDirection: "column", mt: "16px" }}>
                <Box sx={{ display: "flex", p: 2, border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", alignItems: "center", gap: 1.5, backgroundColor: "#fff" }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: "#e6fdfa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Thermostat sx={{ color: "#00A395", fontSize: 22 }} />
                    </Box>
                    <Typography sx={{ fontWeight: 500, fontSize: "16px" }}>
                        {locationName} Devices
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", padding: "4px 8px", borderRadius: 1.5, border: "1px solid rgba(11, 11, 15, 0.06)", gap: 0.5, ml: 0.5 }}>
                        <LocationOnOutlined sx={{ fontSize: 12, color: "#494949ff" }} />
                        <Typography sx={{ fontSize: "12px", color: "#494949ff" }}>
                            {locationName}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", p: 6, textAlign: "center", backgroundColor: "#fff" }}>
                    <Typography variant="body1" sx={{ color: "#6b7280", fontWeight: 500 }}>
                        No historical {metricName} readings found in the database for the selected date range.
                    </Typography>
                </Box>
            </Box>
        );
    }

    // Extract unique sorted timestamps
    const uniqueTimes = Array.from(new Set(metricRows.map((r: any) => r.time))).sort();

    // Map timestamps to X-axis labels
    const xAxisLabels = uniqueTimes.map((t: any) => {
        const d = new Date(t);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const hours = String(d.getHours()).padStart(2, "0");
        const mins = String(d.getMinutes()).padStart(2, "0");
        return `${day}/${month}\n${hours}:${mins}`;
    });

    // Group by unique device uids
    const deviceUids = Array.from(new Set(metricRows.map((r: any) => r.device_uid)));

    const getDeviceLabel = (uid: string) => {
        const dev = devices?.find((d: any) => String(d.device_uid) === String(uid) || String(d.id) === String(uid));
        return dev?.name || uid;
    };

    // Nice color palette for multiple devices
    const colors = ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4"];

    const seriesData = deviceUids.map((uid: any, idx: number) => {
        const data = uniqueTimes.map((t: any) => {
            const match = metricRows.find((r: any) => String(r.device_uid) === String(uid) && r.time === t);
            return match ? Number(match.value) : null;
        });

        return {
            data,
            label: getDeviceLabel(uid),
            color: colors[idx % colors.length],
            showMark: true,
            curve: "catmullRom",
        };
    });

    return (
        <Box sx={{ display: "flex", gap: "16px", flexDirection: "column", mt: "16px" }}>
            {/* Device list header */}
            <Box sx={{ display: "flex", p: 2, flexWrap: "wrap", border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", alignItems: "center", gap: 1.5, backgroundColor: "#fff" }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                        bgcolor: "#e6fdfa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Thermostat sx={{ color: "#00A395", fontSize: 22 }} />
                </Box>
                <Typography sx={{ fontWeight: 500, fontSize: "16px", mr: 2 }}>
                    Active Devices ({deviceUids.length})
                </Typography>
                
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", flex: 1 }}>
                    {deviceUids.map((uid: any, i: number) => (
                        <Chip
                            key={uid}
                            label={getDeviceLabel(uid)}
                            size="small"
                            sx={{
                                border: `1px solid ${colors[i % colors.length]}`,
                                bgcolor: "transparent",
                                color: "#374151",
                                fontWeight: 500,
                                fontSize: 11,
                                height: 24,
                            }}
                        />
                    ))}
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", padding: "4px 8px", borderRadius: 1.5, border: "1px solid rgba(11, 11, 15, 0.06)", gap: 0.5 }}>
                    <LocationOnOutlined sx={{ fontSize: 12, color: "#494949ff" }} />
                    <Typography sx={{ fontSize: "12px", color: "#494949ff" }}>
                        {locationName}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", padding: 2, backgroundColor: "#fff" }}>
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
                    {metricName} Data
                </Typography>

                <LineChart
                    height={400}
                    style={{
                        padding: 0,
                        width: "100%"
                    }}
                    series={seriesData}
                    xAxis={[
                        {
                            data: xAxisLabels,
                            scaleType: "point",
                            tickLabelStyle: { fontSize: 10, fill: "#9ca3af" },
                        },
                    ]}
                    yAxis={[
                        {
                            min: 0,
                            max: metric === 0 ? 50 : 100,
                            tickLabelStyle: { fontSize: 10, fill: "#9ca3af" },
                        },
                    ]}
                    sx={{
                        ".MuiLineElement-root": { strokeWidth: 2 },
                        ".MuiChartsAxis-line": { stroke: "#e5e7eb" },
                        ".MuiChartsGrid-line": { stroke: "#f3f4f6" },
                    }}
                    grid={{ horizontal: true }}
                    margin={{ left: 50, right: 20, top: 20, bottom: 40 }}
                />
            </Box>
        </Box>
    );
};

export default LocationWise;
