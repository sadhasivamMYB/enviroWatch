import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#003632",
    },
  },})


export const inputStyles = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        fontSize: "14px",
        height: 40,
        backgroundColor: "#fff",

        "& fieldset": {
            borderColor: "#D1D5DB",
        },

        "&:hover fieldset": {
            borderColor: "#9CA3AF",
        },

        "&.Mui-focused fieldset": {
            borderColor: "#00796B",
            borderWidth: "1px",
        },

        "& .MuiOutlinedInput-input": {
            paddingTop: "0px",
            paddingBottom: "0px",
            height: "40px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
        },

        "& input[type='date']": {
            padding: "0px 14px",
            height: "40px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
        },
    },
};