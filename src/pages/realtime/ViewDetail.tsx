import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import {
    Air,
    KeyboardArrowDownOutlined,
} from '@mui/icons-material';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useParams } from 'react-router-dom';
import Back from '../../components/Back';
import { useGetDashboardQuery } from '../../services/Api/dashboard.api';
import { useEffect, useMemo, useState } from 'react';
import { getSensorConfig } from '../../utils/IconMapping';
import { FactoryIcon } from 'lucide-react';
// -- if sidebar needed then Fetch data from location API




const StatusChip = ({ label }: any) => (
    <Chip
        label={label || "Optimal"}
        size="small"
        sx={{
            backgroundColor: '#DFF3DF',
            color: '#2E8B57',
            fontWeight: 400,
            fontSize: 10,
            borderRadius: '20px',
            border: '1px solid #2E8B5720',
            height: 22,
        }}
    />
);

const InfoCard = ({
    value,
    label,
    unit,
}: {
    value: string | number;
    label: string;
    unit?: string;
}) => {
    const key = String(label).toLowerCase();
    const { icon: Icon, iconBg, iconColor } = getSensorConfig(key);

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
    };

    const rgb = hexToRgb(iconColor);
    const bg = `
        linear-gradient(115.04deg, rgba(217, 217, 217, 0.01), rgba(${rgb}, 0.12)) padding-box, 
        linear-gradient(#fff, #fff) padding-box, 
        linear-gradient(-64.53deg, rgba(11, 11, 15, 0.01), rgba(${rgb}, 0.1)) border-box`;

    return (
        <Box
            sx={{
                p: 2,
                borderRadius: "16px",
                background: bg,
                border: "1px solid transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: 92,
                boxSizing: "border-box",
            }}
        >
            {/* Left Content */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                {/* Icon */}
                <Box
                    sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "14px",
                        background: iconBg,
                        color: iconColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(255,255,255,0.6)",
                        "& svg": {
                            fontSize: 26,
                        },
                    }}
                >
                    {Icon && <Icon />}
                </Box>

                {/* Text */}
                <Box>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            color: "#71717a",
                            fontWeight: 500,
                            lineHeight: 1.2,
                            mb: 0.4,
                            textTransform: "capitalize",
                        }}
                    >
                        {label}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "22px",
                            fontWeight: 700,
                            color: "#18181b",
                            lineHeight: 1,
                        }}
                    >
                        {value}
                        <Typography
                            component="span"
                            sx={{
                                fontSize: "0.9rem",
                                color: "#71717a",
                                fontWeight: 600,
                                ml: 0.4,
                            }}
                        >
                            {unit}
                        </Typography>
                    </Typography>
                </Box>
            </Box>

            {/* Status */}
            <StatusChip />
        </Box>
    );
};

const SmallStatCard = ({ metric }: { metric: any }) => {
    const { icon: Icon, iconBg, iconColor } = getSensorConfig(metric.metric_key);

    return (
        <Grid size={{
            xs: 12,
            sm: 6,
            md: 2.4
        }}>
            <Box
                sx={{
                    p: 2.5,
                    borderRight: '1px solid #ECECEC',
                    height: '100%',
                }}
            >
                <Box sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start"
                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1.5
                    }}>
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '8px',
                                backgroundColor: iconBg,
                                color: iconColor,
                                display: 'flex',
                                fontSize: 25,
                                padding: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {Icon && <Icon sx={{ fontSize: 16 }} />}
                        </Box>

                        <Box>
                            <Typography sx={{
                                fontWeight: 500, fontSize: 12, color: "#666", textTransform: 'capitalize'
                            }}>
                                {metric.metric_name || metric.metric_key}
                            </Typography>
                            <Box sx={{
                                display: "flex", flexDirection: "row", gap: 0.5, alignItems: "baseline"
                            }}>
                                <Typography sx={{
                                    fontSize: 18, fontWeight: 700
                                }}>
                                    {metric.latest_value || 0}
                                </Typography>
                                <Typography sx={{
                                    color: "#888",
                                    fontSize: 10
                                }}>
                                    {metric.unit || ''}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <StatusChip />
                </Box>
            </Box>
        </Grid>
    )
}

