import { ArrowBackIosNew } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

const Back = ({ title, path }: { title: string, path?: string }) => {
    const navigate = useNavigate()

    function navigateHandler() {
        if (path) {
            navigate(path)
        } else {
            navigate(-1)
        }
    }
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            spacing: 1,
            cursor: "pointer",
            alignItems: "center",
            mb: 2
        }}

            onClick={() => navigateHandler()}>
            <IconButton size="small" sx={{ width: 20, height: 20 }}>
                <ArrowBackIosNew sx={{ fontSize: 12 }} />
            </IconButton>
            <Typography sx={{
                color: "#666", fontSize: 12,
            }}>
                {title || "Back"}
            </Typography>
        </Box>
    )
}

export default Back
