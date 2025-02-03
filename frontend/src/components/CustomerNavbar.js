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
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

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
    <AppBar sx={{
      borderRadius: '0 0 24px 24px',
      background: 'rgba(255, 255, 255, 0.8)!important',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)!important',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      borderTop: 'none',
      color: '#2D3142!important',
    }}
      position="fixed" color="primary">
      <Toolbar>
        {/* Brand Logo */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
          component={Link}
          to="/"
          color="inherit"
        >
          🍽️ Sapphron Kitchen
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: "10px" }}>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            component={Link}
            to="/"
          >
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about-us">
            About Us
          </Button>
          <Button color="inherit" component={Link} to="/contact-us">
            Contact Us
          </Button>
          {!user && (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}

          {user && user.role === "customer" && (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/subscription">
                Manage Subscription
              </Button>
              <Button color="inherit" component={Link} to="/orders">
                My Orders
              </Button>
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <Button color="inherit" component={Link} to="/admin">
                Admin Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/admin/meal-plans">
                Manage Meal Plans
              </Button>
              <Button color="inherit" component={Link} to="/admin/orders">
                Manage Orders
              </Button>
              <Button color="inherit" component={Link} to="/admin/calendar">
                Order Calendar
              </Button>
            </>
          )}

          {user && (
            <Button
              color="secondary"
              variant="contained"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>

        {/* Hamburger Menu (Mobile View) */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose} component={Link} to="/">
              Home
            </MenuItem>
            {!user && (
              <>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/login"
                >
                  Login
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/register"
                >
                  Register
                </MenuItem>
              </>
            )}

            {user && user.role === "customer" && (
              <>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/dashboard"
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/subscription"
                >
                  Manage Subscription
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/orders"
                >
                  My Orders
                </MenuItem>
              </>
            )}

            {user && user.role === "admin" && (
              <>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/admin"
                >
                  Admin Dashboard
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/admin/meal-plans"
                >
                  Manage Meal Plans
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/admin/orders"
                >
                  Manage Orders
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/admin/calendar"
                >
                  Order Calendar
                </MenuItem>
              </>
            )}

            {user && (
              <MenuItem
                onClick={() => {
                  handleLogout();
                  handleMenuClose();
                }}
              >
                Logout
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
