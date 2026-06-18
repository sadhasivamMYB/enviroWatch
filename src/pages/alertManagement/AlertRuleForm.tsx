import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,

    Paper,
} from '@mui/material';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { inputStyles } from '../../theme';
import { useGetLocationIdDevicesQuery, useGetLocationsQuery } from '../../services/Api/location.api';
import { useGetDeviceIdByMetricsQuery } from '../../services/Api/device.api';

export default function AddRuleDialog({ open, onclose, isEdit, initialValues, onsubmit }: any) {

    const [location, setLocation] = useState('');
    const [device, setDevice] = useState<number | null>(null);
    const [sensor, setSensor] = useState([]);
    const [selectedSensor, setSelectedSensor] = useState<any>(null);
    const [selectedSensorValue, setSelectedSensorValue] = useState<any>(null);
    const [minValue, setMinValue] = useState<number>(15);
    const [maxValue, setMaxValue] = useState<number>(26);
    const [status, setStatus] = useState("Active");

    const { data: locations } = useGetLocationsQuery({ limit: null, offset: null })
    const { data: devices } = useGetLocationIdDevicesQuery({ location_id: location })
    // const { data: mertics } = useGetDeviceIdByMetricsQuery({ device_id: device })


    const LocationsData = locations?.locations
    const DeviceData = devices?.devices

    console.log(sensor, "❌❌❌✨")
    console.log(selectedSensor, "🙌🎊🩺")




    useEffect(() => {
        if (open && initialValues) {
            // setLocation(initialValues.location);
            // setDevice(initialValues.device);
            setSelectedSensor(initialValues.metric_id);
            setMinValue(initialValues.min_value);
            setMaxValue(initialValues.max_value);
            setStatus(initialValues.is_active ? "Active" : "Inactive");
        }
    }, [open])


    const handleSubmit = () => {

        console.log(selectedSensor, "selectedSensor")
        console.log(sensor, "sensor")

        const payload = {
            metric_id: selectedSensorValue?.id,
            rule_name: "",
            // min_value: String(minValue) + " " + selectedSensorValue?.unit,
            // max_value: String(maxValue) + " " + selectedSensorValue?.unit,
            min_value: minValue,
            max_value: maxValue,
            severity: "medium",
            ...(isEdit && { is_active: status == "Active" ? 1 : 0 })
        }

        // onsubmit(payload)
        console.log(payload)
        // onclose()
    }

    return (
        <Dialog
            open={open}
            onClose={onclose}
            maxWidth="md"



        >
            <DialogContent sx={{ px: 3, py: 3, width: "550px" }}>

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
                        <NotificationsNoneRoundedIcon sx={{ fontSize: 16 }} />
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
                            {isEdit ? "Edit Rule" : "Add New Rule"}
                        </Typography>

                        <Typography
                            sx={{
                                variant: "body1",
                                color: "#6B7280",
                                fontSize: 12
                            }}
                        >
                            {isEdit ? "Edit this rule" : "Set the acceptable range for Device readings"}
                        </Typography>
                    </Box>
                </Box>

                <Paper
                    variant="outlined"
                    sx={{
                        borderRadius: '24px',
                        borderColor: '#E4E4E4',
                        p: 2,
                    }}
                >
                    <Stack spacing={3}>
                        <Stack direction="row" spacing={2.5}>
                            <FormControl fullWidth sx={inputStyles}>
                                <InputLabel>Location</InputLabel>
                                <Select
                                    value={location}
                                    label="Location"
                                    onChange={(e) => setLocation(e.target.value)}
                                    sx={selectStyles}
                                >
                                    {
                                        LocationsData?.map((item) => (
                                            <MenuItem style={{ fontSize: "12px" }} key={item.id} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={inputStyles}>
                                <InputLabel>Device Name</InputLabel>
                                <Select
                                    value={device}
                                    label="Device Name"
                                    onChange={(e) => setDevice(e.target.value)}
                                    sx={selectStyles}
                                >

                                    {
                                        DeviceData?.map((item) => (
                                            <MenuItem style={{ fontSize: "12px" }} key={item.id} value={item.id} onClick={() => setSensor(item.sensors)}>
                                                {item.name}
                                            </MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>
                        </Stack>

                        <Box>
                            <FormControl fullWidth sx={inputStyles}>
                                <InputLabel>Sensor</InputLabel>
                                <Select
                                    value={selectedSensor}
                                    label="Sensor"
                                    onChange={(e) => setSelectedSensor(e.target.value)}
                                    sx={selectStyles}
                                >
                                    {sensor?.map((item: any) => (
                                        <MenuItem style={{ fontSize: "12px" }} key={item.id} value={item.metric_key} onClick={() => setSelectedSensorValue(item)}>
                                            {item.display_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Paper
                            variant="outlined"
                            sx={{
                                borderRadius: '22px',
                                borderColor: '#E5E5E5',
                                p: 2.5,
                            }}
                        >
                            {/* Header */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    mb: 4,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: '#4A4A4A',
                                    }}
                                >
                                    Threshold Range
                                </Typography>

                                <InfoOutlinedIcon
                                    sx={{
                                        color: '#8A8A8A',
                                        fontSize: 14,
                                    }}
                                />
                            </Box>

                            {/* Range Bar */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    px: 2,
                                    mb: 7,
                                }}
                            >
                                {/* Bar */}
                                <Box
                                    sx={{
                                        height: 4,
                                        borderRadius: 999,
                                        background:
                                            'linear-gradient(to right, #0057FF 0%, #0057FF 15%, #16A516 35%, #16A516 65%, #F00000 80%, #F00000 100%)',
                                    }}
                                />

                                {/* Labels */}
                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        top: -24,
                                        left: '10%',
                                        transform: 'translateX(-50%)',
                                        color: '#0057FF',
                                        fontWeight: 500,
                                        fontSize: 12,
                                    }}
                                >
                                    Below Min
                                </Typography>

                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        top: -24,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        color: '#158F15',
                                        fontWeight: 500,
                                        fontSize: 12,
                                    }}
                                >
                                    Normal Range
                                </Typography>

                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        top: -24,
                                        left: '82%',

                                        color: '#F00000',
                                        fontWeight: 500,
                                        fontSize: 12,
                                    }}
                                >
                                    Above Max
                                </Typography>

                                {/* Blue Dot */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '23%',
                                        top: -6,
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        bgcolor: '#0057FF',
                                        transform: 'translateX(-50%)',
                                        zIndex: 2,
                                    }}
                                />

                                {/* Red Dot */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '73%',
                                        top: -6,
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        bgcolor: '#F00000',
                                        transform: 'translateX(-50%)',
                                        zIndex: 2,
                                    }}
                                />
                            </Box>

                            {/* Bottom Section */}
                            <Box
                                sx={{


                                    alignItems: 'start',
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                {/* Min */}
                                <Box sx={{ position: 'relative', width: "200px" }}>
                                    {/* Dashed Line */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            right: 33,
                                            top: -60,
                                            height: 92,
                                            borderRight: '2px dashed #0057FF',
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: '#343434',
                                            mb: 1,
                                            mt: -4
                                        }}
                                    >
                                        Min (℃)
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={minValue}
                                        onChange={(e) => setMinValue(String(e.target.value))}
                                        sx={{
                                            width: "60%",
                                            '& .MuiOutlinedInput-root': {
                                                height: 44,
                                                borderRadius: '12px',
                                                fontSize: 14,
                                            },
                                        }}
                                    />
                                </Box>

                                {/* Center Text */}
                                <Box
                                    sx={{

                                        mt: -3,
                                        width: "200px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",



                                    }}
                                >
                                    <Typography
                                        sx={{

                                            textWrap: "balance",
                                            color: '#5E5E5E',
                                            fontSize: 11,
                                            lineHeight: 1.5,

                                        }}
                                    >
                                        Alerts will be triggered when
                                        <br />
                                        readings are outside this range.
                                    </Typography>
                                </Box>

                                {/* Max */}
                                <Box sx={{ position: 'relative' }}>
                                    {/* Dashed Line */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: 59,
                                            top: -60,
                                            height: 92,
                                            borderLeft: '2px dashed #F00000',
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: '#343434',
                                            mb: 1,
                                            mt: -4,
                                            ml: 10
                                        }}
                                    >
                                        Max (℃)
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        type="number"

                                        value={maxValue}
                                        onChange={(e) => setMaxValue(String(e.target.value))}
                                        sx={{
                                            width: "50%",
                                            ml: 10,
                                            '& .MuiOutlinedInput-root': {
                                                height: 44,
                                                borderRadius: '12px',
                                                fontSize: 14,
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Paper>

                    </Stack>
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
                </Paper>



                {/* Buttons */}
                <Box
                    sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
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
                        onClick={handleSubmit}
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
                        {isEdit ? "Update Rule" : "Add Rule"}
                    </Button>

                </Box>


            </DialogContent>
        </Dialog >
    );
}

const selectStyles = {
    borderRadius: '14px',
    height: 54,
    fontSize: 16,
}




