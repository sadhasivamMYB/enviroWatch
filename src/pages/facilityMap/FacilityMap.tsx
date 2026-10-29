import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Chip, GlobalStyles, IconButton, Typography } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { CONTENT_ZOOM } from "../../config/layout";
import { FACILITY_IMAGE } from "../../config/facilityZones";
import { STATUS_COLORS } from "../../config/status";
import { useFacilityData } from "../../hooks/useFacilityData";
import { buildZones } from "./zoneUtils";
import ZoneCard from "./ZoneCard";
import HighlightLocationCard from "../../components/HighlightLocationCard";
import { findHighlightLocation } from "../../config/highlightLocation";

const ROTATE_MS = 5000;
const ACCENT = "#003632";

// Position a label on one side of its pin, `gap` px away from the pin.
const labelPlacement = (pos: "top" | "bottom" | "left" | "right", gap: number) => {
  switch (pos) {
    case "top":
      return { bottom: "100%", left: "50%", transform: "translateX(-50%)", mb: `${gap}px` };
    case "left":
      return { right: "100%", top: "50%", transform: "translateY(-50%)", mr: `${gap}px` };
    case "right":
      return { left: "100%", top: "50%", transform: "translateY(-50%)", ml: `${gap}px` };
    default:
      return { top: "100%", left: "50%", transform: "translateX(-50%)", mt: `${gap}px` };
  }
};

