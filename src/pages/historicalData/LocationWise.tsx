import { useState } from "react";
import {
    Box,
    Typography,
    Chip,
    Button,
} from "@mui/material";
import {
    LocationOnOutlined,
    Thermostat,
} from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart";

const colors = ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4", "#14b8a6", "#6366f1"];

const LocationWise = ({ locationName, devices, historyData, isFetchingHistory }: any) => {
    // Dynamically extract all available metrics from historyData
    const availableMetrics: string[] = Array.from(
        new Set((historyData || []).map((r: any) => r.metric_key))
    ).filter(Boolean) as string[];

    const defaultMetrics = availableMetrics.length > 0 ? availableMetrics : ["Temperature", "Humidity"];

    // "pending" tracks chip clicks as the user makes them; "applied" is what
    // actually drives the chart, so the graph only redraws once Apply is
    // clicked rather than on every chip toggle. Both start empty - no metric
    // is pre-selected, so no chart renders until the user picks one and
    // clicks Apply.
    const [pendingMetrics, setPendingMetrics] = useState<string[]>([]);
    const [appliedMetrics, setAppliedMetrics] = useState<string[]>([]);

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

    const activeMetrics = appliedMetrics;

    // Filter database rows matching selected metrics
    const metricRows = (historyData || []).filter((r: any) =>
        activeMetrics.some((m: string) => m.toLowerCase() === r.metric_key?.toLowerCase())
    );

    if ((historyData || []).length === 0) {
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
                        No historical readings found in the database for the selected date range.
                    </Typography>
                </Box>
            </Box>
        );
    }

    // Toggle metric selection to support selecting multiple metrics simultaneously.
    // This only updates the pending (draft) selection - the chart itself doesn't
    // update until handleApplyMetrics runs.
    const handleMetricClick = (metricKey: string) => {
        if (pendingMetrics.includes(metricKey)) {
            setPendingMetrics(pendingMetrics.filter((m) => m !== metricKey));
        } else {
            setPendingMetrics([...pendingMetrics, metricKey]);
        }
    };

    const handleApplyMetrics = () => {
        setAppliedMetrics(pendingMetrics);
    };

    const hasPendingMetricChanges =
        pendingMetrics.length !== appliedMetrics.length ||
        pendingMetrics.some((m) => !appliedMetrics.includes(m));

    // Extract unique sorted timestamps by strict millisecond chronological order
    const uniqueTimeMs: number[] = Array.from(
        new Set<number>(
            metricRows
                .map((r: any) => new Date(r.time).getTime())
                .filter((t: number) => !isNaN(t))
        )
    ).sort((a: number, b: number) => a - b);

    // Map timestamps to X-axis labels
    const xAxisLabels = uniqueTimeMs.map((ms: number) => {
        const d = new Date(ms);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const hours = String(d.getHours()).padStart(2, "0");
        const mins = String(d.getMinutes()).padStart(2, "0");
        return `${day}/${month}\n${hours}:${mins}`;
    });

    // Group by unique device uids
    const deviceUids = Array.from(new Set((historyData || []).map((r: any) => r.device_uid)));

    const getDeviceLabel = (uid: string) => {
        const dev = devices?.find((d: any) => String(d.device_uid) === String(uid) || String(d.id) === String(uid));
        return dev?.name || uid;
    };

    // Build series data for combination of device + selected metric
    const seriesData: any[] = [];
    let colorIdx = 0;

    activeMetrics.forEach((metricKey) => {
        deviceUids.forEach((uid: any) => {
            const data = uniqueTimeMs.map((ms: number) => {
                const match = metricRows.find(
                    (r: any) =>
                        String(r.device_uid) === String(uid) &&
                        r.metric_key?.toLowerCase() === metricKey.toLowerCase() &&
                        new Date(r.time).getTime() === ms
                );
                return match && match.value != null ? Number(match.value) : null;
            });

            // Only add series if it contains non-null values
            if (data.some((v) => v !== null)) {
                const label = activeMetrics.length > 1
                    ? `${getDeviceLabel(uid)} (${metricKey})`
                    : getDeviceLabel(uid);

                seriesData.push({
                    data,
                    label,
                    color: colors[colorIdx % colors.length],
                    showMark: false,
                    // Each series is plotted against the combined timeline of
                    // every device/metric shown, but a given device+metric only
                    // has a value at the instants it actually reported - every
                    // other series' timestamps are null for it. connectNulls
                    // draws through those gaps instead of breaking the line.
                    connectNulls: true,
                    curve: "catmullRom" as const,
                });
                colorIdx++;
            }
        });
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
                {/* Metric Checkboxes / Clickable Options */}
                <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#374151", mb: 1 }}>
                        Select Metrics to Display:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                        {defaultMetrics.map((metricKey) => {
                            const isSelected = pendingMetrics.includes(metricKey);
                            return (
                                <Chip
                                    key={metricKey}
                                    label={metricKey}
                                    clickable
                                    onClick={() => handleMetricClick(metricKey)}
                                    color={isSelected ? "primary" : "default"}
                                    variant={isSelected ? "filled" : "outlined"}
                                    sx={{
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        borderRadius: "8px",
                                        backgroundColor: isSelected ? "#00A395" : "#f3f4f6",
                                        color: isSelected ? "#fff" : "#374151",
                                        "&:hover": {
                                            backgroundColor: isSelected ? "#007A70" : "#e5e7eb",
                                        },
                                    }}
                                />
                            );
                        })}
                        <Button
                            size="small"
                            variant="contained"
                            disabled={!hasPendingMetricChanges}
                            onClick={handleApplyMetrics}
                            sx={{
                                textTransform: "capitalize",
                                background: "#007A70",
                                borderRadius: "8px",
                                fontSize: "12px",
                                height: "26px",
                                ml: 1,
                                "&.Mui-disabled": {
                                    background: "#e5e7eb",
                                    color: "#9ca3af",
                                },
                            }}
                        >
                            Apply
                        </Button>
                    </Box>
                </Box>

                <Typography sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>
                    Metrics Trend Analysis{activeMetrics.length > 0 ? ` (${activeMetrics.join(", ")})` : ""}
                </Typography>

                {activeMetrics.length === 0 ? (
                    <Typography sx={{ p: 4, textAlign: "center", color: "#6b7280" }}>
                        Select one or more metrics above and click Apply to view the chart.
                    </Typography>
                ) : seriesData.length > 0 ? (
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
                                tickInterval: (_, index) => {
                                    const step = Math.max(1, Math.ceil(xAxisLabels.length / 10));
                                    return index % step === 0;
                                },
                                tickLabelStyle: { fontSize: 10, fill: "#9ca3af" },
                            },
                        ]}
                        sx={{
                            ".MuiLineElement-root": { strokeWidth: 2 },
                            ".MuiChartsAxis-line": { stroke: "#e5e7eb" },
                            ".MuiChartsGrid-line": { stroke: "#f3f4f6" },
                        }}
                        grid={{ horizontal: true }}
                        margin={{ left: 50, right: 20, top: 20, bottom: 60 }}
                        slotProps={{
                            legend: {
                                direction: "horizontal",
                                position: { vertical: "bottom", horizontal: "center" },
                            },
                        }}
                    />
                ) : (
                    <Typography sx={{ p: 4, textAlign: "center", color: "#6b7280" }}>
                        No metric data points match your current metric selection.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default LocationWise;