export default function ViewDetail() {

    const params = useParams()
    const id = params?.id
    const [data, setData] = useState<any>()


    const { data: dashboardData } = useGetDashboardQuery()
    const locationData = dashboardData?.locations || []


    const getLocationData = () => {
        const data = locationData.find((item: any) => item.location_id == id)
        setData(data)
    }
    useEffect(() => {
        getLocationData()
    }, [locationData])


    // count active devices 

    const activeCounts = useMemo<{ onlineDevices: number, offlineDevices: number }>(() => {
        if (!data) return { onlineDevices: 0, offlineDevices: 0 }
        const devices = data?.devices || []
        const onlineDevices = devices.filter((device: any) => device.status == "online")
        const offlineDevices = devices.filter((device: any) => device.status == "offline")
        return { onlineDevices: onlineDevices.length, offlineDevices: offlineDevices.length }
    }, [data, locationData])


    // filter metrics
    const validMetrics = useMemo(() => {
        if (!data?.devices) return [];

        let allMetrics: any[] = [];
        data.devices.forEach((device: any) => {
            if (!device.metrics) return;

            if (device.device_type === "temperature") {
                // Add all metrics from the temperature device
                device.metrics.forEach((m: any) => {
                    if (!allMetrics.find(existing => existing.metric_key === m.metric_key)) {
                        allMetrics.push(m);
                    }
                });
            } else {
                // Ignore temperature metric from non-temperature devices
                const filteredMetrics = device.metrics.filter((m: any) => !m.metric_key.toLowerCase().includes("temperature"));
                filteredMetrics.forEach((fm: any) => {
                    if (!allMetrics.find(existing => existing.metric_key === fm.metric_key)) {
                        allMetrics.push(fm);
                    }
                });
            }
        });
        return allMetrics;
    }, [data]);
    const airQualityKeys = useMemo(() => [
        'pm2.5', 'pm25', 'pm10', 'tsp', 'co', 'no2', 'so2', 'o3', 'o2', 'ch4', 'h2', 'h2s', 'nh3', 'tvoc', 'voc', 'co2'
    ], []);

    const airQualityMetrics = useMemo(() => {
        return validMetrics.filter(m => airQualityKeys.includes(m.metric_key.toLowerCase()));
    }, [validMetrics, airQualityKeys]);

    const nonAirQualityMetrics = useMemo(() => {
        return validMetrics.filter(m => !airQualityKeys.includes(m.metric_key.toLowerCase()));
    }, [validMetrics, airQualityKeys]);

    const topMetrics = nonAirQualityMetrics.slice(0, 3);
    const smallMetrics = nonAirQualityMetrics.slice(3);



    return (
        <Box
            sx={{

                fontFamily: 'Inter, sans-serif',
                display: 'flex',
            }}
        >
            {/* Sidebar */}
            {/* <Box
                sx={{
                    width: 260,
                    background: 'linear-gradient(180deg, #014D45 0%, #013D37 100%)',
                    color: '#fff',
                    py: 4,
                    px: 2,
                }}
            >
                <Typography sx={{
                    variant: "h5", fontWeight: 700, mb: 4, px: 1
                }}>
                    Monitoring
                </Typography>

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '20px',
                        overflow: 'hidden',
                        backgroundColor: 'transparent',
                    }}
                >
                    {/* <List disablePadding>
                        {sidebarItems.map((item, index) => (
                            <ListItemButton
                                key={item}
                                sx={{
                                    mb: 1,
                                    borderRadius: '18px',
                                    py: 1.7,
                                    backgroundColor:
                                        index === 0 ? '#D6F1EA' : 'transparent',
                                    color: index === 0 ? '#00796B' : '#E7F5F2',
                                    '&:hover': {
                                        backgroundColor:
                                            index === 0 ? '#D6F1EA' : 'rgba(255,255,255,0.08)',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={item}
                                    primaryTypographyProps={{
                                        fontWeight: index === 0 ? 700 : 500,
                                        fontSize: 18,
                                    }}
                                />
                            </ListItemButton>
                        ))}
                    </List> 
        </Paper>
            </Box > */
            }

            {/* Main Content */}
            <Box sx={{
                flex: 1,
                p: 0,
                gap: "16px",
                display: "flex",
                flexDirection: "column"
            }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",

                    }}
                >
                    <Back title="Back to overview" path='/' />

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



                {/* Location Overview */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '20px',
                        p: 2,
                        border: '1px solid #E6ECE8',

                        backgroundColor: '#fff',
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 2
                        }}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 3
                        }}>
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '10px',
                                    backgroundColor: '#EEF8F5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 32,
                                }}
                            >
                                <FactoryIcon />
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6 }}>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography sx={{
                                        fontWeight: 600,

                                    }}>
                                        {data?.location_name || "Johnson & Johnson"}
                                    </Typography>

                                    <Chip label={data?.status || "active"}
                                        size='small'
                                        sx={{
                                            textTransform: "capitalize",
                                            borderRadius: '8px',
                                            p: 0,
                                            fontSize: 10,
                                            backgroundColor: "#e9f5ef",
                                            color: "#027700"


                                        }} />
                                </Box>

                                {data?.description && (
                                    <Typography sx={{
                                        fontSize: "12px",
                                        color: "#4A4A4A"
                                    }}>
                                        {data.description}
                                    </Typography>
                                )}

                                {/* Active Stats */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 0.2,
                                        width: "100%",

                                        px: 1,
                                        py: 0.4,

                                        bgcolor: "rgba(11, 11, 15, 0.03)",
                                        borderRadius: "6px",

                                        boxSizing: "border-box",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "8px",
                                            color: "#52525b",
                                            flex: 1,
                                            textAlign: "center",
                                        }}
                                    >
                                        {activeCounts.offlineDevices + activeCounts.onlineDevices || 0} Devices
                                    </Typography>

                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                    />

                                    <Typography
                                        sx={{
                                            fontSize: "8px",
                                            color: "#16a34a",
                                            flex: 1,
                                            textAlign: "center",

                                        }}
                                    >
                                        {activeCounts.onlineDevices || 0} Active
                                    </Typography>

                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                    />

                                    <Typography
                                        sx={{
                                            fontSize: "8px",
                                            color: "#dc2626",
                                            flex: 1,
                                            textAlign: "center",

                                        }}
                                    >
                                        {activeCounts.offlineDevices || 0} Inactive
                                    </Typography>
                                </Box>

                            </Box>

                        </Box>

                        <Typography sx={{
                            color: "#7A7A7A",
                            fontSize: 12
                        }}>
                            Last updated: 2 min ago
                        </Typography>
                    </Box>
                </Paper>

                {/* Top Cards */}
                {topMetrics.length > 0 && (
                    <Grid container spacing={2}>
                        {topMetrics.map((metric: any, index: number) => (
                            <Grid
                                key={index}
                                size={{
                                    xs: 12,
                                    md: 4,
                                }}
                            >
                                <InfoCard
                                    value={metric.latest_value || 0}
                                    label={metric.metric_name || metric.metric_key}
                                    unit={metric.unit || ''}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Small Stats */}
                {smallMetrics.length > 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid #ECECEC',
                        }}
                    >
                        <Grid container>
                            {smallMetrics.map((metric: any, index: number) => (
                                <SmallStatCard key={index} metric={metric} />
                            ))}
                        </Grid>
                    </Paper>
                )}

                {/* Air Quality Section */}
                {airQualityMetrics.length > 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '16px',
                            border: '1px solid #E8ECEA',
                            p: 2,
                            backgroundColor: '#fff',
                        }}
                    >
                        {/* Header */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 1,
                            }}
                        >
                            <Air sx={{ color: '#35A853' }} />

                            <Typography
                                sx={{
                                    fontSize: 12,

                                    color: '#4A4A4A',
                                }}
                            >
                                Air Quality Index Details
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Grid */}
                        <Grid
                            container
                            spacing={"12px"}

                        >
                            {airQualityMetrics.map((item: any) => (
                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                        md: 12 / 7,

                                    }}
                                    spacing={"12px"}
                                    key={item.metric_key}
                                >
                                    <Box
                                        sx={{
                                            border: '1px solid #ECECEC',
                                            borderRadius: '10px',
                                            p: 2,

                                            display: 'flex',
                                            flexDirection: 'column',
                                            backgroundColor: '#fff',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: '#18A136',
                                                fontWeight: 500,
                                                fontSize: 12,
                                                mb: 1,
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            {item.display_name || item.metric_key}
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'baseline',
                                                gap: 0.5,
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: 22,
                                                    fontWeight: 600,
                                                    lineHeight: 1,
                                                }}
                                            >
                                                {item.latest_value !== null && item.latest_value !== undefined ? item.latest_value : '0'}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: '#888',
                                                    fontSize: 12,
                                                }}
                                            >
                                                {item.unit || ''}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}
            </Box>
        </Box >
    );
}
