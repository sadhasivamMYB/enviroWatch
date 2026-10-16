import { useEffect, useMemo, useState } from "react";
import { useGetDashboardQuery } from "../services/Api/dashboard.api";

export const POLL_MS = 10000;
export const STALE_AFTER_MS = 30000;

/**
 * Live facility data from the same /dashboard endpoint as the Realtime Monitoring page,
 * polled every POLL_MS. Counts use the same rules as that page.
 */
export const useFacilityData = () => {
  const { data, isLoading, isError, fulfilledTimeStamp } = useGetDashboardQuery(undefined, {
    pollingInterval: POLL_MS,
  });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const locations: any[] = useMemo(() => data?.locations ?? [], [data]);
  const updatedAt = fulfilledTimeStamp ?? 0;

  return {
    locations,
    isLoading,
    updatedAt,
    now,
    isStale: isError || (updatedAt > 0 && now - updatedAt > STALE_AFTER_MS),
    counts: {
      total: data?.summary?.total_locations ?? 0,
      alerts: data?.summary?.active_alerts ?? 0,
      normal: locations.filter((l) => (l.status || []).includes("normal")).length,
      inactive: locations.filter((l) => (l.status || []).includes("inactive")).length,
    },
  };
};
