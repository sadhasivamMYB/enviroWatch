import { locationApi } from "../services/Api/location.api";
import { alertsApi } from "../services/Api/alerts.api";
import { sensorsApi } from "../services/Api/sensors.api";
import { loginApi } from "../services/Api/login.api";
import { devicesApi } from "../services/Api/device.api";
import { metricsApi } from "../services/Api/metrics";
import { dashboardApi } from "../services/Api/dashboard.api";
import { historicalApi } from "../services/Api/historical";
import { usersApi } from "../services/Api/users.api";
import { roleApi } from "../services/Api/roles.api";
export const apiSlice = [
    locationApi, alertsApi, sensorsApi, loginApi, devicesApi, metricsApi, dashboardApi, historicalApi, usersApi, roleApi];

