import { Role } from "../config/roles";
import Realtime from "../pages/realtime/RealTime";
import ViewDetail from "../pages/realtime/ViewDetail";
import AlertOverview from "../pages/alertAndThresholds/Alerts";
import AlertManagement from "../pages/alertManagement/AlertManagement";
import LocationManagement from "../pages/locationManagement/LocationManagement";
import DeviceManagement from "../pages/deviceManagement/DeviceManagement";
import UsersAndRoles from "../pages/usersAndRoles/UsersAndRoles";
import Historical from "../pages/historicalData/Historical";


type IrouteConfig = {
  path: string,
  element: any,
  roles: string[]
}


const routesConfig: IrouteConfig[] = [
  {
    path: "/realtime",
    element: Realtime,
    roles: [Role.ADMIN, Role.MANAGER, Role.VIEWER],
  },

  {
    path: "view-detail/:id",
    element: ViewDetail,
    roles: [Role.ADMIN, Role.MANAGER, Role.VIEWER],
  },

  {
    path: "alerts-thresholds",
    element: AlertOverview,
    roles: [Role.ADMIN, Role.MANAGER, Role.VIEWER],
  },
  {
    path: "alert-management",
    element: AlertManagement,
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    path: "location-management",
    element: LocationManagement,
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    path: "device-management",
    element: DeviceManagement,
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    path: "users",
    element: UsersAndRoles,
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    path: "historical",
    element: Historical,
    roles: [Role.ADMIN, Role.MANAGER, Role.VIEWER],
  },
];

export default routesConfig