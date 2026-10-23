import { Box, Chip, Typography } from "@mui/material";
import { STATUS_COLORS } from "../../config/status";
import type { ZoneData } from "./zoneUtils";

type Props = { zone: ZoneData; filter: string; large?: boolean };

const matches = (filter: string, m: { key: string; status: string }) =>
  filter === "all" || (filter === "alarms" ? m.status === "alert" : m.key === filter);

// Zones with many locations switch to a compact layout so the card stays short; whatever
// still does not fit scrolls inside the card column (see FacilityMap).
const ZoneCard = ({ zone, filter, large }: Props) => {
  const c = STATUS_COLORS[zone.status];
  const compact = zone.members.length > 3;
  const fs = large ? (compact ? 1.05 : 1.25) : compact ? 0.9 : 1;
  return (
    <Box
      sx={{
        p: compact ? 1.5 : 2,
        borderRadius: 3,
        background: c.cardBg,
        border: `1px solid ${c.border}`,
        boxShadow: `0 4px 20px ${c.soft}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
        <Typography sx={{ fontSize: 20 * fs, fontWeight: 600, color: "#111827" }}>{zone.name}</Typography>
        <Chip
          size="small"
          label={zone.alarmCount ? `${zone.alarmCount} Alarm${zone.alarmCount > 1 ? "s" : ""}` : c.label}
          sx={{ bgcolor: c.main, color: "#fff", fontWeight: 600, fontSize: 12 * fs }}
        />
      </Box>
      <Typography sx={{ fontSize: 13 * fs, color: "#6b7280", mb: compact ? 1 : 1.5 }}>
        {zone.members.length} location{zone.members.length > 1 ? "s" : ""}
      </Typography>

      {zone.members.map((member) => {
        const rows = member.metrics.filter((m) => matches(filter, m));
        if (filter !== "all" && rows.length === 0) return null;
        return (
          <Box key={member.name} sx={{ mb: compact ? 0.8 : 1.2, p: compact ? 0.9 : 1.2, borderRadius: 2, bgcolor: "#fff", border: "1px solid #e5e7eb" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: compact ? 0.5 : 0.8 }}>
              <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: STATUS_COLORS[member.status].main }} />
              <Typography sx={{ fontSize: 14 * fs, fontWeight: 600, color: "#111827" }}>{member.name}</Typography>
            </Box>
            {member.metrics.length === 0 ? (
              <Typography sx={{ fontSize: 12 * fs, color: "#6b7280" }}>{member.matched ? "No readings" : "Location not found in system"}</Typography>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${compact ? 74 : 96}px, 1fr))`, gap: compact ? 0.6 : 0.8 }}>
                {rows.map((m) => (
                  <Box
                    key={m.key}
                    sx={{
                      p: compact ? 0.5 : 0.8,
                      borderRadius: 1.5,
                      border: `1px solid ${STATUS_COLORS[m.status].border}`,
                      bgcolor: STATUS_COLORS[m.status].soft,
                    }}
                  >
                    <Typography sx={{ fontSize: 11 * fs, color: "#6b7280" }}>{m.name}</Typography>
                    <Typography sx={{ fontSize: 18 * fs, fontWeight: 600, color: STATUS_COLORS[m.status].text }}>
                      {m.value}
                      <Box component="span" sx={{ fontSize: 11 * fs, ml: 0.4, color: "#6b7280", fontWeight: 400 }}>
                        {m.unit}
                      </Box>
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default ZoneCard;
