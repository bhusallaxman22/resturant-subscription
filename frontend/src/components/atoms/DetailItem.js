// src/components/atoms/DetailItem.js
import React from "react";
import { Box, Typography } from "@mui/material";

const DetailItem = ({ label, value, stack, valueStyle }) => (
    <Box sx={{ mb: stack ? 1.5 : 2 }}>
        <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontWeight: 500 }}>
            {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: stack ? 500 : 400, color: "text.primary", ...valueStyle }}>
            {value}
        </Typography>
    </Box>
);

export default DetailItem;
