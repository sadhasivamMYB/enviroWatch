import { Box, Button, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Menu } from "@mui/material";
import ParameterWise from "./ParameterWise";
import { useState, useEffect } from "react";
import { inputStyles } from "../../theme";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import LocationWise from "./LocationWise";
import PageTitle from "../../components/Pagetitle";
import Back from "../../components/Back";
import { useGetLocationsQuery } from "../../services/Api/location.api";
import { useGetDevicesQuery, useGetLocationIdDevicesQuery } from "../../services/Api/device.api";
import { useGetLocationHistoryQuery } from "../../services/Api/historical";

export const generateDeviceData = (deviceName: string, metric: string, pointsCount = 12) => {
    let hash = 0;
    for (let i = 0; i < deviceName.length; i++) {
        hash = deviceName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);
    const data = [];
    const isTemp = metric.toLowerCase().includes("temp");
    const base = isTemp ? 22 : 55;
    const range = isTemp ? 8 : 15;
    
    for (let i = 0; i < pointsCount; i++) {
        const wave = Math.sin((i + seed) * 0.5) * range;
        const noise = ((seed * (i + 1)) % 10) / 5 - 1;
        data.push(Math.round(base + wave + noise));
    }
    return data;
};

export const generateXAxisLabels = (fromStr: string, toStr: string) => {
    if (!fromStr || !toStr) return [];
    const fromDate = new Date(fromStr);
    const toDate = new Date(toStr);
    const diffTime = toDate.getTime() - fromDate.getTime();
    
    const labels = [];
    const pointsCount = 12;
    for (let i = 0; i < pointsCount; i++) {
        const currentMs = fromDate.getTime() + (diffTime * (i / (pointsCount - 1)));
        const currDate = new Date(currentMs);
        const dayPart = currDate.getDate();
        const monthPart = currDate.getMonth() + 1;
        const hours = String(currDate.getHours()).padStart(2, "0");
        const mins = String(currDate.getMinutes()).padStart(2, "0");
        labels.push(`${dayPart}/${monthPart}\n${hours}:${mins}`);
    }
    return labels;
};

