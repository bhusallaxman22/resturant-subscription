import { useContext, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="fixed"
            color="primary"
            sx={{
                // Example "glass/clay" styling
                borderRadius: "0 0 24px 24px",
                background: "linear-gradient(160deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))",
                backdropFilter: "blur(16px)",
                boxShadow: `
          inset 2px 2px 6px rgba(255,255,255,0.6),
          inset -2px -2px 6px rgba(0,0,0,0.04),
          0 8px 24px rgba(0, 0, 0, 0.06)
        `,
                border: "1px solid rgba(255, 255, 255, 0.5)",
                color: "#2D3142",
            }}
        >
            <Toolbar sx={{ minHeight: 72 }}>
                {/* Brand Logo */}
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    color="inherit"
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        textDecoration: "none",
                        fontWeight: 700,
                        filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
                    }}
                >
                    🍽️ Sapphron Kitchen
                </Typography>

                {/* Navigation Links (Desktop) */}
                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                    {/* Example custom button styling shared by all nav buttons */}
                    {!user && (
                        <>
                            <Button
                                color="inherit"
                                startIcon={<HomeIcon />}
                                component={Link}
                                to="/"
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Home
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/about-us"
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                About Us
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/contact-us"
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Contact Us
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/register"
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Register
                            </Button>
                        </>
                    )}

                    {/* If user is a customer */}
                    {user?.role === "customer" && (
                        <>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/dashboard"
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Dashboard
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/subscription"
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Manage Subscription
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/orders"
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                My Orders
                            </Button>
                        </>
                    )}

                    {/* If user is an admin */}
                    {user?.role === "admin" && (
                        <>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/admin"
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Admin Dashboard
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/admin/meal-plans"
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Manage Meal Plans
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/admin/orders"
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Manage Orders
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/admin/calendar"
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Order Calendar
                            </Button>
                        </>
                    )}

                    {/* If user is logged in (customer or admin) */}
                    {user && (
                        <>
                            <Button
                                color="inherit"
                                startIcon={<PersonIcon />}
                                component={Link}
                                to="/profile"
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Profile
                            </Button>
                            <Button
                                color="secondary"
                                variant="contained"
                                onClick={handleLogout}
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1,
                                    ml: 1,
                                    background:
                                        "linear-gradient(90deg, rgba(255,0,122,1) 0%, rgba(255,127,160,1) 100%)",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                    "&:hover": {
                                        background:
                                            "linear-gradient(90deg, rgba(255,50,140,1) 0%, rgba(255,127,160,1) 100%)",
                                    },
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </Box>

                {/* Mobile Navigation (Hamburger) */}
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                    <IconButton
                        color="inherit"
                        onClick={handleMenuOpen}
                        sx={{
                            backgroundColor: "rgba(255,255,255,0.2)",
                            borderRadius: "12px",
                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.3)",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            },
                        }}
                    >
                        <MenuIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                borderRadius: 2,
                                background: "rgba(255,255,255,0.9)",
                                backdropFilter: "blur(12px)",
                                boxShadow: `
                  0 4px 12px rgba(0,0,0,0.08)
                `,
                            },
                        }}
                    >
                        <MenuItem onClick={handleMenuClose} component={Link} to="/">
                            Home
                        </MenuItem>
                        {!user && (
                            <>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/login">
                                    Login
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/register">
                                    Register
                                </MenuItem>
                            </>
                        )}
                        {user?.role === "customer" && (
                            <>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard">
                                    Dashboard
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/subscription">
                                    Manage Subscription
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/orders">
                                    My Orders
                                </MenuItem>
                            </>
                        )}
                        {user?.role === "admin" && (
                            <>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/admin">
                                    Admin Dashboard
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/admin/meal-plans">
                                    Manage Meal Plans
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/admin/orders">
                                    Manage Orders
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/admin/calendar">
                                    Order Calendar
                                </MenuItem>
                            </>
                        )}
                        {user && (
                            <>
                                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleLogout();
                                        handleMenuClose();
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </>
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
