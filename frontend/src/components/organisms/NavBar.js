// src/components/organisms/Navbar.js
import React, { useContext, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import theme from "../../theme/theme";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
        <AppBar
            position="fixed"
            color="primary"
            sx={{
                borderRadius: "0 0 24px 24px",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                color: "#2D3142",
            }}
        >
            <Toolbar sx={{ minHeight: 72 }}>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    color="inherit"
                    sx={{
                        flexGrow: 1,
                        textDecoration: "none",
                        fontWeight: 700,
                    }}
                >
                    🍽️ Saffron Kitchen
                </Typography>
                {isMobile ? (
                    <>
                        <IconButton color="inherit" onClick={handleMenuOpen}>
                            <MenuIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            {!user && (
                                <>
                                    <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                                        Home
                                    </MenuItem>
                                    <MenuItem component={Link} to="/about-us" onClick={handleMenuClose}>
                                        About Us
                                    </MenuItem>
                                    <MenuItem component={Link} to="/contact-us" onClick={handleMenuClose}>
                                        Contact Us
                                    </MenuItem>
                                    <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                                        Login
                                    </MenuItem>
                                    <MenuItem component={Link} to="/register" onClick={handleMenuClose}>
                                        Register
                                    </MenuItem>
                                </>
                            )}
                            {user && (
                                <>
                                    <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
                                        Dashboard
                                    </MenuItem>
                                    <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                                        Profile
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleMenuClose();
                                            handleLogout();
                                        }}
                                    >
                                        Logout
                                    </MenuItem>
                                </>
                            )}
                        </Menu>
                    </>
                ) : (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        {!user && (
                            <>
                                <Button
                                    component={Link}
                                    to="/"
                                    color="inherit"
                                    startIcon={<HomeIcon />}
                                    sx={{ borderRadius: "16px", px: 2, py: 1 }}
                                >
                                    Home
                                </Button>
                                <Button
                                    component={Link}
                                    to="/about-us"
                                    color="inherit"
                                    sx={{ borderRadius: "16px", px: 2, py: 1 }}
                                >
                                    About Us
                                </Button>
                                <Button
                                    component={Link}
                                    to="/contact-us"
                                    color="inherit"
                                    sx={{ borderRadius: "16px", px: 2, py: 1 }}
                                >
                                    Contact Us
                                </Button>
                                <Button
                                    component={Link}
                                    to="/login"
                                    color="inherit"
                                    sx={{ borderRadius: "16px", px: 2, py: 1 }}
                                >
                                    Login
                                </Button>
                                <Button
                                    component={Link}
                                    to="/register"
                                    color="inherit"
                                    sx={{ borderRadius: "16px", px: 2, py: 1 }}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                        {user && (
                            <>
                                <Button
                                    component={Link}
                                    to="/dashboard"
                                    color="inherit"
                                    sx={{ borderRadius: "16px", px: 2, py: 1 }}
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    component={Link}
                                    to="/profile"
                                    color="inherit"
                                    startIcon={<PersonIcon />}
                                    sx={{ borderRadius: "16px", px: 2, py: 1 }}
                                >
                                    Profile
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    color="secondary"
                                    variant="contained"
                                    sx={{ borderRadius: "16px", px: 2, py: 1 }}
                                >
                                    Logout
                                </Button>
                            </>
                        )}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
