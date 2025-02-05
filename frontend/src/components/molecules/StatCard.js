// src/components/molecules/StatCard.js
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { keyframes } from "@emotion/react";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StatCard = ({ icon, title, value, color }) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                p: 3,
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.8)",
                boxShadow:
                    "8px 8px 24px rgba(0, 0, 0, 0.06), -4px -4px 16px rgba(255, 255, 255, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(8px)",
                animation: `${fadeInUp} 0.8s ease-out`,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Box
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.8)",
                        boxShadow:
                            "4px 4px 12px rgba(0, 0, 0, 0.06), -2px -2px 8px rgba(255, 255, 255, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {icon && React.cloneElement(icon, { sx: { color, fontSize: "2rem" } })}
                </Box>
                <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                    {title}
                </Typography>
            </Box>
            <Typography
                variant="h4"
                sx={{
                    textAlign: "right",
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};

export default StatCard;
