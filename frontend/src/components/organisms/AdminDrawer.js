// src/components/organisms/AdminDrawer.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Tooltip,
    useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LayersIcon from "@mui/icons-material/Layers";
import LogoutIcon from "@mui/icons-material/Logout";
import theme from "../../theme/theme";
import { Email, TableRestaurantRounded } from "@mui/icons-material";

const drawerWidth = 240;
const collapsedWidth = 60;

const AdminDrawer = ({ onLogout }) => {
    const [drawerOpen, setDrawerOpen] = useState(true);
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        // On mobile, start with the drawer closed; on desktop, open it.
        setDrawerOpen(!isMobile);
    }, [isMobile]);

    const toggleDrawer = () => {
        setDrawerOpen((prev) => !prev);
    };

    const handleLinkClick = (item) => {
        if (item.action) {
            item.action();
        } else {
            navigate(item.path);
        }
        // Collapse (minimize) the drawer after clicking a link.
        setDrawerOpen(false);
    };

    const NAVIGATION = [
        { title: "Admin Dashboard", icon: <DashboardIcon />, path: "/admin" },
        { title: "Manage Meal Plans", icon: <ShoppingBasketIcon />, path: "/admin/meal-plans" },
        { title: "Manage Orders", icon: <LayersIcon />, path: "/admin/orders" },
        { title: "Catering Requests", icon: <ShoppingBasketIcon />, path: "/admin/catering-requests" },
        { title: "Newsletter", icon: <Email />, path: "/admin/newsletter" },
        { title: "Reservations", icon: <TableRestaurantRounded />, path: "/admin/reservations" },
        { title: "Order Calendar", icon: <CalendarTodayIcon />, path: "/admin/calendar" },
        { title: "Logout", icon: <LogoutIcon />, action: onLogout },
    ];

    return (
        <Box sx={{ display: "flex" }}>
            {/* Glassmorphic AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerOpen ? drawerWidth : collapsedWidth}px)` },
                    ml: { md: `${drawerOpen ? drawerWidth : collapsedWidth}px` },
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    color: theme.palette.text.primary,
                }}
            >
                <Toolbar>
                    <IconButton color="inherit" onClick={toggleDrawer} edge="start" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Admin Panel
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={drawerOpen}
                onClose={toggleDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{
                    width: drawerOpen ? drawerWidth : collapsedWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerOpen ? drawerWidth : collapsedWidth,
                        boxSizing: "border-box",
                        background: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(16px)",
                        borderRight: "1px solid rgba(0,0,0,0.05)",
                        transition: "width 0.3s",
                    },
                }}
            >
                <Toolbar />
                <List>
                    {NAVIGATION.map((item, index) => (
                        <Tooltip key={index} title={drawerOpen ? "" : item.title} placement="right" arrow>
                            <ListItem
                                button
                                onClick={() => handleLinkClick(item)}
                                sx={{ mb: 1 }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: drawerOpen ? 2 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
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
