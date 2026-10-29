import { useEffect, useMemo, useState } from "react";
import { useGetDashboardQuery } from "../services/Api/dashboard.api";
import { BaseURL } from "../env";

export const POLL_MS = 10000;
export const STALE_AFTER_MS = 30000;

const PUBLIC_URL = `${BaseURL}/api/v1/public/facility-map`;

/**
 * Live facility data, polled every POLL_MS. Counts use the same rules as the Realtime page.
 *
 * Normal (logged-in) use reads the /dashboard endpoint through the shared API slice.
 * With `publicMode` it reads the open /public/facility-map endpoint with a plain fetch: no
 * login token is sent and a failed request never redirects to the login page, so a wall
 * display keeps retrying until the backend is back. Both return the same shape.
 */
export const useFacilityData = (publicMode = false) => {
  const api = useGetDashboardQuery(undefined, { pollingInterval: POLL_MS, skip: publicMode });

  const [pub, setPub] = useState<{ data: any; isError: boolean; updatedAt: number }>({
    data: undefined,
    isError: false,
    updatedAt: 0,
  });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!publicMode) return;
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(PUBLIC_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (alive) setPub({ data, isError: false, updatedAt: Date.now() });
      } catch {
        // keep the last good data on screen; the stale banner takes over after STALE_AFTER_MS
        if (alive) setPub((p) => ({ ...p, isError: true }));
      }
    };
    load();
    const id = window.setInterval(load, POLL_MS);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [publicMode]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const data = publicMode ? pub.data : api.data;
  const isError = publicMode ? pub.isError : api.isError;
  const isLoading = publicMode ? pub.updatedAt === 0 && !pub.isError : api.isLoading;
  const updatedAt = (publicMode ? pub.updatedAt : api.fulfilledTimeStamp) ?? 0;

  const locations: any[] = useMemo(() => data?.locations ?? [], [data]);

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
