import { Box, Button, FormControl, InputLabel, MenuItem, Select, Tab, Tabs } from "@mui/material";
import ParameterWise from "./ParameterWise";
import { useState } from "react";
import { inputStyles } from "../../theme";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import LocationWise from "./LocationWise";
import PageTitle from "../../components/Pagetitle";
import Back from "../../components/Back";
import { useGetLocationsQuery } from "../../services/Api/location.api";



const Historical = () => {


    const tempData = [
        450, 420, 480, 540, 510, 270, 300, 490, 470, 610, 590, 540, 480, 210, 190,
        480, 490, 510, 500, 390, 370, 990, 10, 610, 580,
    ];

    const humidityData = [
        65, 62, 70, 74, 72, 55, 58, 68, 67, 80, 77, 73, 70, 48, 45,
        69, 71, 74, 72, 60, 58, 88, 90, 80, 77,
    ];

    // Parameter Wise: multi-sensor comparison
    const parameterTempData = [
        [20, 390, 440, 500, 490, 250, 280, 460, 445, 580, 560, 510, 455, 190, 170, 455, 465, 480, 470, 360, 340, 960, 980, 580, 550],
        [480, 450, 510, 580, 560, 310, 335, 520, 505, 650, 630, 580, 515, 240, 215, 515, 530, 550, 540, 420, 395, 1020, 1045, 650, 615],
        [390, 365, 415, 470, 455, 225, 255, 435, 420, 545, 525, 480, 425, 165, 145, 425, 440, 460, 448, 335, 315, 920, 945, 545, 515],
    ];




    // ─── Filter Bar ────────────────────────────────────────────────────────────────
    interface FilterBarProps {
        mode: "location" | "parameter";
    }
    function FilterBar({ mode }: FilterBarProps) {
        const [location, setLocation] = useState<string[]>([]);
        const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
        const [device, setDevice] = useState("TempSense Pr...");
        const [from] = useState("30-03-2026");
        const [to] = useState("06-04-2026");
        const [gran, setGran] = useState("Hourly");
        const [parameter, setParameter] = useState("Temperature");
        const { data: locations, isLoading: locationsLoading, isError: locationsError } = useGetLocationsQuery()
        return (
            <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", gap: 1.2, flexWrap: "wrap" }}>
                    {mode === "location" ? (
                        <>
                            <FormControl sx={inputStyles}>
                                <InputLabel>Location</InputLabel>
                                <Select sx={inputStyles} value={location} label="Location" onChange={(e: any) => setLocation(e.target.value)}>
                                    <MenuItem sx={{ fontSize: "13px" }} value="Warehouse A">Warehouse A</MenuItem>
                                    <MenuItem sx={{ fontSize: "13px" }} value="Warehouse B">Warehouse B</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={inputStyles}>
                                <InputLabel>Device Name</InputLabel>
                                <Select sx={inputStyles} value={device} label="Device Name" onChange={(e: any) => setDevice(e.target.value)}>
                                    <MenuItem sx={{ fontSize: "13px" }} value="TempSense Pro 3000">TempSense Pro 3000</MenuItem>
                                    <MenuItem sx={{ fontSize: "13px" }} value="HumiTrack X2">HumiTrack X2</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    ) : (
                        <>

                            <FormControl sx={inputStyles}>
                                <InputLabel>Location</InputLabel>

                                <Select
                                    multiple
                                    value={selectedLocation}
                                    label="Location"
                                    sx={inputStyles}
                                    onChange={(e) => {
                                        const val = e.target.value;

                                        // allow only 4 selections
                                        if (val.length <= 4) {
                                            setSelectedLocation(val);
                                        }
                                    }}
                                    renderValue={(selected) => `${selected.length} selected`}
                                >
                                    {locations?.map((item) => (
                                        <MenuItem
                                            sx={{ fontSize: "13px" }}
                                            key={item}
                                            value={item}
                                            disabled={
                                                selectedLocation.length >= 4 && !selectedLocation.includes(item)
                                            }
                                        >
                                            {item}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>


                            <FormControl sx={inputStyles}>
                                <InputLabel>Parameter</InputLabel>

                                <Select sx={inputStyles} value={parameter} label="Parameter" onChange={(e: any) => setParameter(e.target.value)}>
                                    <MenuItem sx={{ fontSize: "13px" }} value="Temperature">Temperature</MenuItem>
                                    <MenuItem sx={{ fontSize: "13px" }} value="Humidity">Humidity</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}

                    {/* Date pickers (static display) */}
                    {[["From", from], ["To", to]].map(([label, val]) => (
                        <FormControl key={label} size="small" sx={inputStyles}>
                            <InputLabel>{label}</InputLabel>
                            <Select sx={inputStyles} value={val} label={label}>
                                <MenuItem sx={{ fontSize: 12 }} value={val}>{val}</MenuItem>
                            </Select>
                        </FormControl>
                    ))}

                    {/* <FormControl size="small" sx={inputStyles}>
                        <InputLabel>Granularity</InputLabel>
                        <Select value={gran} label="Granularity" onChange={(e: any) => setGran(e.target.value)}>
                            {["Hourly", "Daily", "Weekly"].map((g) => (
                                <MenuItem sx={{ fontSize: 12 }} key={g} value={g}>{g}</MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}

                </Box>


                <Button
                    variant="contained"
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
            </Box>
        );
    }


    const [mainTab, setMainTab] = useState(0);
    return (
        <Box>

            <PageTitle title="Historical Data & Trends" />


            <Back title={"Back to dashboard"} path={"/"} />

            <Box sx={{ display: "flex" }}>

                {/* Main content */}
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                    {/* Top-level tabs */}
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
                            onChange={(_, v) => setMainTab(v)}
                            sx={{

                                padding: 1,


                                "& .MuiTabs-indicator": {
                                    display: "none", // optional: hide default underline
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

                    {/* Filter bar */}
                    <Box sx={{ border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", boxSizing: "border-box", padding: "16px" }}>
                        <FilterBar mode={mainTab === 0 ? "location" : "parameter"} />
                    </Box>

                    {/* Content */}
                    {mainTab === 0 ? <LocationWise tempData={tempData} humidityData={humidityData} /> : <ParameterWise parameterTempData={parameterTempData} />}
                </Box>

            </Box>
        </Box>
    );
}

export default Historical;