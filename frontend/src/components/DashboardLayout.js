import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LayersIcon from "@mui/icons-material/Layers";
import HomeIcon from "@mui/icons-material/Home";
import { AuthContext } from "../contexts/AuthContext";

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const NAVIGATION = [
    { title: "Home", icon: <HomeIcon />, path: "/" },
    ...(user
      ? [
        ...(user.role === "customer"
          ? [
            { title: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
            { title: "Manage Subscription", icon: <ShoppingCartIcon />, path: "/subscription" },
            { title: "My Orders", icon: <LayersIcon />, path: "/orders" },
          ]
          : []),
        ...(user.role === "admin"
          ? [
            { title: "Admin Dashboard", icon: <DashboardIcon />, path: "/admin" },
            { title: "Manage Meal Plans", icon: <ShoppingCartIcon />, path: "/admin/meal-plans" },
            { title: "Manage Orders", icon: <LayersIcon />, path: "/admin/orders" },
            { title: "Order Calendar", icon: <CalendarTodayIcon />, path: "/admin/calendar" },
          ]
          : []),
        { title: "Logout", icon: <LogoutIcon />, action: handleLogout },
      ]
      : [
        { title: "Login", icon: <LoginIcon />, path: "/login" },
        { title: "Register", icon: <PersonAddIcon />, path: "/register" },
      ]),
  ];

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Sapphron Kitchen
        </Typography>
      </Toolbar>
      <List>
        {NAVIGATION.map((item, index) => (
          <Tooltip title={item.title} placement="right" key={index} arrow>
            <ListItem
              button
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigate(item.path);
                }
                if (isMobile) setDrawerOpen(false); // Close drawer on mobile after navigation
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#6366f1",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ marginRight: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Meal Subscription
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true, // Improve performance on mobile
        }}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            position: "absolute",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
        }}
      >
        <Toolbar /> {/* Ensures content starts below the AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
