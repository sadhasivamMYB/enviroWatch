import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
// import { useGetSensorsQuery } from '../../services/Api/sensors.api';
import { useGetLocationsQuery } from '../../services/Api/location.api';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { inputStyles } from '../../theme';



export const sensorsList = [
    {
        metric_key: "lux",
        display_name: "Lux",
        unit: "lx"
    },
    {
        metric_key: "temperature",
        display_name: "Temperature",
        unit: "°C"
    },
    {
        metric_key: "humidity",
        display_name: "Humidity",
        unit: "%"
    },
    {
        metric_key: "tds",
        display_name: "TDS",
        unit: "ppm"
    },
    {
        metric_key: "ph",
        display_name: "PH",
        unit: "pH"
    },
    {
        metric_key: "cod",
        display_name: "COD",
        unit: "mg/L"
    },
    {
        metric_key: "noise",
        display_name: "Noise",
        unit: "dB"
    },
    {
        metric_key: "pm10",
        display_name: "PM10",
        unit: "µg/m³"
    },
    {
        metric_key: "tsp",
        display_name: "TSP",
        unit: "µg/m³"
    },
    {
        metric_key: "co",
        display_name: "CO",
        unit: "ppm"
    },
    {
        metric_key: "no2",
        display_name: "NO2",
        unit: "ppb"
    },
    {
        metric_key: "o3",
        display_name: "O3",
        unit: "ppb"
    },
    {
        metric_key: "o2",
        display_name: "O2",
        unit: "%"
    },
    {
        metric_key: "ch4",
        display_name: "CH4",
        unit: "ppm"
    },
    {
        metric_key: "h2",
        display_name: "H2",
        unit: "ppm"
    },
    {
        metric_key: "h2s",
        display_name: "H2S",
        unit: "ppm"
    },
    {
        metric_key: "nh3",
        display_name: "NH3",
        unit: "ppm"
    },
    {
        metric_key: "tvoc",
        display_name: "TVOC",
        unit: "ppb"
    },
    {
        metric_key: "co2",
        display_name: "CO2",
        unit: "ppm"
    }
];


