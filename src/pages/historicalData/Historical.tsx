import { Box, Button, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Menu, Chip } from "@mui/material";
import * as XLSX from "xlsx";
import ParameterWise from "./ParameterWise";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { inputStyles } from "../../theme";
import { sensorsList } from "../deviceManagement/DeviceForm";
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

// Max allowed range for custom range is 6 months (180 days)
const MAX_RANGE_DAYS = 180;

// Calculate aggregation interval based on preset & custom range
const getIntervalFor = (preset: PresetOption, from: string, to: string) => {
    if (preset === "1D") return "raw";
    if (preset === "1W" || preset === "1M") return "1 hour";
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

// Preset + from/to date state. Location Wise and Parameter Wise each use their
// own instance so staging dates on one tab never changes the other.
const useDateRange = () => {
    // Default to 1D (current calendar day, midnight through now)
    const [preset, setPreset] = useState<PresetOption>("1D");
    const [from, setFrom] = useState(getLocalDateString());
    const [to, setTo] = useState(getLocalDateString());

    // Handle preset clicks (1D, 1W, 1M, 1Y, Custom)
    const selectPreset = (newPreset: PresetOption) => {
        setPreset(newPreset);
        const now = new Date();
        const todayStr = getLocalDateString(now);

        if (newPreset === "1D") {
            // Current calendar day only - midnight through now, not a rolling
            // 24h window and not including yesterday.
            setFrom(todayStr);
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

    const changeFrom = (newFrom: string) => {
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

    const changeTo = (newTo: string) => {
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

    return { preset, from, to, selectPreset, changeFrom, changeTo };
};

// What Parameter Wise is actually showing. Picking locations/parameter/dates
// only stages a draft; this is set when Apply is clicked.
type AppliedParameterSelection = {
    locations: string[];
    parameter: string;
    parameterLabel: string;
    preset: PresetOption;
    from: string;
    to: string;
};

const Historical = () => {
    const [searchParams] = useSearchParams();
    const requestedLocationId = searchParams.get("location");

    const [location, setLocation] = useState<string>("");

    // Location Wise date range
    const {
        preset,
        from,
        to,
        selectPreset: handlePresetSelect,
        changeFrom: handleFromChange,
        changeTo: handleToChange,
    } = useDateRange();

    // Parameter Wise draft selection (applied on the Apply button)
    const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
    const [parameter, setParameter] = useState("");
    const paramRange = useDateRange();
    const [appliedSelection, setAppliedSelection] = useState<AppliedParameterSelection | null>(null);

    const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
    const [mainTab, setMainTab] = useState(0);

    const { data: locations } = useGetLocationsQuery({});
    const { data: allDevices } = useGetDevicesQuery();
    const { data: device } = useGetLocationIdDevicesQuery({ location_id: location }, { skip: !location });

    // Auto-select the location from the ?location= link (e.g. View Detail ->
    // History), otherwise the first location, when locations load
    useEffect(() => {
        if (locations?.locations?.length && !location) {
            const requested = requestedLocationId
                ? locations.locations.find((l: any) => String(l.id) === requestedLocationId)
                : null;
            setLocation((requested || locations.locations[0]).id);
        }
    }, [locations]);

    const currentInterval = getIntervalFor(preset, from, to);

    // Trigger API queries with current interval
    const { data: locationHistoryData, isFetching: isFetchingHistory } = useGetLocationHistoryQuery(
        { location_id: location, from_date: from, to_date: to, interval: currentInterval },
        { skip: !location || mainTab !== 0 }
    );

    // Parameter Wise only fetches what was applied
    const appliedLocations = appliedSelection?.locations ?? [];
    const appliedFrom = appliedSelection?.from ?? "";
    const appliedTo = appliedSelection?.to ?? "";
    const appliedInterval = appliedSelection
        ? getIntervalFor(appliedSelection.preset, appliedSelection.from, appliedSelection.to)
        : "raw";

    const histRes1 = useGetLocationHistoryQuery({ location_id: appliedLocations[0], from_date: appliedFrom, to_date: appliedTo, interval: appliedInterval }, { skip: appliedLocations.length < 1 || mainTab !== 1 });
    const histRes2 = useGetLocationHistoryQuery({ location_id: appliedLocations[1], from_date: appliedFrom, to_date: appliedTo, interval: appliedInterval }, { skip: appliedLocations.length < 2 || mainTab !== 1 });
    const histRes3 = useGetLocationHistoryQuery({ location_id: appliedLocations[2], from_date: appliedFrom, to_date: appliedTo, interval: appliedInterval }, { skip: appliedLocations.length < 3 || mainTab !== 1 });
    const histRes4 = useGetLocationHistoryQuery({ location_id: appliedLocations[3], from_date: appliedFrom, to_date: appliedTo, interval: appliedInterval }, { skip: appliedLocations.length < 4 || mainTab !== 1 });

    const parameterHistoryData = [
        ...(histRes1.data || []),
        ...(histRes2.data || []),
        ...(histRes3.data || []),
        ...(histRes4.data || [])
    ];
    const isFetchingParamHistory = histRes1.isFetching || histRes2.isFetching || histRes3.isFetching || histRes4.isFetching;

    const LocationsData = locations?.locations;

    const canApplyParameter = selectedLocation.length > 0 && !!parameter;
    const hasPendingParameterChanges =
        !appliedSelection ||
        appliedSelection.parameter !== parameter ||
        appliedSelection.preset !== paramRange.preset ||
        appliedSelection.from !== paramRange.from ||
        appliedSelection.to !== paramRange.to ||
        appliedSelection.locations.length !== selectedLocation.length ||
        appliedSelection.locations.some((l) => !selectedLocation.includes(l));

    const handleApplyParameter = () => {
        const sensor = sensorsList.find((s) => s.metric_key === parameter);
        setAppliedSelection({
            locations: [...selectedLocation],
            parameter,
            parameterLabel: sensor?.display_name || parameter,
            preset: paramRange.preset,
            from: paramRange.from,
            to: paramRange.to,
        });
    };

    const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setExportAnchorEl(event.currentTarget);
    };

    const handleExportClose = () => {
        setExportAnchorEl(null);
    };

    // Parameter Wise export: only the selected parameter, one sheet/section per location
    const handleParameterWiseExport = (type: "excel" | "pdf") => {
        if (!appliedSelection) {
            alert("Select location(s) and a parameter, then click Apply before exporting.");
            return;
        }
        const {
            parameter: appliedParameter,
            parameterLabel,
            from: exportFrom,
            to: exportTo,
        } = appliedSelection;

        const filteredRecords = (parameterHistoryData || []).filter(
            (r: any) => r.metric_key?.toLowerCase() === appliedParameter.toLowerCase()
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
                    [parameterLabel]: rec.value != null ? Number(rec.value).toFixed(2) : "-"
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

            XLSX.writeFile(workbook, `parameter_wise_${parameterLabel}_${exportFrom}_to_${exportTo}.xlsx`);
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
                            <div class="title">Parameter-Wise Comparison - ${parameterLabel}</div>
                            <div class="meta">
                                <strong>Location:</strong> ${locName} &nbsp;|&nbsp;
                                <strong>Date Range:</strong> ${exportFrom} to ${exportTo} &nbsp;|&nbsp;
                                <strong>Exported on:</strong> ${new Date().toLocaleDateString()}
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr><th>Timestamp</th><th>Device</th><th>${parameterLabel}</th></tr>
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
        // Each tab edits its own date range
        const range = mode === "location"
            ? { preset, from, to, selectPreset: handlePresetSelect, changeFrom: handleFromChange, changeTo: handleToChange }
            : paramRange;

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
                                    {sensorsList.map((sensor) => (
                                        <MenuItem sx={{ fontSize: "13px" }} key={sensor.metric_key} value={sensor.metric_key}>
                                            {sensor.display_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    )}

                    {/* Preset Buttons (1D, 1W, 1M, 1Y, Custom) */}
                    <Box sx={{ display: "flex", gap: 0.5, border: "1px solid #e5e7eb", borderRadius: "10px", p: "3px", bgcolor: "#f9fafb" }}>
                        {(["1D", "1W", "1M", "1Y", "Custom"] as PresetOption[]).map((p) => {
                            const isSelected = range.preset === p;
                            return (
                                <Chip
                                    key={p}
                                    label={p}
                                    clickable
                                    onClick={() => range.selectPreset(p)}
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
                        value={range.from}
                        disabled={range.preset !== "Custom"}
                        onChange={(e) => range.changeFrom(e.target.value)}
                        sx={{
                            ...inputStyles,
                            minWidth: 150,
                            opacity: range.preset !== "Custom" ? 0.75 : 1,
                        }}
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { max: range.to }
                        }}
                    />
                    <TextField
                        type="date"
                        label="To"
                        value={range.to}
                        disabled={range.preset !== "Custom"}
                        onChange={(e) => range.changeTo(e.target.value)}
                        sx={{
                            ...inputStyles,
                            minWidth: 150,
                            opacity: range.preset !== "Custom" ? 0.75 : 1,
                        }}
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { min: range.from }
                        }}
                    />

                    {mode === "parameter" && (
                        <Button
                            variant="contained"
                            disabled={!canApplyParameter || !hasPendingParameterChanges}
                            onClick={handleApplyParameter}
                            sx={{
                                textTransform: "capitalize",
                                background: "#007A70",
                                borderRadius: "12px",
                                fontSize: "12px",
                                height: "32px",
                                "&.Mui-disabled": {
                                    background: "#e5e7eb",
                                    color: "#9ca3af",
                                },
                            }}
                        >
                            Apply
                        </Button>
                    )}
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
                            selectedLocations={appliedSelection?.locations ?? []}
                            parameter={appliedSelection?.parameter ?? ""}
                            parameterLabel={appliedSelection?.parameterLabel ?? ""}
                            locationsData={LocationsData}
                            allDevices={allDevices}
                            from={appliedFrom}
                            to={appliedTo}
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