// src/components/atoms/StatusChip.js
import { Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const StatusChip = ({ status, label, ...props }) => {
    const theme = useTheme();

    const statusColors = {
        Delivered: { bg: theme.palette.success.light, color: theme.palette.success.dark },
        Pending: { bg: theme.palette.warning.light, color: theme.palette.warning.dark },
        Processing: { bg: theme.palette.info.light, color: theme.palette.info.dark },
        default: { bg: theme.palette.grey[200], color: theme.palette.grey[700] },
    };

    const color = statusColors[status] || statusColors.default;

    return (
        <Chip
            label={label || status}
            size="small"
            sx={{
                borderRadius: "12px",
                padding: "4px 12px",
                boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(8px)",
                ...props.sx,
            }}
            {...props}
        />
    );
};

export default StatusChip;
