// OnboardingWizard.js
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Grid,
    Paper,
    CircularProgress,
    Alert,
    useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../components/atoms/ToastNotifications";

// Import our reusable AddressAutocomplete
import AddressAutocomplete from "../components/molecules/AddressAutocomplete";

const steps = ["Basic Info", "Address", "Confirm"];

const OnboardingWizard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        contactNumber: "",
        dob: "",
        address: {
            street: "",
            city: "",
            state: "",
            zip: "",
        },
    });

    // Fetch existing user data
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

                // Convert DOB to YYYY-MM-DD if available
                const dobValue = response.data.dob
                    ? new Date(response.data.dob).toISOString().slice(0, 10)
                    : "";

                setFormData({
                    name: response.data.name || "",
                    contactNumber: response.data.contactNumber || "",
                    dob: dobValue,
                    address: {
                        street: response.data.address?.street || "",
                        city: response.data.address?.city || "",
                        state: response.data.address?.state || "",
                        zip: response.data.address?.zip || "",
                    },
                });
            } catch (err) {
                setError("Failed to fetch user profile");
                console.error("Error fetching user profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/me`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showSuccessToast("User information updated successfully!");
            navigate("/dashboard");
        } catch (error) {
            showErrorToast("Error updating user info");
            console.error(error);
        }
    };

    /**
     * AddressAutocomplete "onChange" - user is typing, so we just track it in `street`.
     */
    const handleAddressChange = (val) => {
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                street: val, // typed text for display
            },
        }));
    };

    /**
     * AddressAutocomplete "onSelect" - user selected an address.
     * We'll parse out city/state/zip from the result, plus the `street`.
     */
    const handleAddressSelect = (result) => {
        // `result` = { fullAddress, street, city, state, zip, coords }
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                street: result.street || "",
                city: result.city || "",
                state: result.state || "",
                zip: result.zip || "",
            },
        }));
    };

    const renderStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return (
                    <Box sx={{ mt: 3 }}>
                        <TextField
                            label="Name"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Contact Number"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={formData.contactNumber}
                            onChange={(e) =>
                                setFormData({ ...formData, contactNumber: e.target.value })
                            }
                        />
                        <TextField
                            label="Date of Birth"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.dob}
                            onChange={(e) =>
                                setFormData({ ...formData, dob: e.target.value })
                            }
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mt: 3 }}>
                        {/* Our AddressAutocomplete */}
                        <AddressAutocomplete
                            addressValue={formData.address.street}
                            onChange={handleAddressChange}
                            onSelect={handleAddressSelect}
                            label="Search Address"
                        />
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="City"
                                    fullWidth
                                    value={formData.address.city}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            address: {
                                                ...prev.address,
                                                city: e.target.value,
                                            },
                                        }))
                                    }
                                />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField
                                    label="State"
                                    fullWidth
                                    value={formData.address.state}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            address: {
                                                ...prev.address,
                                                state: e.target.value,
                                            },
                                        }))
                                    }
                                />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField
                                    label="ZIP"
                                    fullWidth
                                    value={formData.address.zip}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            address: {
                                                ...prev.address,
                                                zip: e.target.value,
                                            },
                                        }))
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Confirm Your Details:
                        </Typography>
                        <Typography>Name: {formData.name}</Typography>
                        <Typography>Contact: {formData.contactNumber}</Typography>
                        <Typography>DOB: {formData.dob}</Typography>
                        <Typography>Street: {formData.address.street}</Typography>
                        <Typography>City: {formData.address.city}</Typography>
                        <Typography>State: {formData.address.state}</Typography>
                        <Typography>Zip: {formData.address.zip}</Typography>
                    </Box>
                );
            default:
                return <Box>Unknown Step</Box>;
        }
    };

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
            <Box sx={{ maxWidth: 800, margin: "auto", mt: 4, p: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Paper
            sx={{
                maxWidth: 800,
                margin: "auto",
                mt: 4,
                p: 4,
                borderRadius: "16px",
                boxShadow: theme.shadows[5],
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                User Info Setup
            </Typography>
            <Stepper activeStep={activeStep} sx={{ mt: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {renderStepContent(activeStep)}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                {activeStep !== 0 && (
                    <Button variant="outlined" onClick={handleBack}>
                        Back
                    </Button>
                )}
                {activeStep < steps.length - 1 ? (
                    <Button variant="contained" onClick={handleNext}>
                        Next
                    </Button>
                ) : (
                    <Button variant="contained" onClick={handleSubmit}>
                        Finish
                    </Button>
                )}
            </Box>
        </Paper>
    );
};

export default OnboardingWizard;
