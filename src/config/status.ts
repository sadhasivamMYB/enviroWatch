export type StatusKey = "normal" | "alert" | "inactive";

// Same palette and card gradients as the Realtime page's FacilityCard.
export const STATUS_COLORS: Record<
  StatusKey,
  { main: string; text: string; soft: string; border: string; cardBg: string; label: string }
> = {
  normal: {
    main: "#22c55e",
    text: "#15803d",
    soft: "rgba(34,197,94,0.12)",
    border: "#bbf7d0",
    cardBg: "linear-gradient(200deg, #dcfce7 0%, #ffffff 70%)",
    label: "Normal",
  },
  alert: {
    main: "#ef4444",
    text: "#dc2626",
    soft: "rgba(239,68,68,0.12)",
    border: "#fecdd3",
    cardBg: "linear-gradient(200deg, #ffe4e6 0%, #ffffff 70%)",
    label: "Alert",
  },
  inactive: {
    main: "#6b7280",
    text: "#6b7280",
    soft: "rgba(107,114,128,0.12)",
    border: "#e5e7eb",
    cardBg: "linear-gradient(200deg, #f3f4f6 0%, #ffffff 70%)",
    label: "Inactive",
  },
};

const SEVERITY: Record<StatusKey, number> = { normal: 0, inactive: 1, alert: 2 };

export const toStatusKey = (value: unknown): StatusKey => {
  const s = String(value ?? "").toLowerCase();
  if (s === "alert" || s === "critical" || s === "warning") return "alert";
  if (s === "inactive" || s === "offline") return "inactive";
  return "normal";
};

export const worstStatus = (list: StatusKey[]): StatusKey =>
  list.reduce<StatusKey>((acc, s) => (SEVERITY[s] > SEVERITY[acc] ? s : acc), "normal");
