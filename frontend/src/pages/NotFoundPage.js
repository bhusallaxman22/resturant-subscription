import { Box, Button, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import { Link } from 'react-router-dom';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const shake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
`;

const NotFoundPage = () => (
    <Box
        sx={{
            position: 'relative', // Create a stacking context
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(145deg, #F5F6FF, #FFFFFF)',
            padding: 4,
        }}
    >
        {/* Floating Background Elements (placed first so they're behind main content) */}
        <Box
            sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                zIndex: 0,
                '& > div': {
                    position: 'absolute',
                    borderRadius: '30px',
                    background: 'rgba(124, 131, 253, 0.1)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                },
            }}
        >
            <Box
                sx={{
                    top: '20%',
                    left: '10%',
                    width: '100px',
                    height: '100px',
                    animation: `${float} 6s infinite`,
                }}
            />
            <Box
                sx={{
                    top: '60%',
                    right: '15%',
                    width: '80px',
                    height: '80px',
                    animation: `${float} 5s infinite`,
                }}
            />
            <Box
                sx={{
                    bottom: '30%',
                    left: '25%',
                    width: '120px',
                    height: '120px',
                    animation: `${float} 7s infinite`,
                }}
            />
        </Box>

        {/* Main Content */}
        <Box
            sx={{
                position: 'relative',
                zIndex: 1,
                animation: `${float} 4s ease-in-out infinite`,
            }}
        >
            {/* Main 404 Container */}
            <Box
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '40px',
                    padding: 8,
                    boxShadow:
                        '12px 12px 32px rgba(0, 0, 0, 0.06), -8px -8px 24px rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(12px)',
                    textAlign: 'center',
                    position: 'relative',
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: '8rem',
                        fontWeight: 800,
                        color: '#7C83FD',
                        textShadow: '4px 4px 12px rgba(124, 131, 253, 0.2)',
                        mb: 2,
                    }}
                >
                    404
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        color: 'text.primary',
                        mb: 3,
                        fontWeight: 700,
                    }}
                >
                    Oops! Page Not Found
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        mb: 4,
                        maxWidth: '500px',
                        mx: 'auto',
                    }}
                >
                    The page you're looking for might have been moved, deleted, or never existed. Let's get you back home!
                </Typography>

                <Link to="/" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="contained"
                        sx={{
                            borderRadius: '24px',
                            padding: '12px 32px',
                            fontSize: '1.1rem',
                            boxShadow:
                                '4px 4px 12px rgba(124, 131, 253, 0.1), -2px -2px 8px rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow:
                                    '6px 6px 16px rgba(124, 131, 253, 0.2), -4px -4px 12px rgba(255, 255, 255, 0.9)',
                            },
                        }}
                    >
                        Return Home
                    </Button>
                </Link>
            </Box>

            {/* Animated Ghost Illustration */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-120px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    animation: `${shake} 3s ease-in-out infinite`,
                }}
            >
                <svg width="150" height="150" viewBox="0 0 200 200">
                    <path
                        fill="#7C83FD"
                        d="M100 20C50 20 20 50 20 100v50l30-20 30 20 30-20 30 20 30-20 30 20v-50c0-50-30-80-80-80z"
                        style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.1))' }}
                    />
                    <circle cx="75" cy="90" r="12" fill="#fff">
                        <animate
                            attributeName="cy"
                            values="90;85;90"
                            dur="2s"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle cx="125" cy="90" r="12" fill="#fff">
                        <animate
                            attributeName="cy"
                            values="90;85;90"
                            dur="2.2s"
                            repeatCount="indefinite"
                        />
                    </circle>
                </svg>
            </Box>
        </Box>
    </Box>
);

export default NotFoundPage;
