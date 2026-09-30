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
    CircularProgress,
    Paper,
} from '@mui/material';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { inputStyles } from '../../theme';
import { useGetLocationsQuery } from '../../services/Api/location.api';
import { useGetLocationIdDevicesQuery } from '../../services/Api/device.api';

export default function AddRuleDialog({ open, onclose, isEdit, initialValues, onsubmit, isLoading = false }: any) {
    const [location, setLocation] = useState('');
    const [device, setDevice] = useState<number | null>(null);
    const [ruleName, setRuleName] = useState<string>("");
    const [sensor, setSensor] = useState([]);
    const [selectedSensor, setSelectedSensor] = useState<any>(null);
    const [selectedSensorValue, setSelectedSensorValue] = useState<any>(null);
    const [minValue, setMinValue] = useState<number>(15);
    const [maxValue, setMaxValue] = useState<number>(26);
    const [durationMinutes, setDurationMinutes] = useState<number>(0);
    const [startTime, setStartTime] = useState<string>("00:00");
    const [endTime, setEndTime] = useState<string>("23:59");
    const [status, setStatus] = useState("Active");

    const { data: locations } = useGetLocationsQuery({});
    const { data: devices } = useGetLocationIdDevicesQuery({ location_id: location }, { skip: !location });

    const LocationsData = locations?.locations;
    const DeviceData = devices?.devices;

    useEffect(() => {
        if (open && isEdit && initialValues) {
            setLocation(initialValues.location_id || '');
            setDevice(initialValues.device_id || null);
            setSelectedSensor(initialValues.metric_key || null);
            setRuleName(initialValues.rule_name || "");
            setMinValue(initialValues.min_value || 15);
            setMaxValue(initialValues.max_value || 26);
            setDurationMinutes(initialValues.duration_minutes ?? 0);
            setStartTime(initialValues.start_time || "00:00");
            setEndTime(initialValues.end_time || "23:59");
            setStatus(initialValues.is_active ? "Active" : "Inactive");
        } else if (open && !isEdit) {
            setLocation('');
            setDevice(null);
            setRuleName("");
            setSensor([]);
            setSelectedSensor(null);
            setSelectedSensorValue(null);
            setMinValue(15);
            setMaxValue(26);
            setDurationMinutes(0);
            setStartTime("00:00");
            setEndTime("23:59");
            setStatus("Active");
        }
    }, [open, isEdit, initialValues]);

    const handleSubmit = () => {
        if (isEdit) {
            const payload = {
                ...initialValues,
                rule_name: ruleName,
                min_value: Number(minValue),
                max_value: Number(maxValue),
                duration_minutes: Number(durationMinutes),
                start_time: startTime,
                end_time: endTime,
                is_active: status === "Active",
            };
            onsubmit(payload);
        } else {
            const payload = {
                metric_id: selectedSensorValue?.id,
                rule_name: ruleName,
                min_value: Number(minValue),
                max_value: Number(maxValue),
                duration_minutes: Number(durationMinutes),
                start_time: startTime,
                end_time: endTime,
                severity: "medium",
            };
            onsubmit(payload);
        }

        onclose();
    };

    return (
        <Dialog
            open={open}
            onClose={onclose}
            maxWidth="md"
        >
            <DialogContent sx={{ px: 3, py: 3, width: "580px" }}>
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
                                fontWeight: 500,
                                color: "#111827",
                                fontSize: 18
                            }}
                        >
                            {isEdit ? "Edit Rule" : "Add New Rule"}
                        </Typography>

                        <Typography
                            sx={{
                                color: "#6B7280",
                                fontSize: 12
                            }}
                        >
                            {isEdit ? "Edit this rule" : "Set acceptable thresholds and continuous alarm duration provisions"}
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
                    <Stack spacing={2.5}>
                        <Stack direction="row" spacing={2.5}>
                            <FormControl fullWidth sx={inputStyles}>
                                <TextField
                                    value={ruleName}
                                    onChange={(e) => setRuleName(e.target.value)}
                                    placeholder="Enter rule name"
                                    fullWidth
                                    sx={inputStyles}
                                    slotProps={{
                                        input: {
                                            sx: {
                                                borderRadius: "12px",
                                                padding: "8px 14px",
                                                fontSize: "13px",
                                                height: "40px",
                                            }
                                        }
                                    }}
                                />
                            </FormControl>

                            <FormControl fullWidth sx={inputStyles}>
                                <InputLabel>Location</InputLabel>
                                <Select
                                    value={location}
                                    label="Location"
                                    onChange={(e) => setLocation(e.target.value)}
                                    sx={selectStyles}
                                    disabled={isEdit}
                                >
                                    {LocationsData?.map((item: any) => (
                                        <MenuItem style={{ fontSize: "12px" }} key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction="row" spacing={2.5}>
                            <FormControl fullWidth sx={inputStyles}>
                                <InputLabel>Device Name</InputLabel>
                                <Select
                                    value={device}
                                    label="Device Name"
                                    onChange={(e) => setDevice(Number(e.target.value))}
                                    sx={selectStyles}
                                    disabled={isEdit}
                                >
                                    {DeviceData?.map((item: any) => (
                                        <MenuItem style={{ fontSize: "12px" }} key={item.id} value={item.id} onClick={() => setSensor(item.sensors)}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={inputStyles}>
                                <InputLabel>Sensor</InputLabel>
                                <Select
                                    value={selectedSensor}
                                    label="Sensor"
                                    onChange={(e) => setSelectedSensor(e.target.value)}
                                    sx={selectStyles}
                                    disabled={isEdit}
                                >
                                    {isEdit ? (
                                        <MenuItem value={selectedSensor}>{initialValues?.sensor_name || selectedSensor}</MenuItem>
                                    ) : (
                                        sensor?.map((item: any) => (
                                            <MenuItem style={{ fontSize: "12px" }} key={item.id} value={item.metric_key} onClick={() => setSelectedSensorValue(item)}>
                                                {item.display_name}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        </Stack>

                        {/* Threshold Range */}
                        <Paper
                            variant="outlined"
                            sx={{
                                borderRadius: '20px',
                                borderColor: '#E5E5E5',
                                p: 2.5,
                            }}
                        >
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
                                <InfoOutlinedIcon sx={{ color: '#8A8A8A', fontSize: 14 }} />
                            </Box>

                            <Box sx={{ position: 'relative', px: 2, mb: 7 }}>
                                <Box
                                    sx={{
                                        height: 4,
                                        borderRadius: 999,
                                        background: 'linear-gradient(to right, #0057FF 0%, #0057FF 15%, #16A516 35%, #16A516 65%, #F00000 80%, #F00000 100%)',
                                    }}
                                />
                                <Typography sx={{ position: 'absolute', top: -24, left: '10%', transform: 'translateX(-50%)', color: '#0057FF', fontWeight: 500, fontSize: 12 }}>
                                    Below Min
                                </Typography>
                                <Typography sx={{ position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)', color: '#158F15', fontWeight: 500, fontSize: 12 }}>
                                    Normal Range
                                </Typography>
                                <Typography sx={{ position: 'absolute', top: -24, left: '82%', color: '#F00000', fontWeight: 500, fontSize: 12 }}>
                                    Above Max
                                </Typography>
                                <Box sx={{ position: 'absolute', left: '23%', top: -6, width: 16, height: 16, borderRadius: '50%', bgcolor: '#0057FF', transform: 'translateX(-50%)', zIndex: 2 }} />
                                <Box sx={{ position: 'absolute', left: '73%', top: -6, width: 16, height: 16, borderRadius: '50%', bgcolor: '#F00000', transform: 'translateX(-50%)', zIndex: 2 }} />
                            </Box>

                            <Box sx={{ alignItems: 'start', display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                <Box sx={{ position: 'relative', width: "200px" }}>
                                    <Box sx={{ position: 'absolute', right: 33, top: -60, height: 92, borderRight: '2px dashed #0057FF' }} />
                                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#343434', mb: 1, mt: -4 }}>
                                        Min
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={minValue}
                                        onChange={(e) => setMinValue(Number(e.target.value))}
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

                                <Box sx={{ mt: -3, width: "200px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <Typography sx={{ color: '#5E5E5E', fontSize: 11, lineHeight: 1.5, textAlign: "center" }}>
                                        Alerts will be triggered when readings are outside this range.
                                    </Typography>
                                </Box>

                                <Box sx={{ position: 'relative' }}>
                                    <Box sx={{ position: 'absolute', left: 59, top: -60, height: 92, borderLeft: '2px dashed #F00000' }} />
                                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#343434', mb: 1, mt: -4, ml: 10 }}>
                                        Max
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={maxValue}
                                        onChange={(e) => setMaxValue(Number(e.target.value))}
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

                        {/* Continuous Alarm & Time Window Provisions */}
                        <Paper
                            variant="outlined"
                            sx={{
                                borderRadius: '20px',
                                borderColor: '#E5E5E5',
                                p: 2.5,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <AccessTimeRoundedIcon sx={{ color: '#00796B', fontSize: 18 }} />
                                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                                    Alarm Duration & Operating Window Provisions
                                </Typography>
                            </Box>

                            <Stack spacing={2}>
                                {/* Continuous Duration */}
                                <Box>
                                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#4B5563', mb: 0.5 }}>
                                        Continuous Violation Duration (Minutes)
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={durationMinutes}
                                        onChange={(e) => setDurationMinutes(Math.max(0, Number(e.target.value)))}
                                        placeholder="0 for immediate trigger"
                                        helperText="Triggers alarm only when parameter crosses threshold continuously for this duration (0 = immediate)"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: 40,
                                                borderRadius: '10px',
                                                fontSize: 13,
                                            },
                                            '& .MuiFormHelperText-root': {
                                                fontSize: 11,
                                                color: '#6B7280',
                                            }
                                        }}
                                    />
                                </Box>

                                {/* Active Operating Window */}
                                <Box>
                                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#4B5563', mb: 0.5 }}>
                                        Operating Hours Window (Start & End Time)
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            type="time"
                                            label="Start Time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            fullWidth
                                            slotProps={{
                                                inputLabel: { shrink: true }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    height: 40,
                                                    borderRadius: '10px',
                                                    fontSize: 13,
                                                }
                                            }}
                                        />
                                        <TextField
                                            type="time"
                                            label="End Time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            fullWidth
                                            slotProps={{
                                                inputLabel: { shrink: true }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    height: 40,
                                                    borderRadius: '10px',
                                                    fontSize: 13,
                                                }
                                            }}
                                        />
                                    </Stack>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Status (Edit Mode) */}
                        {isEdit && (
                            <Box>
                                <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
                                    Status
                                </Typography>
                                <FormControl sx={inputStyles} fullWidth>
                                    <Select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        IconComponent={KeyboardArrowDownRoundedIcon}
                                        sx={inputStyles}
                                    >
                                        <MenuItem sx={{ fontSize: 14 }} value="Active">
                                            Active
                                        </MenuItem>
                                        <MenuItem sx={{ fontSize: 14 }} value="Inactive">
                                            Inactive
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        )}
                    </Stack>
                </Paper>

                {/* Footer Buttons */}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : (isEdit ? "Update Rule" : "Add Rule")}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

const selectStyles = {
    borderRadius: '14px',
    height: 54,
    fontSize: 16,
};
