import React, { useContext, useState } from "react";
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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { AuthContext } from "../contexts/AuthContext";

const drawerWidth = 240;
const collapsedWidth = 60;

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
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
            {
              title: "Dashboard",
              icon: <DashboardIcon />,
              path: "/dashboard",
            },
            {
              title: "Manage Subscription",
              icon: <ShoppingCartIcon />,
              path: "/subscription",
            },
            { title: "My Orders", icon: <LayersIcon />, path: "/orders" },
          ]
          : []),
        ...(user.role === "admin"
          ? [
            {
              title: "Admin Dashboard",
              icon: <DashboardIcon />,
              path: "/admin",
            },
            {
              title: "Manage Meal Plans",
              icon: <ShoppingCartIcon />,
              path: "/admin/meal-plans",
            },
            {
              title: "Manage Orders",
              icon: <LayersIcon />,
              path: "/admin/orders",
            },
            {
              title: "Order Calendar",
              icon: <CalendarTodayIcon />,
              path: "/admin/calendar",
            },
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
    <Box sx={{ height: "100%" }}>
      <Toolbar>
        {drawerOpen && (
          <Typography variant="h6" noWrap>
            Sapphron Kitchen
          </Typography>
        )}
        <IconButton onClick={toggleDrawer} sx={{ marginLeft: "auto" }}>
          {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
      <List>
        {NAVIGATION.map((item, index) => (
          <Tooltip
            title={drawerOpen ? "" : item.title}
            placement="right"
            key={index}
            arrow
          >
            <ListItem
              button
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigate(item.path);
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {drawerOpen && <ListItemText primary={item.title} />}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
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
      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerOpen ? drawerWidth : collapsedWidth,
            boxSizing: "border-box",
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin 0.3s",
          marginLeft: drawerOpen ? drawerWidth : collapsedWidth,
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
