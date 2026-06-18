import RealtimeStatCard from "./RealtimeStatCard";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import {
    Box,
    Button,
    Grid
} from "@mui/material";
import { useState } from "react";
import { FacilityCard } from "./FacilityCard";
import { useNavigate } from "react-router-dom";
import { useGetLocationsQuery } from "../../services/Api/location.api";
import PageTitle from "../../components/Pagetitle";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { useGetDashboardSummaryQuery } from "../../services/Api/dashboard.api";


const FILTERS = ["all", "normal", "warning", "alert"];

const Realtime = () => {
    const [filter, setFilter] = useState<string>("all");
    const navigate = useNavigate();

    const { data: dashboardSummary } = useGetDashboardSummaryQuery()

    const next_Pg = (e: any) => {
        // console.log(e, "Next page URL")
        navigate(`/view-detail/${e}`)
    }

    const { data: locationData, isLoading: locationLoading } = useGetLocationsQuery({ limit: null, offset: null })

    const filteredCards =
        filter === "all"
            ? locationData?.locations || []
            : locationData?.locations?.filter((c: any) => c.is_active === filter);

    return (
        <Box sx={{ bgcolor: "#fff", borderRadius: "20px" }}>
            <PageTitle title="Realtime Monitoring" />


            {/* Stats */}
            <Box sx={{ display: "flex", gap: 2, my: 3 }}>
                <RealtimeStatCard count={dashboardSummary?.total_locations || 0} label="Total Location" />
                <RealtimeStatCard count={dashboardSummary?.active_alerts || 0} label="Active Alerts" />
                <RealtimeStatCard count={(dashboardSummary?.total_locations - dashboardSummary?.active_alerts) || 0} label="All Normal" />
            </Box>

            {/* Filter + Export */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                }}
            >
                {/* Filter Buttons */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: "10px",
                        p: 0.5,
                    }}
                >
                    {FILTERS.map((item) => {
                        const isActive = filter === item;

                        return (
                            <Box
                                key={item}
                                onClick={() => setFilter(item)}
                                sx={{
                                    px: 2,
                                    py: 0.8,
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    textTransform: "capitalize",


                                    bgcolor: isActive ? "#e6fbf8" : "transparent",
                                    color: isActive ? "#00a395" : "#555",
                                    transition: "0.2s",
                                    "&:hover": {
                                        bgcolor: isActive ? "transparent" : "#f5f5f5",
                                    },


                                }}
                            >
                                {item === "all" ? "All Location" : item}
                            </Box>
                        );
                    })}
                </Box>

                <Button
                    variant="contained"
                    sx={{
                        textTransform: "capitalize",
                        background: "#007A70",
                        borderRadius: "12px",
                        fontSize: "12px",
                        height: "32px"
                    }}
                    startIcon={<FileDownloadOutlinedIcon sx={{ height: "16px" }} />}
                    endIcon={<KeyboardArrowDownOutlined sx={{ height: "16px" }} />}
                >
                    Export
                </Button>

            </Box>

            {/* Cards */}

            {
                locationLoading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>Loading...</Box> : (
                    <Grid container spacing={2.5} sx={{ mt: 2 }}>
                        {filteredCards?.map((card, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                                <FacilityCard data={card} onViewDetails={next_Pg} />
                            </Grid>
                        ))}
                    </Grid>
                )
            }
        </Box>
    );
};

export default Realtime;