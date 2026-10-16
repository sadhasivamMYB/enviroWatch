// src/config/iconMap.ts
import InterestsOutlinedIcon from '@mui/icons-material/InterestsOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import TimelineIcon from "@mui/icons-material/TimelineOutlined";
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import MemoryIcon from "@mui/icons-material/MemoryOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

export const iconMap: Record<string, React.ElementType> = {
  monitoring: InterestsOutlinedIcon,
  map: MapOutlinedIcon,
  alerts: NotificationsActiveOutlinedIcon,
  shield: GppMaybeOutlinedIcon,
  trends: TimelineIcon,
  locations: HomeWorkOutlinedIcon,
  devices: MemoryIcon,
  users: PeopleIcon,
};