import { Box, Typography } from "@mui/material";

// US EPA AQI bands. Each segment's width on the bar is its range / 500, so the bar is linear.
const BANDS = [
  { max: 50, label: "Good", range: "0-50", color: "#00b050", bg: "#dcfce7", text: "#166534" },
  { max: 100, label: "Moderate", range: "51-100", color: "#f5d000", bg: "#fef9c3", text: "#854d0e" },
  { max: 150, label: "Unhealthy for sensitive", range: "101-150", color: "#ff7e00", bg: "#ffedd5", text: "#9a3412" },
  { max: 200, label: "Unhealthy", range: "151-200", color: "#e53935", bg: "#fee2e2", text: "#991b1b" },
  { max: 300, label: "Very unhealthy", range: "201-300", color: "#8f3f97", bg: "#f3e8ff", text: "#6b21a8" },
  { max: 500, label: "Hazardous", range: "301-500", color: "#7e0023", bg: "#fce7f3", text: "#7e0023" },
];
const TICKS = [0, 100, 200, 300, 500];
const MAX = 500;

export const aqiBand = (v: number) => BANDS.find((b) => v <= b.max) ?? BANDS[BANDS.length - 1];

type Props = { value?: number | null; compact?: boolean };

/** AQI shown on a coloured scale with a pointer at the current reading. */
const AqiScale = ({ value, compact }: Props) => {
  const has = typeof value === "number" && !Number.isNaN(value);
  const band = has ? aqiBand(value) : null;
  const pct = has ? (Math.min(Math.max(value, 0), MAX) / MAX) * 100 : 0;
  const prev = (i: number) => (i === 0 ? 0 : BANDS[i - 1].max);

  return (
    <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: 3, p: compact ? 1.2 : 2, pb: compact ? 1 : 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, flexWrap: "wrap", mb: 0.5 }}>
        <Typography sx={{ fontSize: compact ? 12 : 13, color: "#6b7280" }}>Air Quality Index</Typography>
        <Typography sx={{ fontSize: compact ? 24 : 34, fontWeight: 700, lineHeight: 1, color: "#111827" }}>
          {has ? value : "--"}
        </Typography>
        {band ? (
          <Box sx={{ fontSize: compact ? 12 : 14, fontWeight: 600, px: 1.2, py: 0.2, borderRadius: 1.5, bgcolor: band.bg, color: band.text }}>
            {band.label}
          </Box>
        ) : (
          <Typography sx={{ fontSize: 12, color: "#6b7280" }}>No AQI reading</Typography>
        )}
      </Box>

      <Box sx={{ position: "relative", pt: compact ? "26px" : "34px" }}>
        {has && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: `${pct}%`,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "left .6s",
            }}
          >
            <Box sx={{ fontSize: compact ? 11 : 12, fontWeight: 700, bgcolor: "#111827", color: "#fff", px: 1, borderRadius: 1.5 }}>{value}</Box>
            <Box sx={{ width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "9px solid #111827" }} />
          </Box>
        )}
        <Box sx={{ display: "flex", height: compact ? 12 : 16, borderRadius: 2, overflow: "hidden" }}>
          {BANDS.map((b, i) => (
            <Box key={b.label} sx={{ width: `${((b.max - prev(i)) / MAX) * 100}%`, bgcolor: b.color }} />
          ))}
        </Box>
        <Box sx={{ position: "relative", height: 18, mt: 0.5, fontSize: 11, color: "#6b7280" }}>
          {TICKS.map((t) => (
            <Box
              key={t}
              component="span"
              sx={{ position: "absolute", left: `${(t / MAX) * 100}%`, transform: t === 0 ? "none" : t === MAX ? "translateX(-100%)" : "translateX(-50%)" }}
            >
              {t}
            </Box>
          ))}
        </Box>
      </Box>

      {!compact && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", mt: 1, fontSize: 11, color: "#6b7280" }}>
          {BANDS.map((b) => (
            <Box key={b.label} sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
              <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: b.color }} />
              {b.label} {b.range}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AqiScale;
