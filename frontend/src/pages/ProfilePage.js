import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Paper,
    Button,
    Grid,
    useTheme,
    CircularProgress,
    Alert,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

const ProfilesPage = () => {
    const theme = useTheme();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/auth/profile`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUser(response.data);
            } catch (err) {
                setError("Failed to fetch user profile");
                console.error("Error fetching user profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress size={80} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, p: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, p: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
                My Profile
            </Typography>
            <Paper
                sx={{
                    p: 4,
                    borderRadius: "16px",
                    boxShadow: theme.shadows[5],
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                            }}
                        >
                            <Avatar
                                src={user?.avatarUrl || "https://example.com/avatar.jpg"}
                                sx={{
                                    width: 150,
                                    height: 150,
                                    mb: 2,
                                    boxShadow: theme.shadows[4],
                                }}
                            />
                            <Typography variant="h5" gutterBottom>
                                {user?.name || "N/A"}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {user?.email || "N/A"}
                            </Typography>
                            <Link to="/onboarding">
                                <Button
                                    variant="outlined"
                                    sx={{ mt: 2 }}
                                    onClick={() => console.log("Edit Profile")}
                                >
                                    Edit Profile
                                </Button>
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>
                            Personal Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1" color="text.secondary">
                                    Contact Number
                                </Typography>
                                <Typography variant="body1">
                                    {user?.contactNumber || "N/A"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1" color="text.secondary">
                                    Date of Birth
                                </Typography>
                                <Typography variant="body1">
                                    {new Date(user?.dob)?.toDateString() || "N/A"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" color="text.secondary">
                                    Address
                                </Typography>
                                <Typography variant="body1">
                                    {user?.address
                                        ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zip}`
                                        : "N/A"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ProfilesPage;