// publicMode: the open /facility-map/live page. Always in display mode, reads the public endpoint,
// and never leaves display mode (no Esc/exit handling, no login).
const FacilityMap = ({ publicMode = false }: { publicMode?: boolean }) => {
  const [params, setParams] = useSearchParams();
  const { locations, updatedAt, now, isStale, counts } = useFacilityData(publicMode);
  const tv = publicMode || params.get("mode") === "fullscreen";
  const edit = params.get("edit") === "1";
  const filter = params.get("metric") ?? "all";
  const [selectedId, setSelectedId] = useState<string>(params.get("zone") ?? "");
  const [picked, setPicked] = useState("");
  const [cursorHidden, setCursorHidden] = useState(true);
  const cardScrollRef = useRef<HTMLDivElement>(null);

  const zones = useMemo(() => buildZones(locations), [locations]);
  const alarmZones = zones.filter((z) => z.status === "alert");
  const selected = zones.find((z) => z.id === selectedId) ?? alarmZones[0] ?? zones[0];

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => (v === null ? next.delete(k) : next.set(k, v)));
      setParams(next, { replace: true });
    },
    [params, setParams]
  );

  const select = (id: string) => {
    setSelectedId(id);
    update({ zone: id });
  };

  // TV mode: highlight each zone in turn for ROTATE_MS. The timer restarts on every
  // change of selection, so a manual pick also gets its full time.
  const selectedKey = selected?.id;
  useEffect(() => {
    if (!tv || zones.length === 0) return;
    const t = window.setTimeout(() => {
      const idx = zones.findIndex((z) => z.id === selectedKey);
      setSelectedId(zones[(idx + 1) % zones.length].id);
    }, ROTATE_MS);
    return () => window.clearTimeout(t);
  }, [tv, zones.length, selectedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Card taller than the column: scroll it inside the column. In TV mode nobody can scroll,
  // so glide from top to bottom while the zone is highlighted.
  useEffect(() => {
    const el = cardScrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
    const overflow = el.scrollHeight - el.clientHeight;
    if (!tv || overflow <= 0) return;
    const start = performance.now();
    const duration = ROTATE_MS * 0.7;
    let raf = 0;
    const step = (t: number) => {
      el.scrollTop = Math.min(1, (t - start) / duration) * overflow;
      if (t - start < duration) raf = requestAnimationFrame(step);
    };
    const delay = window.setTimeout(() => (raf = requestAnimationFrame(step)), ROTATE_MS * 0.15);
    return () => {
      window.clearTimeout(delay);
      cancelAnimationFrame(raf);
    };
  }, [tv, selectedKey, filter]);

  // Keep the URL mode in sync when the user leaves browser fullscreen with Esc.
  useEffect(() => {
    if (publicMode) return;
    const onChange = () => {
      if (!document.fullscreenElement && tv) update({ mode: null });
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [tv, update, publicMode]);

  useEffect(() => {
    if (!tv || publicMode) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && update({ mode: null });
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tv, update, publicMode]);

  // TV mode: hide the mouse pointer, show it while the mouse is moving, hide again after 2s idle.
  useEffect(() => {
    if (!tv) return;
    let t: number;
    const onMove = () => {
      setCursorHidden(false);
      window.clearTimeout(t);
      t = window.setTimeout(() => setCursorHidden(true), 2000);
    };
    onMove();
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.clearTimeout(t);
    };
  }, [tv]);

  // Keep the office display awake in TV mode.
  useEffect(() => {
    if (!tv || !("wakeLock" in navigator)) return;
    let lock: any;
    (navigator as any).wakeLock.request("screen").then((l: any) => (lock = l)).catch(() => {});
    return () => lock?.release?.().catch(() => {});
  }, [tv]);

  // Public page: browser full screen on request (a page cannot enter it on its own at load).
  const toggleBrowserFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const toggleTv = () => {
    if (tv) {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      update({ mode: null });
    } else {
      update({ mode: "fullscreen" });
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
  };

  const metricChips = useMemo(() => {
    const seen = new Map<string, string>();
    zones.forEach((z) => z.members.forEach((m) => m.metrics.forEach((x) => seen.set(x.key, x.name))));
    return [["all", "All"], ["alarms", "Alarms"], ...seen.entries()];
  }, [zones]);

  const alarmCount = counts.alerts;

  return (
    <Box
      sx={{
        position: tv ? "fixed" : "relative",
        inset: tv ? 0 : "auto",
        zIndex: tv ? 1400 : "auto",
        height: tv ? "100vh" : `calc((100vh - 64px) / ${CONTENT_ZOOM})`,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        p: tv ? 2 : 0,
        color: "#111827",
      }}
    >
      <GlobalStyles
        styles={{
          ...(tv && cursorHidden ? { "*": { cursor: "none !important" } } : {}),
          "@keyframes fmPulse": { "0%": { transform: "scale(1)", opacity: 0.7 }, "100%": { transform: "scale(2.6)", opacity: 0 } },
          "@keyframes fmFlash": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.6 } },
          "@keyframes fmProgress": { from: { width: "0%" }, to: { width: "100%" } },
        }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 1 }}>
        <Typography sx={{ fontWeight: 600, fontSize: "22px" }}>Facility Map</Typography>
        <Chip
          size="small"
          label={isStale ? "Stale data" : "Live"}
          sx={{ bgcolor: isStale ? "#ca8a04" : STATUS_COLORS.normal.main, color: "#fff", fontWeight: 600 }}
        />
        <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
          {counts.total} locations ·{" "}
          <span style={{ color: STATUS_COLORS.alert.text }}>{counts.alerts} alerts</span> ·{" "}
          <span style={{ color: STATUS_COLORS.normal.text }}>{counts.normal} normal</span> ·{" "}
          <span style={{ color: STATUS_COLORS.inactive.text }}>{counts.inactive} inactive</span>
          {updatedAt ? ` · synced ${new Date(updatedAt).toLocaleTimeString()}` : ""}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
          {metricChips.map(([key, label]) => (
            <Chip
              key={key}
              size="small"
              label={label}
              onClick={() => update({ metric: key === "all" ? null : key })}
              sx={{
                display: tv && filter !== key ? "none" : "flex",
                border: "1px solid #007A70",
                bgcolor: filter === key ? "#007A70" : "#fff",
                color: filter === key ? "#fff" : "#007A70",
                "&:hover": { bgcolor: filter === key ? "#007A70" : "#e6fbf8" },
              }}
            />
          ))}
        </Box>
        <Typography sx={{ fontSize: tv ? 22 : 14, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
          {new Date(now).toLocaleTimeString()}
        </Typography>
        {publicMode && (
          <IconButton
            onClick={toggleBrowserFullscreen}
            aria-label="Full screen"
            sx={{ color: ACCENT, visibility: cursorHidden ? "hidden" : "visible" }}
          >
            <FullscreenIcon />
          </IconButton>
        )}
        {!tv && (
          <IconButton onClick={toggleTv} sx={{ color: ACCENT }} aria-label="Full screen">
            <FullscreenIcon />
          </IconButton>
        )}
      </Box>

      {(isStale || alarmCount > 0) && (
        <Box
          sx={{
            mb: 1,
            px: 2,
            py: 0.8,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 14,
            color: "#fff",
            bgcolor: isStale ? "#ca8a04" : STATUS_COLORS.alert.main,
            animation: alarmCount && !isStale ? "fmFlash 1.2s infinite" : "none",
          }}
        >
          {isStale
            ? "Data connection lost — values may be out of date"
            : `Alarm: ${alarmZones.map((z) => `${z.name} (${z.alarmCount})`).join(" · ")}`}
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          overflowY: { xs: "auto", md: "visible" },
        }}
      >
        <Box sx={{ flex: { xs: "none", md: 1 }, minWidth: 0, minHeight: 0, alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 1.5 }}>
          {/* Boiler & WTP air quality stays above the map while the zone card on the right rotates */}
          <Box sx={{ flexShrink: 0 }}>
            <HighlightLocationCard location={findHighlightLocation(locations)} variant="banner" />
          </Box>
        <Box
          sx={{
            flex: { xs: "none", md: 1 },
            height: { xs: `calc(((100vw / ${tv ? 1 : CONTENT_ZOOM}) - 32px) * ${FACILITY_IMAGE.height / FACILITY_IMAGE.width})`, md: "auto" },
            minWidth: 0,
            minHeight: 0,
            containerType: "size",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            background: "linear-gradient(200deg, #f0fdf4 0%, #ffffff 70%)",
          }}
        >
          <Box
            onClick={
              edit
                ? (e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const pt = `x: ${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}, y: ${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}`;
                    setPicked(pt);
                    console.log(pt);
                  }
                : undefined
            }
            sx={{
              position: "relative",
              aspectRatio: `${FACILITY_IMAGE.width} / ${FACILITY_IMAGE.height}`,
              width: `min(100cqw, 100cqh * ${FACILITY_IMAGE.width / FACILITY_IMAGE.height})`,
            }}
          >
            <Box component="img" src={FACILITY_IMAGE.src} alt="Plant" sx={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }} />
            {zones.map((z) => {
              const c = STATUS_COLORS[z.status];
              const active = z.id === selected?.id;
              return (
                <Box
                  key={z.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    select(z.id);
                  }}
                  sx={{
                    position: "absolute",
                    left: `${z.x}%`,
                    top: `${z.y}%`,
                    transform: "translate(-50%,-50%)",
                    cursor: "pointer",
                    zIndex: active ? 2 : 1,
                  }}
                >
                  <Box sx={{ position: "absolute", inset: 0, borderRadius: "50%", bgcolor: c.main, animation: "fmPulse 1.8s infinite" }} />
                  {active && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: -9,
                        borderRadius: "50%",
                        border: `3px solid ${ACCENT}`,
                        bgcolor: "rgba(255,255,255,0.35)",
                        boxShadow: `0 0 0 4px ${c.soft}`,
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      position: "relative",
                      width: active ? 22 : 16,
                      height: active ? 22 : 16,
                      borderRadius: "50%",
                      bgcolor: c.main,
                      border: "2px solid #fff",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.35)",
                      transition: "all .25s",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      ...labelPlacement(z.labelPos, active ? 15 : 10),
                      px: "0.6em",
                      py: "0.15em",
                      whiteSpace: "nowrap",
                      // sized with the map so names stay large on a TV and never wrap
                      fontSize: `clamp(8px, ${active ? 1.9 : 1.7}cqw, 28px)`,
                      fontWeight: 600,
                      lineHeight: 1.25,
                      borderRadius: 1,
                      color: active ? "#fff" : "#111827",
                      bgcolor: active ? ACCENT : "rgba(255,255,255,0.95)",
                      border: `1px solid ${active ? ACCENT : "#d1d5db"}`,
                    }}
                  >
                    {z.name}
                  </Box>
                </Box>
              );
            })}
            {edit && picked && (
              <Box sx={{ position: "absolute", left: 8, bottom: 8, px: 1, borderRadius: 1, bgcolor: "#111827", color: "#fff", fontSize: 12 }}>
                {picked}
              </Box>
            )}
          </Box>
        </Box>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: tv ? 460 : 380 },
            flexShrink: 0,
            alignSelf: { md: "stretch" },
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: { md: "center" },
          }}
        >
          {tv && selected && (
            <Box sx={{ height: 4, borderRadius: 2, bgcolor: "#e5e7eb", mb: 1, overflow: "hidden" }}>
              <Box
                key={selected.id}
                sx={{ height: "100%", bgcolor: "#007A70", animation: `fmProgress ${ROTATE_MS}ms linear forwards` }}
              />
            </Box>
          )}
          <Box ref={cardScrollRef} sx={{ minHeight: 0, overflowY: "auto", borderRadius: 3, scrollbarWidth: "thin" }}>
            {selected && <ZoneCard zone={selected} filter={filter} large={tv} />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FacilityMap;