const getLocalDateString = (d = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const Historical = () => {
    const [location, setLocation] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
    const [from, setFrom] = useState(getLocalDateString(new Date(Date.now() - 86400000))); // default to yesterday
    const [to, setTo] = useState(getLocalDateString()); // default to today
    const [parameter, setParameter] = useState("");
    const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
    const [mainTab, setMainTab] = useState(0);

    const { data: locations } = useGetLocationsQuery({});
    const { data: allDevices } = useGetDevicesQuery();
    const { data: device } = useGetLocationIdDevicesQuery({ location_id: location }, { skip: !location });

    const { data: locationHistoryData, isFetching: isFetchingHistory } = useGetLocationHistoryQuery(
        { location_id: location, from_date: from, to_date: to },
        { skip: !location || mainTab !== 0 }
    );

    const histRes1 = useGetLocationHistoryQuery({ location_id: selectedLocation[0], from_date: from, to_date: to }, { skip: selectedLocation.length < 1 || mainTab !== 1 });
    const histRes2 = useGetLocationHistoryQuery({ location_id: selectedLocation[1], from_date: from, to_date: to }, { skip: selectedLocation.length < 2 || mainTab !== 1 });
    const histRes3 = useGetLocationHistoryQuery({ location_id: selectedLocation[2], from_date: from, to_date: to }, { skip: selectedLocation.length < 3 || mainTab !== 1 });
    const histRes4 = useGetLocationHistoryQuery({ location_id: selectedLocation[3], from_date: from, to_date: to }, { skip: selectedLocation.length < 4 || mainTab !== 1 });

    const parameterHistoryData = [
        ...(histRes1.data || []),
        ...(histRes2.data || []),
        ...(histRes3.data || []),
        ...(histRes4.data || [])
    ];
    const isFetchingParamHistory = histRes1.isFetching || histRes2.isFetching || histRes3.isFetching || histRes4.isFetching;

    const LocationsData = locations?.locations;

    const getOffsetDate = (dateStr: string, offsetDays: number) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        date.setDate(date.getDate() + offsetDays);
        return date.toISOString().split("T")[0];
    };

    const handleFromChange = (newFrom: string) => {
        setFrom(newFrom);
        if (newFrom) {
            const fromDate = new Date(newFrom);
            const toDate = new Date(to);
            const diffTime = toDate.getTime() - fromDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < 0 || diffDays > 2) {
                setTo(getOffsetDate(newFrom, 2));
            }
        }
    };

    const handleToChange = (newTo: string) => {
        setTo(newTo);
        if (newTo) {
            const toDate = new Date(newTo);
            const fromDate = new Date(from);
            const diffTime = toDate.getTime() - fromDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < 0 || diffDays > 2) {
                setFrom(getOffsetDate(newTo, -2));
            }
        }
    };

    const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setExportAnchorEl(event.currentTarget);
    };

    const handleExportClose = () => {
        setExportAnchorEl(null);
    };

    const handleExport = (type: "excel" | "pdf") => {
        handleExportClose();
        let headers = "";
        let rows: string[] = [];

        if (mainTab === 0) {
            if (!location) {
                alert("Please select a location before exporting.");
                return;
            }
            headers = "Timestamp,Location,Device,Metric,Value\n";

            const records = locationHistoryData || [];
            records.forEach((rec: any) => {
                const dev = device?.devices?.find((d: any) => String(d.device_uid) === String(rec.device_uid) || String(d.id) === String(rec.device_uid));
                const devName = dev?.name || rec.device_uid;
                
                const timeStr = rec.time ? rec.time.replace("T", " ") : "";
                rows.push(`"${timeStr}","${rec.location_name}","${devName}","${rec.metric_key}",${rec.value}`);
            });
        } else {
            if (selectedLocation.length === 0 || !parameter) {
                alert("Please select locations and a parameter before exporting.");
                return;
            }
            headers = "Timestamp,Location,Device,Parameter,Value\n";

            const records = parameterHistoryData || [];
            records.forEach((rec: any) => {
                const devicesList = Array.isArray(allDevices) ? allDevices : (allDevices?.devices || []);
                const dev = devicesList.find((d: any) => String(d.device_uid) === String(rec.device_uid) || String(d.id) === String(rec.device_uid));
                const devName = dev?.name || rec.device_uid;
                
                const timeStr = rec.time ? rec.time.replace("T", " ") : "";
                rows.push(`"${timeStr}","${rec.location_name}","${devName}","${rec.metric_key}",${rec.value}`);
            });
        }

        const content = headers + rows.join("\n");

        if (type === "excel") {
            const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `historical_data_${from}_to_${to}.csv`);
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
                        </tr>
                    `;
                }).join("");

                const titleText = mainTab === 0 
                    ? `Location-Wise Report - ${LocationsData?.find((l: any) => String(l.id) === String(location))?.name || location}` 
                    : `Parameter-Wise Comparison - ${parameter}`;

                printWindow.document.write(`
                    <html>
                        <head>
                            <title>EnviroWatch Historical Report</title>
                            <style>
                                body {
                                    font-family: 'Inter', system-ui, sans-serif;
                                    color: #111827;
                                    padding: 40px;
                                    margin: 0;
                                }
                                .header {
                                    border-bottom: 2px solid #007A70;
                                    padding-bottom: 20px;
                                    margin-bottom: 30px;
                                }
                                .logo {
                                    font-size: 24px;
                                    font-weight: 700;
                                    color: #007A70;
                                    margin-bottom: 10px;
                                }
                                .title {
                                    font-size: 20px;
                                    font-weight: 600;
                                    color: #374151;
                                    margin-bottom: 5px;
                                }
                                .meta {
                                    font-size: 13px;
                                    color: #6b7280;
                                }
                                table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin-top: 20px;
                                }
                                th {
                                    background-color: #f3f4f6;
                                    color: #374151;
                                    font-weight: 600;
                                    text-align: left;
                                    font-size: 12px;
                                    padding: 12px 16px;
                                    border-bottom: 1px solid #e5e7eb;
                                }
                                td {
                                    padding: 12px 16px;
                                    font-size: 13px;
                                    border-bottom: 1px solid #f3f4f6;
                                    color: #4b5563;
                                }
                                tr:nth-child(even) td {
                                    background-color: #fafafa;
                                }
                                @media print {
                                    body {
                                        padding: 20px;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            <div class="header">
                                <div class="logo">EnviroWatch</div>
                                <div class="title">${titleText}</div>
                                <div class="meta">
                                    <strong>Date Range:</strong> ${from} to ${to} &nbsp;|&nbsp; 
                                    <strong>Exported on:</strong> ${new Date().toLocaleDateString()}
                                </div>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>Location</th>
                                        <th>Device</th>
                                        <th>${mainTab === 0 ? "Metric" : "Parameter"}</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tableRowsHtml}
                                </tbody>
                            </table>
                            <script>
                                window.onload = function() {
                                    window.print();
                                };
                            </script>
                        </body>
                    </html>
                `);
                printWindow.document.close();
            }
        }
    };

    const renderFilterBar = (mode: "location" | "parameter") => {
        return (
            <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
                <Box sx={{ display: "flex", gap: 1.2, flexWrap: "wrap", alignItems: "center" }}>
                    {mode === "location" ? (
                        <FormControl sx={{ ...inputStyles, minWidth: 180 }}>
                            <InputLabel>Location</InputLabel>
                            <Select sx={inputStyles} value={location} label="Location" onChange={(e: any) => setLocation(e.target.value)}>
                                {LocationsData?.map((item: any) => (
                                    <MenuItem sx={{ fontSize: "13px" }} key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <>
                            <FormControl sx={{ ...inputStyles, minWidth: 180 }}>
                                <InputLabel>Location</InputLabel>
                                <Select
                                    multiple
                                    value={selectedLocation}
                                    label="Location"
                                    sx={inputStyles}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (typeof val === "string") {
                                            setSelectedLocation(val.split(","));
                                        } else if (val.length <= 4) {
                                            setSelectedLocation(val);
                                        }
                                    }}
                                    renderValue={(selected) => `${selected.length} selected`}
                                >
                                    {LocationsData?.map((item: any) => (
                                        <MenuItem
                                            sx={{ fontSize: "13px" }}
                                            key={item.id}
                                            value={item.id}
                                            disabled={selectedLocation.length >= 4 && !selectedLocation.includes(item.id)}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl sx={{ ...inputStyles, minWidth: 180 }}>
                                <InputLabel>Parameter</InputLabel>
                                <Select sx={inputStyles} value={parameter} label="Parameter" onChange={(e: any) => setParameter(e.target.value)}>
                                    <MenuItem sx={{ fontSize: "13px" }} value="Temperature">Temperature</MenuItem>
                                    <MenuItem sx={{ fontSize: "13px" }} value="Humidity">Humidity</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}

                    <TextField
                        type="date"
                        label="From"
                        value={from}
                        onChange={(e) => handleFromChange(e.target.value)}
                        sx={{ ...inputStyles, minWidth: 160 }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ max: to }}
                    />
                    <TextField
                        type="date"
                        label="To"
                        value={to}
                        onChange={(e) => handleToChange(e.target.value)}
                        sx={{ ...inputStyles, minWidth: 160 }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            min: from,
                            max: getOffsetDate(from, 2)
                        }}
                    />
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
        );
    };



    const activeLocationName = LocationsData?.find((l: any) => String(l.id) === String(location))?.name || "";
    const activeLocationDevices = device?.devices || [];

    return (
        <Box>
            <PageTitle title="Historical Data & Trends" />
            <Back title={"Back to dashboard"} path={"/"} />

            <Box sx={{ display: "flex" }}>
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                    <Box
                        sx={{
                            mb: "16px",
                            width: "26%",
                            background: "white",
                            border: "1px solid rgba(11, 11, 15, 0.06)",
                            borderRadius: "10px",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "flex-start",
                            boxSizing: "border-box"
                        }}
                    >
                        <Tabs
                            value={mainTab}
                            onChange={(_, v) => {
                                setMainTab(v);
                            }}
                            sx={{
                                padding: 1,
                                "& .MuiTabs-indicator": {
                                    display: "none",
                                },
                            }}
                        >
                            <Tab
                                label="Location Wise"
                                sx={{
                                    padding: 0.8,
                                    borderRadius: "10px",
                                    color: "black",
                                    textTransform: "none",
                                    "&.Mui-selected": {
                                        background: "#e6fbf8",
                                        color: "#00A395",
                                        fontWeight: 500,
                                    },
                                }}
                            />
                            <Tab
                                label="Parameter Wise"
                                sx={{
                                    padding: 1,
                                    borderRadius: "10px",
                                    color: "black",
                                    textTransform: "none",
                                    "&.Mui-selected": {
                                        background: "#e6fbf8",
                                        color: "#00a395",
                                        fontWeight: 500,
                                    },
                                }}
                            />
                        </Tabs>
                    </Box>

                    <Box sx={{ border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", boxSizing: "border-box", padding: "16px" }}>
                        {renderFilterBar(mainTab === 0 ? "location" : "parameter")}
                    </Box>

                    {mainTab === 0 ? (
                        <LocationWise 
                            locationName={activeLocationName} 
                            devices={activeLocationDevices}
                            from={from}
                            to={to}
                            historyData={locationHistoryData || []}
                            isFetchingHistory={isFetchingHistory}
                        />
                    ) : (
                        <ParameterWise 
                            selectedLocations={selectedLocation}
                            parameter={parameter}
                            locationsData={LocationsData}
                            allDevices={allDevices}
                            from={from}
                            to={to}
                            historyData={parameterHistoryData}
                            isFetchingHistory={isFetchingParamHistory}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Historical;