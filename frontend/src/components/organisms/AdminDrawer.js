import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LayersIcon from "@mui/icons-material/Layers";
import LogoutIcon from "@mui/icons-material/Logout";
import theme from "../../theme/theme";

const drawerWidth = 240;
const collapsedWidth = 60;

const AdminDrawer = ({ onLogout }) => {
    const [drawerOpen, setDrawerOpen] = useState(true);
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        setDrawerOpen(!isMobile);
    }, [isMobile]);

    const toggleDrawer = () => {
        setDrawerOpen((prev) => !prev);
    };

    const NAVIGATION = [
        { title: "Admin Dashboard", icon: <DashboardIcon />, path: "/admin" },
        { title: "Manage Meal Plans", icon: <ShoppingCartIcon />, path: "/admin/meal-plans" },
        { title: "Manage Orders", icon: <LayersIcon />, path: "/admin/orders" },
        { title: "Order Calendar", icon: <CalendarTodayIcon />, path: "/admin/calendar" },
        { title: "Logout", icon: <LogoutIcon />, action: onLogout },
    ];

    return (
        <Box sx={{ display: "flex" }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (th) => th.zIndex.drawer + 1,
                    backgroundColor: "rgba(255, 255, 255, 0.8)!important",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)!important",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                    color: theme.palette.text.primary + "!important",
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: 2,
                            color: theme.palette.primary.main,
                            "&:hover": {
                                backgroundColor: "rgba(124, 131, 253, 0.1)",
                            },
                        }}
                    >
                        <MenuIcon
                            sx={{
                                filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.1))",
                            }}
                        />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Sapphron Kitchen
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    width: drawerOpen ? drawerWidth : collapsedWidth,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerOpen ? drawerWidth : collapsedWidth,
                        transition: "width 0.3s",
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
                                    if (isMobile) setDrawerOpen(false);
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
