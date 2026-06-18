import { Box, Paper, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useState } from "react";




const ParameterWise = ({ parameterTempData }: any) => {
    const [metric, setMetric] = useState(0);

    const day = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        const format = `${String(date.getDate())}/${String(date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth())} \n ${((i + 1) * 2) + ":00"} `
        return format


    });
    const location = ['Warehouse A', 'Warehouse B', 'Warehouse C']

    const [selectedSenor, setSelectedSensor] = useState("Temperture")
    const colors = ["#ef4444", "#3b82f6", "#f59e0b"];
    const yMax = metric === 0 ? 1000 : 100;
    const data = metric === 0 ? parameterTempData : parameterTempData.map((d) => d.map((v) => Math.round(v / 11)));
    return (
        <Box sx={{ border: "1px solid rgba(11, 11, 15, 0.06)", borderRadius: "16px", padding: 2, mt: "16px" }}>

            <Typography sx={{ fontSize: "16px", fontWeight: 500, textTransform: "capitalize" }}>{selectedSenor}</Typography>
            <LineChart

                height={500}

                style={{
                    padding: 0,
                    width: "100%"

                }}
                series={location.map((name, i) => ({
                    data: data[i],
                    label: name,
                    color: colors[i],
                    showMark: false,
                    curve: "catmullRom",
                }))}
                xAxis={[
                    {
                        data: day,
                        scaleType: "point",
                        label: "Days",
                        tickLabelStyle: { fontSize: 10, fill: "#9ca3af" },
                    },
                ]}
                yAxis={[
                    {
                        min: 0,
                        max: yMax,
                        tickLabelStyle: { fontSize: 10, fill: "#9ca3af" },
                    },
                ]}
                sx={{
                    ".MuiLineElement-root": { strokeWidth: 2 },
                    ".MuiChartsAxis-line": { stroke: "#e5e7eb" },
                    ".MuiChartsGrid-line": { stroke: "#f3f4f6" },
                }}
                grid={{ horizontal: true }}
                margin={{ left: 50, right: 20, top: 10, bottom: 30 }}
                slotProps={{
                    legend: {
                        direction: "horizontal",
                        position: { vertical: "bottom", horizontal: "center" },
                        // itemMarkHeight: 3,
                        // itemMarkWidth: 12,
                        // labelStyle: { fontSize: 12, fill: "#374151" },
                    },
                }}
            />
        </Box>
    );
}

export default ParameterWise;
