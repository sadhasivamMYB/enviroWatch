import { Box, Button, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Menu, Chip } from "@mui/material";
import * as XLSX from "xlsx";
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

const getLocalDateString = (d = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

type PresetOption = "1D" | "1W" | "1M" | "1Y" | "Custom";

const Historical = () => {
    const [location, setLocation] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
    
    // Preset state: default to 1D
    const [preset, setPreset] = useState<PresetOption>("1D");
    const [from, setFrom] = useState(getLocalDateString(new Date(Date.now() - 86400000)));
    const [to, setTo] = useState(getLocalDateString());
    
    const [parameter, setParameter] = useState("Temperature");
    const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
    const [mainTab, setMainTab] = useState(0);

    const { data: locations } = useGetLocationsQuery({});
    const { data: allDevices } = useGetDevicesQuery();
    const { data: device } = useGetLocationIdDevicesQuery({ location_id: location }, { skip: !location });

    // Auto-select first location when locations load
    useEffect(() => {
        if (locations?.locations?.length && !location) {
            setLocation(locations.locations[0].id);
        }
    }, [locations]);

    // Calculate aggregation interval based on preset & custom range
    const getInterval = () => {
        if (preset === "1D" || preset === "1W") return "raw";
        if (preset === "1M") return "1 hour";
        if (preset === "1Y") return "1 day";
        
        // Custom range aggregation logic:
        if (!from || !to) return "raw";
        const d1 = new Date(from);
        const d2 = new Date(to);
        const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
        if (diffDays <= 7) return "raw";
        if (diffDays <= 60) return "1 hour";
        return "1 day";
    };

    const currentInterval = getInterval();

    // Trigger API queries with current interval
    const { data: locationHistoryData, isFetching: isFetchingHistory } = useGetLocationHistoryQuery(
        { location_id: location, from_date: from, to_date: to, interval: currentInterval },
        { skip: !location || mainTab !== 0 }
    );

    const histRes1 = useGetLocationHistoryQuery({ location_id: selectedLocation[0], from_date: from, to_date: to, interval: currentInterval }, { skip: selectedLocation.length < 1 || mainTab !== 1 });
    const histRes2 = useGetLocationHistoryQuery({ location_id: selectedLocation[1], from_date: from, to_date: to, interval: currentInterval }, { skip: selectedLocation.length < 2 || mainTab !== 1 });
    const histRes3 = useGetLocationHistoryQuery({ location_id: selectedLocation[2], from_date: from, to_date: to, interval: currentInterval }, { skip: selectedLocation.length < 3 || mainTab !== 1 });
    const histRes4 = useGetLocationHistoryQuery({ location_id: selectedLocation[3], from_date: from, to_date: to, interval: currentInterval }, { skip: selectedLocation.length < 4 || mainTab !== 1 });

    const parameterHistoryData = [
        ...(histRes1.data || []),
        ...(histRes2.data || []),
        ...(histRes3.data || []),
        ...(histRes4.data || [])
    ];
    const isFetchingParamHistory = histRes1.isFetching || histRes2.isFetching || histRes3.isFetching || histRes4.isFetching;

    const LocationsData = locations?.locations;

    // Handle preset clicks (1D, 1W, 1M, 1Y, Custom)
    const handlePresetSelect = (newPreset: PresetOption) => {
        setPreset(newPreset);
        const now = new Date();
        const todayStr = getLocalDateString(now);

        if (newPreset === "1D") {
            const d = new Date(now);
            d.setDate(d.getDate() - 1);
            setFrom(getLocalDateString(d));
            setTo(todayStr);
        } else if (newPreset === "1W") {
            const d = new Date(now);
            d.setDate(d.getDate() - 7);
            setFrom(getLocalDateString(d));
            setTo(todayStr);
        } else if (newPreset === "1M") {
            const d = new Date(now);
            d.setDate(d.getDate() - 30);
            setFrom(getLocalDateString(d));
            setTo(todayStr);
        } else if (newPreset === "1Y") {
            const d = new Date(now);
            d.setDate(d.getDate() - 365);
            setFrom(getLocalDateString(d));
            setTo(todayStr);
        }
    };

    // Max allowed range for custom range is 6 months (180 days)
    const MAX_RANGE_DAYS = 180;

    const handleFromChange = (newFrom: string) => {
        setFrom(newFrom);
        if (newFrom && to) {
            const fDate = new Date(newFrom);
            const tDate = new Date(to);
            const diffDays = Math.ceil((tDate.getTime() - fDate.getTime()) / (1000 * 3600 * 24));
            
            if (diffDays < 0) {
                setTo(newFrom);
            } else if (diffDays > MAX_RANGE_DAYS) {
                const maxTo = new Date(fDate);
                maxTo.setDate(maxTo.getDate() + MAX_RANGE_DAYS);
                setTo(getLocalDateString(maxTo));
            }
        }
    };

    const handleToChange = (newTo: string) => {
        setTo(newTo);
        if (newTo && from) {
            const fDate = new Date(from);
            const tDate = new Date(newTo);
            const diffDays = Math.ceil((tDate.getTime() - fDate.getTime()) / (1000 * 3600 * 24));

            if (diffDays < 0) {
                setFrom(newTo);
            } else if (diffDays > MAX_RANGE_DAYS) {
                const minFrom = new Date(tDate);
                minFrom.setDate(minFrom.getDate() - MAX_RANGE_DAYS);
                setFrom(getLocalDateString(minFrom));
            }
        }
    };

    const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setExportAnchorEl(event.currentTarget);
    };

    const handleExportClose = () => {
        setExportAnchorEl(null);
    };

    // Parameter Wise export: only the selected parameter, one sheet/section per location
    const handleParameterWiseExport = (type: "excel" | "pdf") => {
        const filteredRecords = (parameterHistoryData || []).filter(
            (r: any) => r.metric_key?.toLowerCase() === parameter.toLowerCase()
        );

        if (filteredRecords.length === 0) {
            alert("No data available to export for the selected parameter and date range.");
            return;
        }

        const devicesList = Array.isArray(allDevices) ? allDevices : (allDevices?.devices || []);
        const getDeviceLabel = (uid: string) => {
            const dev = devicesList.find((d: any) => String(d.device_uid) === String(uid) || String(d.id) === String(uid));
            return dev?.name || uid;
        };

        const byLocation: Record<string, any[]> = {};
        filteredRecords.forEach((rec: any) => {
            const locName = rec.location_name || "Unknown";
            if (!byLocation[locName]) byLocation[locName] = [];
            byLocation[locName].push(rec);
        });

        const locationNames = Object.keys(byLocation);
        const sortedRowsFor = (locName: string) =>
            byLocation[locName].slice().sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime());

        if (type === "excel") {
            const workbook = XLSX.utils.book_new();
            const usedSheetNames = new Set<string>();

            locationNames.forEach((locName) => {
                const rows = sortedRowsFor(locName).map((rec: any) => ({
                    Timestamp: rec.time ? rec.time.replace("T", " ") : "",
                    Device: getDeviceLabel(rec.device_uid),
                    [parameter]: rec.value != null ? Number(rec.value).toFixed(2) : "-"
                }));

                let sheetName = locName.replace(/[\\/:?*\[\]]/g, "").slice(0, 31) || "Sheet";
                let suffix = 2;
                while (usedSheetNames.has(sheetName)) {
                    sheetName = `${sheetName.slice(0, 28)} (${suffix})`;
                    suffix++;
                }
                usedSheetNames.add(sheetName);

                const sheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
            });

            XLSX.writeFile(workbook, `parameter_wise_${parameter}_${from}_to_${to}.xlsx`);
            return;
        }

        const printWindow = window.open("", "_blank");
        if (printWindow) {
            const sectionsHtml = locationNames.map((locName, idx) => {
                const tableRowsHtml = sortedRowsFor(locName).map((rec: any) => `
                    <tr>
                        <td>${rec.time ? rec.time.replace("T", " ") : ""}</td>
                        <td>${getDeviceLabel(rec.device_uid)}</td>
                        <td>${rec.value != null ? Number(rec.value).toFixed(2) : "-"}</td>
                    </tr>
                `).join("");

                return `
                    <div style="${idx > 0 ? "page-break-before: always;" : ""}">
                        <div class="header">
                            <div class="logo">EnviroWatch</div>
                            <div class="title">Parameter-Wise Comparison - ${parameter}</div>
                            <div class="meta">
                                <strong>Location:</strong> ${locName} &nbsp;|&nbsp;
                                <strong>Date Range:</strong> ${from} to ${to} &nbsp;|&nbsp;
                                <strong>Exported on:</strong> ${new Date().toLocaleDateString()}
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr><th>Timestamp</th><th>Device</th><th>${parameter}</th></tr>
                            </thead>
                            <tbody>${tableRowsHtml}</tbody>
                        </table>
                    </div>
                `;
            }).join("");

            printWindow.document.write(`
                <html>
                    <head>
                        <title>EnviroWatch Historical Report</title>
                        <style>
                            body { font-family: 'Inter', system-ui, sans-serif; color: #111827; padding: 40px; margin: 0; }
                            .header { border-bottom: 2px solid #007A70; padding-bottom: 20px; margin-bottom: 30px; }
                            .logo { font-size: 24px; font-weight: 700; color: #007A70; margin-bottom: 10px; }
                            .title { font-size: 20px; font-weight: 600; color: #374151; margin-bottom: 5px; }
                            .meta { font-size: 13px; color: #6b7280; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th { background-color: #f3f4f6; color: #374151; font-weight: 600; text-align: left; font-size: 12px; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
                            td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid #f3f4f6; color: #4b5563; }
                            tr:nth-child(even) td { background-color: #fafafa; }
                            @media print { body { padding: 20px; } }
                        </style>
                    </head>
                    <body>
                        ${sectionsHtml}
                        <script>
                            window.onload = function() { window.print(); };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    // Column-wise Pivot Export logic (Location Wise only - single location at a time)
    const handleExport = (type: "excel" | "pdf") => {
        handleExportClose();

        if (mainTab === 1) {
            handleParameterWiseExport(type);
            return;
        }

        const records = locationHistoryData || [];
        if (!records || records.length === 0) {
            alert("No data available to export for the selected date range.");
            return;
        }

        // Discover distinct metrics
        const metricsList: string[] = Array.from(new Set(records.map((r: any) => r.metric_key))).filter(Boolean) as string[];

        // Group rows by Timestamp + Location + Device
        const rowMap: Record<string, { time: string; location: string; device: string; values: Record<string, any> }> = {};

        records.forEach((rec: any) => {
            const devList = device?.devices || [];
            const dev = devList.find((d: any) => String(d.device_uid) === String(rec.device_uid) || String(d.id) === String(rec.device_uid));
            const devName = dev?.name || rec.device_uid;
            const timeStr = rec.time ? rec.time.replace("T", " ") : "";
            const key = `${timeStr}__${rec.location_name}__${devName}`;

            if (!rowMap[key]) {
                rowMap[key] = {
                    time: timeStr,
                    location: rec.location_name || "",
                    device: devName,
                    values: {}
                };
            }
            rowMap[key].values[rec.metric_key] = rec.value != null ? Number(rec.value).toFixed(2) : "-";
        });

        const pivotedRows = Object.values(rowMap);

        const headers = ["Timestamp", "Location", "Device", ...metricsList];
        const csvHeaderStr = headers.map(h => `"${h}"`).join(",") + "\n";
        const csvRowStrs = pivotedRows.map(row => {
            const valCols = metricsList.map(m => row.values[m] !== undefined ? `"${row.values[m]}"` : '"-"');
            return [`"${row.time}"`, `"${row.location}"`, `"${row.device}"`, ...valCols].join(",");
        });

        const csvContent = csvHeaderStr + csvRowStrs.join("\n");

        if (type === "excel") {
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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
                const headerHtml = headers.map(h => `<th>${h}</th>`).join("");
                const tableRowsHtml = pivotedRows.map(row => {
                    const valTds = metricsList.map(m => `<td>${row.values[m] !== undefined ? row.values[m] : "-"}</td>`).join("");
                    return `
                        <tr>
                            <td>${row.time}</td>
                            <td>${row.location}</td>
                            <td>${row.device}</td>
                            ${valTds}
                        </tr>
                    `;
                }).join("");

                const titleText = `Location-Wise Report - ${LocationsData?.find((l: any) => String(l.id) === String(location))?.name || location}`;

                printWindow.document.write(`
                    <html>
                        <head>
                            <title>EnviroWatch Historical Report</title>
                            <style>
                                body { font-family: 'Inter', system-ui, sans-serif; color: #111827; padding: 40px; margin: 0; }
                                .header { border-bottom: 2px solid #007A70; padding-bottom: 20px; margin-bottom: 30px; }
                                .logo { font-size: 24px; font-weight: 700; color: #007A70; margin-bottom: 10px; }
                                .title { font-size: 20px; font-weight: 600; color: #374151; margin-bottom: 5px; }
                                .meta { font-size: 13px; color: #6b7280; }
                                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                th { background-color: #f3f4f6; color: #374151; font-weight: 600; text-align: left; font-size: 12px; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
                                td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid #f3f4f6; color: #4b5563; }
                                tr:nth-child(even) td { background-color: #fafafa; }
                                @media print { body { padding: 20px; } }
                            </style>
                        </head>
                        <body>
                            <div class="header">
                                <div class="logo">EnviroWatch</div>
                                <div class="title">${titleText}</div>
                                <div class="meta">
                                    <strong>Date Range:</strong> ${from} to ${to} &nbsp;|&nbsp; 
                                    <strong>View Mode:</strong> ${preset} (${currentInterval}) &nbsp;|&nbsp; 
                                    <strong>Exported on:</strong> ${new Date().toLocaleDateString()}
                                </div>
                            </div>
                            <table>
                                <thead>
                                    <tr>${headerHtml}</tr>
                                </thead>
                                <tbody>${tableRowsHtml}</tbody>
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
                                    <MenuItem sx={{ fontSize: "13px" }} value="CO2">CO2</MenuItem>
                                    <MenuItem sx={{ fontSize: "13px" }} value="Light">Light</MenuItem>
                                    <MenuItem sx={{ fontSize: "13px" }} value="Oxygen">Oxygen</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}

                    {/* Preset Buttons (1D, 1W, 1M, 1Y, Custom) */}
                    <Box sx={{ display: "flex", gap: 0.5, border: "1px solid #e5e7eb", borderRadius: "10px", p: "3px", bgcolor: "#f9fafb" }}>
                        {(["1D", "1W", "1M", "1Y", "Custom"] as PresetOption[]).map((p) => {
                            const isSelected = preset === p;
                            return (
                                <Chip
                                    key={p}
                                    label={p}
                                    clickable
                                    onClick={() => handlePresetSelect(p)}
                                    sx={{
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        height: "28px",
                                        borderRadius: "7px",
                                        backgroundColor: isSelected ? "#00A395" : "transparent",
                                        color: isSelected ? "#fff" : "#4b5563",
                                        "&:hover": {
                                            backgroundColor: isSelected ? "#007A70" : "#e5e7eb",
                                        },
                                    }}
                                />
                            );
                        })}
                    </Box>

                    {/* From & To Calendar Fields: ENABLED ONLY when preset === "Custom" */}
                    <TextField
                        type="date"
                        label="From"
                        value={from}
                        disabled={preset !== "Custom"}
                        onChange={(e) => handleFromChange(e.target.value)}
                        sx={{
                            ...inputStyles,
                            minWidth: 150,
                            opacity: preset !== "Custom" ? 0.75 : 1,
                        }}
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { max: to }
                        }}
                    />
                    <TextField
                        type="date"
                        label="To"
                        value={to}
                        disabled={preset !== "Custom"}
                        onChange={(e) => handleToChange(e.target.value)}
                        sx={{
                            ...inputStyles,
                            minWidth: 150,
                            opacity: preset !== "Custom" ? 0.75 : 1,
                        }}
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { min: from }
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
                    <MenuItem sx={{ fontSize: "13px" }} onClick={() => handleExport("excel")}>{mainTab === 1 ? "Export as Excel (.xlsx)" : "Export as Excel (CSV)"}</MenuItem>
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