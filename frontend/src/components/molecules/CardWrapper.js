// src/components/molecules/CardWrapper.js
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const CardWrapper = ({ icon, title, subtitle, children, sx }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                p: 4,
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.8)",
                boxShadow:
                    "12px 12px 32px rgba(0, 0, 0, 0.06), -8px -8px 24px rgba(255, 255, 255, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(12px)",
                position: "relative",
                overflow: "hidden",
                ...sx,
            }}
        >
            <Box sx={{ mb: 3, position: "relative", zIndex: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    {icon &&
                        React.cloneElement(icon, {
                            sx: { color: theme.palette.primary.main, fontSize: "2rem" },
                        })}
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                {subtitle && (
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: icon ? "3rem" : 0 }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            <Box sx={{ position: "relative", zIndex: 2 }}>{children}</Box>
        </Box>
    );
};

export default CardWrapper;
