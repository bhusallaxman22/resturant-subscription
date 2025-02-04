// Path: frontend/src/components/CardWrapper.js
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import styled from 'styled-components';

const CardWrapper = ({ icon, title, subtitle, children }) => {
    const theme = useTheme();

    return (
        <Box sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.7)',
            boxShadow: '12px 12px 32px rgba(0, 0, 0, 0.06), -8px -8px 24px rgba(255, 255, 255, 0.8), inset 2px 2px 4px rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(12px)',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(145deg, rgba(255,255,255,0.4), rgba(255,255,255,0))',
                zIndex: 1,
            }
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