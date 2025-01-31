import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const StatusChip = ({ status, label }) => {
    const theme = useTheme();

    const statusColors = {
        Delivered: { bg: theme.palette.success.light, color: theme.palette.success.dark },
        Pending: { bg: theme.palette.warning.light, color: theme.palette.warning.dark },
        default: { bg: theme.palette.grey[200], color: theme.palette.grey[700] }
    };

    const color = statusColors[status] || statusColors.default;

    return (
        <Chip
            label={label || status}
            size="small"
            sx={{
                backgroundColor: color.bg,
                color: color.color,
                fontWeight: 600,
                textTransform: 'capitalize',
                borderRadius: 1
            }}
        />
    );
};

export default StatusChip;