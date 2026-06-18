// Reusable SearchBar component with functional search handling
import { Box, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import React from "react";

interface SearchBarProps {
    /** Placeholder text displayed in the input field */
    placeholder?: string;
    /** Current search keyword (controlled component) */
    value: string;
    /** Callback invoked when the input value changes */
    onChange: (newValue: string) => void;
    /** Optional callback invoked when the user presses Enter */
    onSearch?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search...",
    value,
    onChange,
    onSearch,
}) => {
    // Handle Enter key to trigger search action
    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && onSearch) {
            onSearch(value);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
                maxWidth: 400,
                backdropFilter: "blur(8px)",

            }}
        >
            <TextField
                size="small"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyPress}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{
                    flex: 1,
                    maxWidth: 420,
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        fontSize: "0.8rem",
                        bgcolor: "#fff",
                        "& fieldset": { borderColor: "#e5e7eb" },
                        "&:hover fieldset": { borderColor: "#d1d5db" },
                        "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                    },
                }}
            />
        </Box>
    );
};

export default SearchBar;
