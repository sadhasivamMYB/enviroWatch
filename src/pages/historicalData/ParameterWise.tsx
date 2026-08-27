import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";

const ParameterWise = ({ selectedLocations, parameter, locationsData, allDevices, from, to, historyData, isFetchingHistory }: any) => {
    
    if (!selectedLocations || selectedLocations.length === 0 || !parameter) {
        return (
            <Box sx={{ border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", p: 6, mt: "16px", textAlign: "center", backgroundColor: "#fff" }}>
                <Typography variant="body1" sx={{ color: "#6b7280", fontWeight: 500 }}>
                    Please select location(s) and a parameter to view comparison trends.
                </Typography>
            </Box>
        );
    }

    if (isFetchingHistory) {
        return (
            <Box sx={{ border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", p: 6, mt: "16px", textAlign: "center", backgroundColor: "#fff" }}>
                <Typography variant="body1" sx={{ color: "#6b7280", fontWeight: 500 }}>
                    Loading comparison historical data from database...
                </Typography>
            </Box>
        );
    }

    // Filter database rows matching selected metric key
    const metricRows = (historyData || []).filter((r: any) => 
        r.metric_key?.toLowerCase() === parameter.toLowerCase()
    );

    if (metricRows.length === 0) {
        return (
            <Box sx={{ border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", p: 6, mt: "16px", textAlign: "center", backgroundColor: "#fff" }}>
                <Typography variant="body1" sx={{ color: "#6b7280", fontWeight: 500 }}>
                    No historical {parameter} readings found in the database for the selected location(s) and date range.
                </Typography>
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
        const devicesList = Array.isArray(allDevices) ? allDevices : (allDevices?.devices || []);
        const dev = devicesList.find((d: any) => String(d.device_uid) === String(uid) || String(d.id) === String(uid));
        return dev?.name || uid;
    };

    const colors = ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4"];

    const seriesData = deviceUids.map((uid: any, idx: number) => {
        const firstRow = metricRows.find((r: any) => String(r.device_uid) === String(uid));
        const locName = firstRow?.location_name || "";
        const devName = getDeviceLabel(uid);

        const data = uniqueTimes.map((t: any) => {
            const match = metricRows.find((r: any) => String(r.device_uid) === String(uid) && r.time === t);
            return match ? Number(match.value) : null;
        });

        return {
            data,
            label: locName ? `${locName} - ${devName}` : devName,
            color: colors[idx % colors.length],
            showMark: true,
            curve: "catmullRom",
        };
    });

    return (
        <Box sx={{ border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", padding: 2, mt: "16px", backgroundColor: "#fff" }}>
            <Typography sx={{ fontSize: "16px", fontWeight: 500, mb: 2 }}>{parameter} Comparison</Typography>
            
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
                        label: "Days",
                        tickLabelStyle: { fontSize: 10, fill: "#9ca3af" },
                    },
                ]}
                yAxis={[
                    {
                        min: 0,
                        max: parameter === "Temperature" ? 50 : 100,
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
        </Box>
    );
};

export default ParameterWise;
