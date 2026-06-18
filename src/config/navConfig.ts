// src/config/navConfig.ts
import { Role } from "./roles";

export const navItems = [
  {
    label: "Realtime Monitoring",
    path: "/realtime",
    icon: "monitoring", // map this to MUI icon later
    roles: [Role.ADMIN, Role.MANAGER, Role.VIEWER],
  },
  {
    label: "Alerts & Thresholds",
    path: "/alerts-thresholds",
    icon: "alerts",
    roles: [Role.ADMIN, Role.MANAGER, Role.VIEWER],
  },
  {
    label: "Alert Management",
    path: "/alert-management",
    icon: "shield",
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    label: "Historical Data & Trends",
    path: "/historical",
    icon: "trends",
    roles: [Role.ADMIN, Role.MANAGER, Role.VIEWER],
  },
  {
    label: "Locations Management",
    path: "/location-management",
    icon: "locations",
    roles: [Role.ADMIN],
  },
  {
    label: "Devices Management",
    path: "/device-management",
    icon: "devices",
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    label: "Users & Roles",
    path: "/users",
    icon: "users",
    roles: [Role.ADMIN],
  },
];