export default function DeviceManagementForm({ open, onclose, isEdit, initialValues, onsubmit }: { open: boolean, onclose: () => void, isEdit: boolean, initialValues?: any, onsubmit: any }) {


    console.log(initialValues, "⚠️😎🔃")
    const [selectedLocation, setSelectedLocation] = useState('warehousw Q');
    const [deviceName, setDeviceName] = useState('');
    const [deviceType, setDeviceType] = useState('');
    const [selectedSensors, setSelectedSensors] = useState<any[]>([]);

    const [status, setStatus] = useState("");


    const { data: location } = useGetLocationsQuery()

    const locations = location?.locations



    const handleToggleSensor = (sensor: any) => {
        const exists = selectedSensors.some(
            (item: any) => item.metric_key === sensor.metric_key
        );

        if (exists) {
            setSelectedSensors((prev) =>
                prev.filter((item: any) => item.metric_key !== (sensor.metric_key))
            );
        } else {
            setSelectedSensors((prev) => [...prev, sensor]);
        }
    };

    useEffect(() => {
        if (open && initialValues) {
            setSelectedLocation(initialValues.location_id);
            setDeviceName(initialValues.name);
            setDeviceType(initialValues.device_type);
            setSelectedSensors(initialValues.metrics || []);
            setStatus(initialValues.is_active ? "Active" : "Inactive");
        }
    }, [initialValues, open])

    console.log(selectedSensors, "💾💾💾")

    const DevicePayload = {
        device_uid: deviceType.slice(0, 4).toUpperCase() + "-" + deviceName.slice(0, 2).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9999),
        name: deviceName,
        ip_address: "0.0.0.0",
        location_id: selectedLocation,
        device_type: deviceType,
        sensors: selectedSensors,

        ...(isEdit && { device_id: initialValues.id, is_active: status === "Active" ? true : false })
    }

    console.log(DevicePayload, "🙌🙌🙌");

    const onhandleSave = () => {

        onsubmit(DevicePayload);




    }


    return (
        <Dialog
            open={open}
            onClose={onclose}
            maxWidth="md"

        >
            <DialogContent sx={{ px: 3, pt: 2.5, width: "450px" }}>
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1.3,
                        mb: 2,

                    }}
                >
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "10px",
                            backgroundColor: "#00796B",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                        }}
                    >
                        <SettingsOutlinedIcon sx={{ fontSize: 16 }} />
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                variant: "h3",
                                fontWeight: 500,
                                color: "#111827",
                                fontSize: 18
                            }}
                        >
                            {isEdit ? "Edit Device" : "Add New Device"}
                        </Typography>

                        <Typography
                            sx={{
                                variant: "body1",
                                color: "#6B7280",
                                fontSize: 12
                            }}
                        >
                            {isEdit ? "Edit this device" : "Add a device and configure the sensors it will monitor"}
                        </Typography>
                    </Box>
                </Box>

                <Paper
                    variant="outlined"
                    sx={{
                        borderRadius: '24px',
                        p: 3,
                        borderColor: '#E2E2E2',
                    }}
                >
                    <Stack spacing={3}>
                        <Box>
                            <Typography sx={{ fontSize: "14px", color: "#000", mb: 1 }}>Device Name</Typography>
                            <TextField
                                fullWidth
                                value={deviceName}
                                onChange={(e) => setDeviceName(e.target.value)}
                                sx={inputStyles}
                            />
                        </Box>

                        <Stack direction="row" spacing={2.5}>
                            <FormControl fullWidth sx={inputStyles}>
                                <InputLabel>Device Type</InputLabel>
                                <Select
                                    value={deviceType}
                                    label="Device Type"
                                    onChange={(e) => setDeviceType(e.target.value as string)}
                                >
                                    <MenuItem sx={{ fontSize: 12 }} value="temperature">Temperature</MenuItem>
                                    <MenuItem sx={{ fontSize: 12 }} value="humidity">Humidit</MenuItem>
                                    <MenuItem sx={{ fontSize: 12 }} value="co2">CO2</MenuItem>

                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={inputStyles}>
                                <InputLabel>Device Location</InputLabel>
                                <Select
                                    value={selectedLocation}
                                    label="Device Location"
                                    onChange={(e) =>
                                        setSelectedLocation(e.target.value as string)
                                    }
                                    sx={inputStyles}
                                >
                                    {locations?.map((location) => (
                                        <MenuItem sx={{ fontSize: 12 }} key={location.id} value={location.id}>
                                            {location.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Box>
                            <Typography sx={{
                                fontSize: "12px",
                                fontWeight: 500,
                                color: "#111827",
                                mb: 1
                            }}>
                                Select Sensors featured in the device
                            </Typography>

                            <Box
                                sx={{
                                    border: '1px solid #E4E4E4',
                                    borderRadius: '20px',
                                    p: 2,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1.4,
                                }}
                            >
                                {sensorsList?.map((sensor: any) => {
                                    const selected = selectedSensors.some(
                                        (item) => item.metric_key === sensor.metric_key
                                    );
                                    return (
                                        <Chip
                                            key={sensor.id}
                                            label={sensor.display_name}
                                            clickable
                                            onClick={() => handleToggleSensor(sensor)}
                                            sx={{
                                                height: 30,
                                                borderRadius: '12px',
                                                px: 0.6,
                                                fontSize: 12,
                                                bgcolor: selected ? '#00796B' : '#fff',
                                                color: selected ? '#fff' : '#575757',
                                                border: `1px solid ${selected ? '#00796B' : '#E3E3E3'
                                                    }`,
                                                '&:hover': {
                                                    bgcolor: selected ? '#00695C' : '#F8F8F8',
                                                },
                                            }}
                                        />
                                    );
                                })}
                            </Box>
                        </Box>

                        {/* Status */}
                        {
                            isEdit &&
                            <Box>

                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: "#4B5563"

                                    }}
                                >
                                    Status
                                </Typography>

                                <FormControl sx={inputStyles} fullWidth>
                                    <Select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                        IconComponent={
                                            KeyboardArrowDownRoundedIcon
                                        }
                                        sx={inputStyles}
                                    >
                                        <MenuItem sx={{ fontSize: 14, }} value="Active">
                                            Active
                                        </MenuItem>
                                        <MenuItem sx={{ fontSize: 14, }} value="Inactive">
                                            Inactive
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        }
                    </Stack>
                </Paper>

            </DialogContent>
            <DialogActions>
                <Box
                    sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        padding: 2,
                        borderTop: "1px solid #E4E4E4",
                        backgroundColor: "#fff",

                    }}
                >
                    <Button
                        onClick={onclose}
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",

                            fontSize: "14px",
                            borderColor: "#D1D5DB",
                            color: "#374151",
                        }}
                    >
                        Cancel
                    </Button>

                    <Button

                        onClick={onhandleSave}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",

                            fontSize: "14px",
                            backgroundColor: "#00796B",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "#00695C",
                                boxShadow: "none",
                            },
                        }}
                    >
                        {isEdit ? "Update Device" : "Save Device"}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

