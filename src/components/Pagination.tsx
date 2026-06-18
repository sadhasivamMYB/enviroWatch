import { Box, Divider, IconButton, MenuItem, Select, Stack, Typography } from "@mui/material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export default function CommonPagination({
    page,
    total_items,
    rowsPerPage,
    setRowsPerPage,
    setPage
}) {
    return (
        <Stack spacing={2} sx={{
            alignItems: "end"
        }}> <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2,
                p: 2,

            }}
        >
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: 600,
                    px: 2,
                    borderRadius: "12px",
                    color: "#001C16",
                    backgroundColor: "#eeeeee"
                }}>
                    <Typography sx={{ fontSize: 14, }} color="#4b5563">Show</Typography>

                    <Select
                        size="small"
                        value={rowsPerPage}


                        onChange={(e) =>
                            setRowsPerPage(Number(e.target.value))
                        }
                        sx={{
                            color: "black",
                            border: "none",
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                        }}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                    </Select>
                </Box>


                <Box sx={{
                    fontWeight: 600,
                    px: 2,
                    borderRadius: "12px",
                    color: "#001C16",
                    backgroundColor: "#eeeeee",
                    display: "flex",
                    gap: 1,
                    alignItems: "center"
                }}>

                    <Typography sx={{ fontSize: 12, }} color="#4b5563">
                        {page + 1} /{" "}
                        {Math.ceil(total_items / rowsPerPage)}
                    </Typography>

                    <Divider orientation="vertical" flexItem />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: 16,
                            color: "#001C16",
                        }}
                    >
                        <IconButton
                            onClick={() =>
                                setPage((prev) => Math.max(prev - 1, 0))
                            }
                        >
                            <KeyboardArrowLeftIcon />
                        </IconButton>

                        <Divider orientation="vertical" flexItem />
                        <IconButton
                            onClick={() =>
                                setPage((prev) =>
                                    prev + 1 <
                                        Math.ceil(total_items / rowsPerPage)
                                        ? prev + 1
                                        : prev
                                )
                            }
                        >
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

        </Stack >
    );
}