import { Box, Chip, Link, Typography } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { STATUS_COLORS, toStatusKey, type StatusKey } from "../config/status";
import { HIGHLIGHT_LOCATION } from "../config/highlightLocation";
import AqiScale from "./AqiScale";

type Props = {
  /** Location object from the /dashboard response; omit to show a "not found" placeholder. */
  location?: any;
  /**
   * full   - AQI scale plus every other sensor reading (Realtime page).
   * banner - AQI scale only, one row (above the Facility Map). Its colour follows the AQI reading.
   */
  variant?: "full" | "banner";
  onViewDetails?: (id: string) => void;
};

const locationStatus = (statuses: string[]): StatusKey =>
  statuses.includes("alert") ? "alert" : statuses.includes("inactive") ? "inactive" : "normal";

const HighlightLocationCard = ({ location, variant = "full", onViewDetails }: Props) => {
  const banner = variant === "banner";
  const name = location?.location_name ?? HIGHLIGHT_LOCATION;

  const all: any[] = (location?.devices ?? []).flatMap((d: any) => d?.metrics ?? []).filter((m: any) => m?.metric_key);
  const unique = all.filter((m, i) => all.findIndex((x) => x.metric_key === m.metric_key) === i);
  const aqi = unique.find((m) => String(m.metric_key).toLowerCase() === "aqi");
  const others = unique.filter((m) => m !== aqi);
  const aqiValue = aqi?.latest_value != null ? Number(aqi.latest_value) : null;

  // The banner is about the AQI reading: green when it is reporting normally, red in alert,
  // grey when there is no reading. The full card keeps using the location's overall status.
  const status: StatusKey = banner
    ? aqiValue === null
      ? "inactive"
      : toStatusKey(aqi?.status)
    : locationStatus(location?.status ?? []);
  const c = STATUS_COLORS[status];
  const chip = (
    <Chip
      size="small"
      label={location ? c.label : "Not found"}
      sx={{ ml: banner ? 0 : "auto", bgcolor: location ? c.main : "#6b7280", color: "#fff", fontWeight: 600, borderRadius: 2 }}
    />
  );
  const title = (
    <Box>
      <Typography sx={{ fontSize: banner ? 20 : 22, fontWeight: 600, lineHeight: 1.15, color: "#111827" }}>{name}</Typography>
      {location?.description && <Typography sx={{ fontSize: 12, color: "#6b7280" }}>{location.description}</Typography>}
    </Box>
  );

  return (
    <Box
      sx={{
        borderRadius: banner ? 3 : "20px",
        p: banner ? 1.5 : 2.5,
        background: c.cardBg,
        border: `1px solid ${c.border}`,
        boxShadow: `0 4px 20px ${c.soft}`,
      }}
    >
      {banner ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, minWidth: 130 }}>
            {title}
            {chip}
          </Box>
          <Box sx={{ flex: 1, minWidth: 260 }}>
            {location ? (
              <AqiScale value={aqiValue} compact />
            ) : (
              <Typography sx={{ fontSize: 13, color: "#6b7280" }}>Location not found in system</Typography>
            )}
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            {title}
            {chip}
          </Box>
          {!location ? (
            <Typography sx={{ fontSize: 13, color: "#6b7280" }}>Location not found in system</Typography>
          ) : (
            <>
              <AqiScale value={aqiValue} />
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 1.2, mt: 1.5 }}>
                {others.map((m) => {
                  const alert = String(m.status).toLowerCase() === "alert";
                  return (
                    <Box
                      key={m.metric_key}
                      sx={{
                        bgcolor: alert ? STATUS_COLORS.alert.soft : "#fff",
                        border: `1px solid ${alert ? STATUS_COLORS.alert.border : "#e5e7eb"}`,
                        borderRadius: 2,
                        px: 1.5,
                        py: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 20, fontWeight: 600, color: alert ? STATUS_COLORS.alert.text : "#111827" }}>
                        {m.latest_value ?? "--"}
                        <Box component="span" sx={{ fontSize: 12, fontWeight: 400, color: "#6b7280", ml: 0.4 }}>
                          {m.unit}
                        </Box>
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: "#6b7280" }}>{m.display_name || m.metric_name || m.metric_key}</Typography>
                    </Box>
                  );
                })}
              </Box>
              {onViewDetails && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
                  <Link
                    component="button"
                    underline="none"
                    onClick={() => onViewDetails(location.location_id)}
                    sx={{ fontSize: 12, color: "#333", display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    View Details <ArrowForward sx={{ fontSize: 14 }} />
                  </Link>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default HighlightLocationCard;
