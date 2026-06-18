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

    Grain,
    Air,
    KeyboardArrowDownOutlined,
    AirOutlined,
    WaterDropOutlined,
    ThermostatOutlined,
    OpacityOutlined,
    InfoOutlined,
} from '@mui/icons-material';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useParams } from 'react-router-dom';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';
import Back from '../../components/Back';
// -- if sidebar needed then Fetch data from location API

const topStats = {
    temperature: {

        icon: <ThermostatOutlined />,
        bg: `
        linear-gradient(115.04deg, rgba(217, 217, 217, 0.01), rgba(207, 159, 2, 0.08)) padding-box, 
        linear-gradient(#fff, #fff) padding-box, 
        linear-gradient(-64.53deg, rgba(11, 11, 15, 0.01), rgba(207, 159, 2, 0.1)) border-box`,
        iconBg: '#fff7d6',
        iconColor: '#CF9F02',
        unit: "°C"
    },
    humidity: {
        icon: <WaterDropOutlined />,
        bg: `
        linear-gradient(115.04deg, rgba(217, 217, 217, 0.01), rgba(0, 163, 149, 0.12)) padding-box, 
        linear-gradient(#fff, #fff) padding-box, 
        linear-gradient(-64.53deg, rgba(11, 11, 15, 0.01), rgba(0, 163, 149, 0.1)) border-box`,
        iconBg: ' #e6fbf8',
        iconColor: '#00A395',
        unit: "%"
    },
    aqi: {
        icon: <AirOutlined />,
        bg: `
    linear-gradient(
      115.04deg,
      rgba(217, 217, 217, 0.01),
      rgba(3, 153, 0, 0.08)
    ) padding-box,

    linear-gradient(#fff, #fff) padding-box,

    linear-gradient(
      -64.53deg,
      rgba(11, 11, 15, 0.01),
      rgba(3, 153, 0, 0.1)
    ) border-box
  `,
        iconBg: '#e6f6e6 ',
        iconColor: '#039900',
        unit: "%"
    },
};

const smallStats = [
    {
        title: 'Lux',
        value: '500',
        unit: 'LX',
        icon: WbSunnyOutlinedIcon,
        iconBg: '#FFF2E4',
        iconColor: '#FF8A00',
    },
    {
        title: 'TDS',
        value: '500',
        unit: 'MG/L',
        icon: Grain,
        iconBg: '#f3f0ff',
        iconColor: '#7A5AF8',
    },
    {
        title: 'PH',
        value: '52%',
        unit: '',
        icon: OpacityOutlined,
        iconBg: '#FCE7F3',
        iconColor: '#DB2777',
    },
    {
        title: 'COD',
        value: '80',
        unit: 'MG/L',
        icon: WaterDropOutlined,
        iconBg: '#E8F3D8',
        iconColor: '#6B8E23',
    },
    {
        title: 'Noise',
        value: '95',
        unit: 'dBA',
        icon: GraphicEqOutlinedIcon,
        iconBg: '#EFEFEF',
        iconColor: '#5B5B66',
    },
];

const airQualityData = [
    { label: 'PM2.5', value: '30', unit: 'μg/m³' },
    { label: 'PM10', value: '30', unit: 'μg/m³' },
    { label: 'TSP', value: '30', unit: 'μg/m³' },
    { label: 'CO', value: '30', unit: 'ppm' },
    { label: 'NO2', value: '45', unit: 'ppm' },
    { label: 'SO2', value: '600', unit: 'ppm' },
    { label: 'O3', value: '150', unit: 'ppm' },
    { label: 'O2', value: '30', unit: '%' },
    { label: 'CH4', value: '30', unit: '%' },
    { label: 'H2', value: '30', unit: '%' },
    { label: 'H2S', value: '30', unit: 'ppb' },
    { label: 'NH3', value: '45', unit: 'μg' },
    { label: 'TVOC', value: '600', unit: 'μg' },
    { label: 'CO2', value: '150', unit: 'ppm' },
];

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
}: {
    value: string | number;
    label: string;
}) => {
    const key = String(label).toLowerCase();
    const cfg = topStats[key];

    return (
        <Box
            sx={{
                p: 2,
                borderRadius: "16px",

                background: cfg?.bg,
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

                        background: cfg?.iconBg,
                        color: cfg?.iconColor,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        border: "1px solid rgba(255,255,255,0.6)",

                        "& svg": {
                            fontSize: 26,
                        },
                    }}
                >
                    {cfg?.icon}
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
                        {value}{cfg?.unit}
                        {/* <Typography
                            component="span"
                            sx={{
                                fontSize: "0.9rem",
                                color: "#71717a",
                                fontWeight: 600,
                                ml: 0.4,
                            }}
                        >
                            
                        </Typography> */}
                    </Typography>
                </Box>
            </Box>

            {/* Status */}
            <StatusChip />
        </Box>
    );
};

const SmallStatCard = ({ item }: any) => {

    const Icon = item.icon;

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
                                backgroundColor: item.iconBg,
                                color: item.iconColor,
                                display: 'flex',
                                fontSize: 25,
                                padding: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Icon sx={{ fontSize: 16 }} />
                        </Box>

                        <Box>
                            <Typography sx={{
                                fontWeight: 500, fontSize: 12, color: "#666"
                            }}>
                                {item.title}
                            </Typography>
                            <Box sx={{
                                display: "flex", flexDirection: "row", gap: 0.5, alignItems: "baseline"
                            }}>
                                <Typography sx={{
                                    fontSize: 18, fontWeight: 700
                                }}>
                                    {item.value}
                                </Typography>
                                <Typography sx={{
                                    color: "#888",
                                    fontSize: 10
                                }}>
                                    {item.unit}
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
    const data = []
    console.log(data, "data")


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
                                {data?.icon || <InfoOutlined />}
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6 }}>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography sx={{
                                        fontWeight: 600,

                                    }}>
                                        {data?.name || "Johnson & Johnson"}
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

                                <Typography sx={{
                                    fontSize: "12px",
                                    color: "#4A4A4A"
                                }}>
                                    {data?.description || "Located at Chennai, Tamil Nadu, India"}
                                </Typography>

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
                                        {data?.totalDevices || 10} Devices
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
                                        {data?.activeDevices || 9} Active
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
                                        {data?.inactiveDevices || 1} Inactive
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
                <Grid
                    container
                    spacing={2}
                >
                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <InfoCard
                            value={data?.temperature}
                            label="Temperature"
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <InfoCard
                            value={data?.humidity}
                            label="Humidity"
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <InfoCard
                            value={data?.aqi}
                            label="Aqi"
                        />
                    </Grid>
                </Grid>

                {/* Small Stats */}
                <Paper
                    elevation={0}
                    sx={{

                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid #ECECEC',

                    }}
                >
                    <Grid container>
                        {smallStats.map((item) => (
                            <SmallStatCard key={item.title} item={item} />
                        ))}
                    </Grid>
                </Paper>

                {/* Air Quality Section */}
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
                        {airQualityData.map((item) => (
                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 12 / 7,

                                }}
                                spacing={"12px"}
                                key={item.label}
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
                                        }}
                                    >
                                        {item.label}
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
                                            {item.value}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: '#888',
                                                fontSize: 12,
                                            }}
                                        >
                                            {item.unit}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Box>
        </Box >
    );
}
