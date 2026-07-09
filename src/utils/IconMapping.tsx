import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import DeviceThermostatOutlinedIcon from "@mui/icons-material/DeviceThermostatOutlined";
import OpacityOutlinedIcon from "@mui/icons-material/OpacityOutlined";
import GrainOutlinedIcon from "@mui/icons-material/GrainOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import GraphicEqOutlinedIcon from "@mui/icons-material/GraphicEqOutlined";
import BlurOnOutlinedIcon from "@mui/icons-material/BlurOnOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AirOutlinedIcon from "@mui/icons-material/AirOutlined";
import Co2OutlinedIcon from "@mui/icons-material/Co2Outlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import WavesOutlinedIcon from "@mui/icons-material/WavesOutlined";
import BubbleChartOutlinedIcon from "@mui/icons-material/BubbleChartOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";

const defaultConfig = {
    icon: SensorsOutlinedIcon,
    iconBg: "#F3F4F6",
    iconColor: "#6B7280",
};

const sensorConfig = {
    lux: {
        icon: WbSunnyOutlinedIcon,
        iconBg: "#FFF2E4",
        iconColor: "#FF8A00",
    },

    temperature: {
        icon: DeviceThermostatOutlinedIcon,
        iconBg: "#FEE2E2",
        iconColor: "#DC2626",
    },

    humidity: {
        icon: OpacityOutlinedIcon,
        iconBg: "#DBEAFE",
        iconColor: "#2563EB",
    },

    tds: {
        icon: GrainOutlinedIcon,
        iconBg: "#F3F0FF",
        iconColor: "#7A5AF8",
    },

    ph: {
        icon: ScienceOutlinedIcon,
        iconBg: "#FCE7F3",
        iconColor: "#DB2777",
    },

    cod: {
        icon: WaterDropOutlinedIcon,
        iconBg: "#E8F3D8",
        iconColor: "#6B8E23",
    },

    noise: {
        icon: GraphicEqOutlinedIcon,
        iconBg: "#EFEFEF",
        iconColor: "#5B5B66",
    },

    "pm2.5": {
        icon: BlurOnOutlinedIcon,
        iconBg: "#E0F2FE",
        iconColor: "#0284C7",
    },

    pm10: {
        icon: BlurOnOutlinedIcon,
        iconBg: "#E0F2FE",
        iconColor: "#0284C7",
    },

    tsp: {
        icon: CloudOutlinedIcon,
        iconBg: "#F3F4F6",
        iconColor: "#64748B",
    },

    co2: {
        icon: Co2OutlinedIcon,
        iconBg: "#DCFCE7",
        iconColor: "#15803D",
    },

    tvoc: {
        icon: AirOutlinedIcon,
        iconBg: "#EDE9FE",
        iconColor: "#7C3AED",
    },

    co: {
        icon: AirOutlinedIcon,
        iconBg: "#FEF3C7",
        iconColor: "#D97706",
    },

    no2: {
        icon: AirOutlinedIcon,
        iconBg: "#FFE4E6",
        iconColor: "#E11D48",
    },

    so2: {
        icon: AirOutlinedIcon,
        iconBg: "#FCE7F3",
        iconColor: "#BE185D",
    },

    o3: {
        icon: WavesOutlinedIcon,
        iconBg: "#E0F7FA",
        iconColor: "#0891B2",
    },

    o2: {
        icon: BubbleChartOutlinedIcon,
        iconBg: "#ECFEFF",
        iconColor: "#0EA5E9",
    },

    ch4: {
        icon: LocalFireDepartmentOutlinedIcon,
        iconBg: "#FFF7ED",
        iconColor: "#EA580C",
    },

    h2: {
        icon: LocalFireDepartmentOutlinedIcon,
        iconBg: "#FFF7ED",
        iconColor: "#EA580C",
    },

    h2s: {
        icon: AirOutlinedIcon,
        iconBg: "#F3E8FF",
        iconColor: "#9333EA",
    },

    nh3: {
        icon: AirOutlinedIcon,
        iconBg: "#DCFCE7",
        iconColor: "#16A34A",
    },
};

type SensorKey = keyof typeof sensorConfig;

export const getSensorConfig = (metricKey: string) => {
    const key = metricKey.toLowerCase() as SensorKey;

    return sensorConfig[key] ?? defaultConfig;
};