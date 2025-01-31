import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const CardWrapper = ({ icon, title, subtitle, children }) => {
    const theme = useTheme();

    return (
        <Box sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ mb: 3 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 1
                }}>
                    {React.cloneElement(icon, {
                        sx: {
                            color: theme.palette.primary.main,
                            fontSize: '2rem'
                        }
                    })}
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                {subtitle && (
                    <Typography variant="body2" sx={{
                        color: theme.palette.text.secondary,
                        ml: '3rem'
                    }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            <Box sx={{ flex: 1 }}>{children}</Box>
        </Box>
    );
};

export default CardWrapper;