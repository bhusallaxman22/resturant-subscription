// src/pages/ContactUs.js
import React, { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Alert,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import contactImage from "../assets/contact.png";

// Define keyframe animations for floating and scaling in
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const scaleIn = keyframes`
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app you might send formData to an API here.
        setSubmitted(true);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "var(--bg-gradient)",
                position: "relative",
                p: 4,
                overflow: "hidden",
            }}
        >
            {/* Floating Background Elements */}
            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    zIndex: 0,
                    "& > div": {
                        position: "absolute",
                        borderRadius: "30px",
                        background: "rgba(124, 131, 253, 0.1)",
                        backdropFilter: "blur(4px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                    },
                }}
            >
                <Box
                    sx={{
                        top: "15%",
                        left: "5%",
                        width: "80px",
                        height: "80px",
                        animation: `${float} 6s infinite`,
                    }}
                />
                <Box
                    sx={{
                        bottom: "20%",
                        right: "10%",
                        width: "120px",
                        height: "120px",
                        animation: `${float} 7s infinite`,
                    }}
                />
            </Box>

            <Container sx={{ position: "relative", zIndex: 1, mt: 5, mb: 5 }}>
                {/* Heading and Intro */}
                <Box sx={{ textAlign: "center", mb: 4, animation: `${scaleIn} 0.8s ease-out` }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            color: "#7C83FD",
                            textShadow: "4px 4px 12px rgba(124,131,253,0.2)",
                        }}
                    >
                        Contact Us
                    </Typography>
                    <Typography
                        variant="h6"
                        color="textSecondary"
                        sx={{ maxWidth: "800px", margin: "0 auto" }}
                    >
                        Have a question or feedback? Fill out the form below and we’ll get back to you soon.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Contact Form */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                backgroundColor: "var(--card-bg)",
                                borderRadius: "24px",
                                p: 4,
                                boxShadow:
                                    "12px 12px 32px rgba(0,0,0,0.06), -8px -8px 24px rgba(255,255,255,0.8)",
                                border: "1px solid var(--card-border)",
                                backdropFilter: "blur(12px)",
                                animation: `${scaleIn} 0.8s ease-out`,
                            }}
                        >
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    name="name"
                                    label="Your Name"
                                    fullWidth
                                    margin="normal"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <TextField
                                    name="email"
                                    label="Your Email"
                                    type="email"
                                    fullWidth
                                    margin="normal"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <TextField
                                    name="message"
                                    label="Your Message"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    margin="normal"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        mt: 2,
                                        background: "linear-gradient(45deg, #ff6f61, #ffa726)",
                                        borderRadius: "24px",
                                        py: 1.5,
                                    }}
                                >
                                    Submit
                                </Button>
                            </form>
                            {submitted && (
                                <Alert severity="success" sx={{ mt: 3 }}>
                                    Thank you for reaching out! We’ll get back to you soon.
                                </Alert>
                            )}
                        </Box>
                    </Grid>

                    {/* Contact Image */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                backgroundColor: "var(--card-bg)",
                                borderRadius: "24px",
                                p: 2,
                                boxShadow:
                                    "12px 12px 32px rgba(0,0,0,0.06), -8px -8px 24px rgba(255,255,255,0.8)",
                                border: "1px solid var(--card-border)",
                                backdropFilter: "blur(12px)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                animation: `${float} 4s ease-in-out infinite`,
                            }}
                        >
                            <img
                                src={contactImage}
                                alt="Contact Us"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    borderRadius: "16px",
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ContactUs;
