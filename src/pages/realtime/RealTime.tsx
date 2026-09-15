import RealtimeStatCard from "./RealtimeStatCard";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Menu,
    MenuItem
} from "@mui/material";
import { useState } from "react";
import { FacilityCard } from "./FacilityCard";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/Pagetitle";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { useGetDashboardQuery } from "../../services/Api/dashboard.api";


const FILTERS = ["all", "normal", "alert"];
const Realtime = () => {
    const [filter, setFilter] = useState<string>("all");
    const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const { data: dashboardData, isLoading: dashboardLoading } = useGetDashboardQuery()

    console.log(dashboardData, "dashboardData")

    const next_Pg = (e: any) => {
        // console.log(e, "Next page URL")
        navigate(`/view-detail/${e}`)
    }

    const locationData = dashboardData?.locations || []
    const filteredCards =
        filter === "all"
            ? locationData || []
            : locationData?.filter((c: any) => c.is_active === filter);

    const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setExportAnchorEl(event.currentTarget);
    };

    const handleExportClose = () => {
        setExportAnchorEl(null);
    };

    const handleExport = (type: "excel" | "pdf") => {
        handleExportClose();
        let headers = "Location,Status,Total Devices,Active Devices,Inactive Devices,Temperature,Humidity,AQI\n";
        let rows: string[] = [];

        const records = filteredCards || [];
        records.forEach((rec: any) => {
            // Compute devices locally
            const devicesList = rec.devices || [];
            const totalDevices = devicesList.length;
            const activeDevices = devicesList.filter((d: any) => d.status === "online").length;
            const inactiveDevices = totalDevices - activeDevices;

            const tempValue = devicesList.find((e: any) => e.device_type == "temperature");
            const temperature = tempValue?.metrics?.find((e: any) => e.metric_key == "temperature")?.latest_value;
            
            const allMetrics = devicesList.flatMap((d: any) => d?.metrics) || [];
            const humidity = allMetrics.find((e: any) => e.metric_key == "humidity")?.latest_value;
            const aqi = allMetrics.find((e: any) => e.metric_key == "aqi")?.latest_value;

            const dispTemp = (temperature !== undefined && temperature !== null) ? temperature : 'N/A';
            const dispHumid = (humidity !== undefined && humidity !== null) ? humidity : 'N/A';
            const dispAqi = (aqi !== undefined && aqi !== null) ? aqi : 'N/A';

            rows.push(`"${rec.location_name || ''}","${rec.status || 'normal'}","${totalDevices}","${activeDevices}","${inactiveDevices}","${dispTemp}","${dispHumid}","${dispAqi}"`);
        });

        const content = headers + rows.join("\n");

        if (type === "excel") {
            const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `realtime_monitoring.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            const printWindow = window.open("", "_blank");
            if (printWindow) {
                const tableRowsHtml = rows.map(row => {
                    const columns = row.split(",").map(col => col.replace(/^"|"$/g, ""));
                    return `
                        <tr>
                            <td>${columns[0]}</td>
                            <td>${columns[1]}</td>
                            <td>${columns[2]}</td>
                            <td>${columns[3]}</td>
                            <td>${columns[4]}</td>
                            <td>${columns[5]}</td>
                            <td>${columns[6]}</td>
                            <td>${columns[7]}</td>
                        </tr>
                    `;
                }).join("");

                printWindow.document.write(`
                    <html>
                        <head>
                            <title>EnviroWatch Realtime Report</title>
                            <style>
                                body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #111827; }
                                .header { border-bottom: 2px solid #007A70; padding-bottom: 20px; margin-bottom: 30px; }
                                .title { font-size: 20px; font-weight: 600; color: #374151; margin-bottom: 5px; }
                                .meta { font-size: 13px; color: #6b7280; }
                                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                th, td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; text-align: left; font-size: 13px; }
                                th { background-color: #f3f4f6; font-weight: 600; font-size: 12px; }
                                tr:nth-child(even) td { background-color: #fafafa; }
                            </style>
                        </head>
                        <body>
                            <div class="header">
                                <div class="title">Realtime Monitoring Report</div>
                                <div class="meta"><strong>Exported on:</strong> ${new Date().toLocaleDateString()}</div>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Total Devices</th>
                                        <th>Active Devices</th>
                                        <th>Inactive Devices</th>
                                        <th>Temperature</th>
                                        <th>Humidity</th>
                                        <th>AQI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tableRowsHtml}
                                </tbody>
                            </table>
                            <script>
                                window.onload = function() { window.print(); };
                            </script>
                        </body>
                    </html>
                `);
                printWindow.document.close();
            }
        }
    };

    return (
        <Box sx={{ bgcolor: "#fff", borderRadius: "20px" }}>
            <PageTitle title="Realtime Monitoring" />


            {/* Stats */}
            <Box sx={{ display: "flex", gap: 2, my: 3 }}>
                <RealtimeStatCard count={dashboardData?.summary?.total_locations || 0} label="Total Location" />
                <RealtimeStatCard count={dashboardData?.summary?.active_alerts || 0} label="Active Alerts" />
                <RealtimeStatCard count={(dashboardData?.summary?.total_locations - dashboardData?.summary?.active_alerts) || 0} label="All Normal" />
            </Box>

            {/* Filter + Export */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                }}
            >
                {/* Filter Buttons */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: "10px",
                        p: 0.5,
                    }}
                >
                    {FILTERS.map((item) => {
                        const isActive = filter === item;

                        return (
                            <Box
                                key={item}
                                onClick={() => setFilter(item)}
                                sx={{
                                    px: 2,
                                    py: 0.8,
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    textTransform: "capitalize",


                                    bgcolor: isActive ? "#e6fbf8" : "transparent",
                                    color: isActive ? "#00a395" : "#555",
                                    transition: "0.2s",
                                    "&:hover": {
                                        bgcolor: isActive ? "transparent" : "#f5f5f5",
                                    },


                                }}
                            >
                                {item === "all" ? "All Location" : item}
                            </Box>
                        );
                    })}
                </Box>

                <Button
                    variant="contained"
                    onClick={handleExportClick}
                    sx={{
                        textTransform: "capitalize",
                        background: "#007A70",
                        borderRadius: "12px",
                        fontSize: "12px",
                        height: "32px"
                    }}
                    startIcon={<FileDownloadOutlinedIcon sx={{ height: "16px" }} />}
                    endIcon={<KeyboardArrowDownOutlined sx={{ height: "16px" }} />}
                >
                    Export
                </Button>
                <Menu
                    anchorEl={exportAnchorEl}
                    open={Boolean(exportAnchorEl)}
                    onClose={handleExportClose}
                >
                    <MenuItem sx={{ fontSize: "13px" }} onClick={() => handleExport("excel")}>Export as Excel (CSV)</MenuItem>
                    <MenuItem sx={{ fontSize: "13px" }} onClick={() => handleExport("pdf")}>Export as PDF</MenuItem>
                </Menu>

            </Box>

            {/* Cards */}

            {
                dashboardLoading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
                    <CircularProgress size={32} sx={{ color: "#0d9488" }} />
                </Box> : (
                    <Grid container spacing={2.5} sx={{ mt: 2 }}>
                        {filteredCards?.map((card: any, i: number) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                                <FacilityCard data={card} status={locationData?.active_alerts} onViewDetails={next_Pg} />
                            </Grid>
                        ))}
                    </Grid>
                )
            }
        </Box>
    );
};

export default Realtime;