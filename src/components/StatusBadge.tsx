import { Chip } from "@mui/material";

// type AlertStatus = "Active" | "Inactive";


export default function StatusBadge({ status }: any) {
    return (
        <Chip
            label={status}
            size="small"
            sx={{

                bgcolor: status === "Active" ? "#e6f6e6" : "transparent",
                border: status === "Active" ? "1px solid transparent " : "none",

                fontSize: "0.72rem",
                height: 26,
                borderRadius: 1.5,
                color: status === "Active" ? "#027700" : "#374151",
                // border: `1px solid ${status === "Active" ? "#bbf7d0" : "#e5e7eb"}`,
            }}
        />
    )
}