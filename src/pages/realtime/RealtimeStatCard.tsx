import { Box, Typography } from "@mui/material";


// style map
const cardStyles: Record<
    string,
    { bg: string; iconBg: string; iconColor: string, iconUrl: string }
> = {
    "Total Location": {

        bg: `
        linear-gradient(115.04deg, rgba(217, 217, 217, 0.01), rgba(0, 163, 149, 0.12)) padding-box, linear-gradient(#fff, #fff) padding-box, linear-gradient(-64.53deg, rgba(11, 11, 15, 0.01), rgba(0, 163, 149, 0.1)) border-box`,
        iconBg: "#E6FBF8",
        iconColor: "#22c55e",
        iconUrl: "../src/assets/Icons/home_work.svg"
    },
    "Active Alerts": {
        bg: `
         linear-gradient(115.04deg, rgba(217, 217, 217, 0.01), rgba(209, 0, 0, 0.08)) padding-box, linear-gradient(#fff, #fff) padding-box, linear-gradient(-64.53deg, rgba(11, 11, 15, 0.01), rgba(209, 0, 0, 0.1)) border-box`,
        iconBg: "#fde6e6",
        iconColor: "#c62828",
        iconUrl: "../src/assets/Icons/alert.svg"
    },
    "Warnings": {
        bg: `
    linear-gradient(
      115.04deg,
      rgba(217, 217, 217, 0.01),
      rgba(207, 159, 2, 0.08)
    ) padding-box,

    linear-gradient(#fff, #fff) padding-box,

    linear-gradient(
      -64.53deg,
      rgba(11, 11, 15, 0.01),
      rgba(207, 159, 2, 0.1)
    ) border-box
  `,
        iconBg: "#fef9c3",
        iconColor: "#f59e0b",
        iconUrl: "../src/assets/Icons/warning.svg"
    },
    "All Normal": {
        bg: `linear-gradient(115.04deg, rgba(217, 217, 217, 0.01), rgba(3, 153, 0, 0.08)) padding-box, linear-gradient(#fff, #fff) padding-box, linear-gradient(-64.53deg, rgba(11, 11, 15, 0.01), rgba(3, 153, 0, 0.1)) border-box`,
        iconBg: "#E6F6E6",
        iconColor: "#22c55e",
        iconUrl: "../src/assets/Icons/leaf.svg"
    },
};

const defaultStyle = {
    bg: "#eeeeee",
    iconBg: "#dddddd",
    iconColor: "#333",
    iconUrl: "../../assets/Icon/leaf.svg"
};

const RealtimeStatCard = ({
    count,
    label,
}: {
    count: number;
    label: string;

}) => {
    const style = cardStyles[label] || defaultStyle;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                borderRadius: "20px",
                background: style.bg,
                width: "100%",
                maxWidth: "320px",
                border: `1px solid transparent`
            }}
        >
            {/* Icon Box */}
            <Box
                sx={{
                    padding: "12px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: style.iconBg,
                    border: `1px solid transparent`
                }}
            >
                <Box component="img" src={style.iconUrl} alt={label} sx={{ width: 24, height: 24, color: style.iconColor }} />
            </Box>
            {/* Text */}
            <Box>
                <Typography sx={{ fontSize: "22px", fontWeight: 600, color: "#000" }}>
                    {count}
                </Typography>

                <Typography sx={{ fontSize: 12, color: "#52525b" }}>
                    {label}
                </Typography>
            </Box>
        </Box>
    );
};

export default RealtimeStatCard;