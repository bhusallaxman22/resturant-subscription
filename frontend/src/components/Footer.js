// Path: frontend/src/components/Footer.js
import React from "react";
import { Box, Container, Typography, Link, Grid, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                position: "relative",
                zIndex: 1,
                background: "linear-gradient(145deg, #F5F6FF, #FFFFFF)",
                py: 4,
                mt: 8,
                borderTop: "1px solid rgba(255,255,255,0.5)",
                backdropFilter: "blur(12px)",
                boxShadow: "inset 0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    {/* Left Section: Branding and Description */}
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", color: "#7C83FD" }}
                        >
                            Saffron Kitchen
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                            Bringing authentic Nepali &amp; Indian flavors right to your table.
                        </Typography>
                    </Grid>

                    {/* Right Section: Social Media Links */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ textAlign: { xs: "center", md: "right" } }}
                    >
                        <IconButton
                            aria-label="Facebook"
                            component={Link}
                            href="https://facebook.com"
                            target="_blank"
                            sx={{
                                color: "#7C83FD",
                                transition: "transform 0.3s",
                                "&:hover": { transform: "scale(1.1)" },
                            }}
                        >
                            <Facebook />
                        </IconButton>
                        <IconButton
                            aria-label="Twitter"
                            component={Link}
                            href="https://twitter.com"
                            target="_blank"
                            sx={{
                                color: "#7C83FD",
                                transition: "transform 0.3s",
                                "&:hover": { transform: "scale(1.1)" },
                            }}
                        >
                            <Twitter />
                        </IconButton>
                        <IconButton
                            aria-label="Instagram"
                            component={Link}
                            href="https://instagram.com"
                            target="_blank"
                            sx={{
                                color: "#7C83FD",
                                transition: "transform 0.3s",
                                "&:hover": { transform: "scale(1.1)" },
                            }}
                        >
                            <Instagram />
                        </IconButton>
                    </Grid>
                </Grid>

                {/* Copyright / Additional Info */}
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        © {new Date().getFullYear()} Saffron Kitchen. All rights reserved.
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {" "} Website Created and Developed by @ <Link href="https://bhusallaxman.com.np" target="_blank" color="primary">Laxman Bhusal</Link>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
