import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LayersIcon from "@mui/icons-material/Layers";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 60;

const AdminDrawer = ({ onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const NAVIGATION = [
    { title: "Admin Dashboard", icon: <DashboardIcon />, path: "/admin" },
    {
      title: "Manage Meal Plans",
      icon: <ShoppingCartIcon />,
      path: "/admin/meal-plans",
    },
    { title: "Manage Orders", icon: <LayersIcon />, path: "/admin/orders" },
    {
      title: "Order Calendar",
      icon: <CalendarTodayIcon />,
      path: "/admin/calendar",
    },
    { title: "Logout", icon: <LogoutIcon />, action: onLogout },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
            Sapphron Kitchen
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
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar />
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
      </Drawer>
    </Box>
  );
};

export default AdminDrawer;
