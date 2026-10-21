import { FACILITY_ZONES, type FacilityZone } from "../../config/facilityZones";
import { toStatusKey, worstStatus, type StatusKey } from "../../config/status";

export type ZoneMetric = { key: string; name: string; value: number | string; unit: string; status: StatusKey };
export type ZoneMember = { name: string; matched: boolean; status: StatusKey; metrics: ZoneMetric[] };
export type ZoneData = FacilityZone & { status: StatusKey; alarmCount: number; members: ZoneMember[] };

export const buildZones = (locations: any[]): ZoneData[] => {
  const byName = new Map(locations.map((l) => [String(l.location_name).trim().toLowerCase(), l]));
  return FACILITY_ZONES.map((zone) => {
    const members: ZoneMember[] = zone.locations.map((name) => {
      const loc = byName.get(name.toLowerCase());
      if (!loc) return { name, matched: false, status: "inactive", metrics: [] };
      const metrics: ZoneMetric[] = (loc.devices ?? []).flatMap((d: any) =>
        (d.metrics ?? []).map((m: any) => ({
          key: m.metric_key,
          // Same label order as the Realtime page's FacilityCard.
          name: m.display_name || m.metric_name || m.metric_key,
          value: m.latest_value ?? "--",
          unit: m.unit ?? "",
          status: toStatusKey(m.status),
        }))
      );
      // Same rule as the Realtime page: the backend's status list for the location.
      const statuses: string[] = loc.status ?? [];
      const status: StatusKey = statuses.includes("alert")
        ? "alert"
        : statuses.includes("inactive")
          ? "inactive"
          : "normal";
      return { name, matched: true, status, metrics };
    });
    return {
      ...zone,
      members,
      status: worstStatus(members.map((m) => m.status)),
      alarmCount: members.reduce((n, m) => n + m.metrics.filter((x) => x.status === "alert").length, 0),
    };
  });
};
