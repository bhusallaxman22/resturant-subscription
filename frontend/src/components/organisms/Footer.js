// src/components/organisms/Footer.js
import React from "react";
import { Box, Container, Typography, Link, Grid, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                background: "rgba(255,255,255,0.8)",
                py: 4,
                mt: 8,
                borderTop: "1px solid rgba(255,255,255,0.5)",
                backdropFilter: "blur(12px)",
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#7C83FD" }}>
                            Saffron Kitchen
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                            Bringing authentic Nepali &amp; Indian flavors to your table.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ textAlign: { xs: "center", md: "right" } }}>
                        <IconButton
                            component={Link}
                            href="https://facebook.com"
                            target="_blank"
                            sx={{ color: "#7C83FD", "&:hover": { transform: "scale(1.1)" } }}
                        >
                            <Facebook />
                        </IconButton>
                        <IconButton
                            component={Link}
                            href="https://twitter.com"
                            target="_blank"
                            sx={{ color: "#7C83FD", "&:hover": { transform: "scale(1.1)" } }}
                        >
                            <Twitter />
                        </IconButton>
                        <IconButton
                            component={Link}
                            href="https://instagram.com"
                            target="_blank"
                            sx={{ color: "#7C83FD", "&:hover": { transform: "scale(1.1)" } }}
                        >
                            <Instagram />
                        </IconButton>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        © {new Date().getFullYear()} Saffron Kitchen. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
