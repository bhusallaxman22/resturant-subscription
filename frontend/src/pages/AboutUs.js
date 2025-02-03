import { Container, Typography, Box, Grid, Card, CardContent, Button } from "@mui/material";
import { keyframes } from "@emotion/react";
import aboutImage from "../assets/about.jpg";

// Keyframes for animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0px); }
`;

const AboutUs = () => {
    return (
        <Container
            sx={{
                mt: 5,
                mb: 5,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: "linear-gradient(145deg, #F5F6FF, #FFFFFF)",
                padding: 4,
            }}
        >
            {/* Main Content */}
            <Box
                sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "40px",
                    padding: 6,
                    boxShadow: "12px 12px 32px rgba(0, 0, 0, 0.06), -8px -8px 24px rgba(255, 255, 255, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(12px)",
                    animation: `${fadeIn} 1s ease-out`,
                }}
            >
                {/* Title Section */}
                <Box sx={{ textAlign: "center", mb: 6 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            color: "#7C83FD",
                            textShadow: "4px 4px 12px rgba(124, 131, 253, 0.2)",
                        }}
                    >
                        About Us
                    </Typography>
                    <Typography
                        variant="h6"
                        color="textSecondary"
                        sx={{ maxWidth: "800px", margin: "0 auto", lineHeight: 1.8 }}
                    >
                        At Saffron Kitchen, we’re passionate about delivering authentic Nepali & Indian flavors
                        right to your doorstep. With fresh, healthy, and handcrafted meals, we aim to make every
                        meal a celebration of taste and tradition.
                    </Typography>
                </Box>

                {/* Grid Layout for Image and Content */}
                <Grid container spacing={6}>
                    {/* Left Section: Image */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                borderRadius: "24px",
                                overflow: "hidden",
                                boxShadow: "8px 8px 24px rgba(0, 0, 0, 0.1), -4px -4px 16px rgba(255, 255, 255, 0.8)",
                                animation: `${float} 4s ease-in-out infinite`,
                            }}
                        >
                            <img
                                src={aboutImage}
                                alt="About Us"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    display: "block",
                                }}
                            />
                        </Box>
                    </Grid>

                    {/* Right Section: Content */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {/* Mission Section */}
                            <Card
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    borderRadius: "24px",
                                    boxShadow: "8px 8px 24px rgba(0, 0, 0, 0.06), -4px -4px 16px rgba(255, 255, 255, 0.8)",
                                    border: "1px solid rgba(255, 255, 255, 0.5)",
                                    backdropFilter: "blur(8px)",
                                    padding: 3,
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#7C83FD" }}>
                                        Our Mission
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        Our mission is to provide customers with a seamless meal subscription experience,
                                        bringing convenience and culinary excellence to your home. Each dish is crafted
                                        with love, care, and the finest ingredients.
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Why Choose Us Section */}
                            <Card
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    borderRadius: "24px",
                                    boxShadow: "8px 8px 24px rgba(0, 0, 0, 0.06), -4px -4px 16px rgba(255, 255, 255, 0.8)",
                                    border: "1px solid rgba(255, 255, 255, 0.5)",
                                    backdropFilter: "blur(8px)",
                                    padding: 3,
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#7C83FD" }}>
                                        Why Choose Us?
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        - Authentic flavors from Nepal and India 🌶️ <br />
                                        - Fresh, made-to-order meals 💛 <br />
                                        - Flexible subscription plans tailored to your needs <br />
                                        - Commitment to health and sustainability
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Call-to-Action Button */}
                            <Button
                                variant="contained"
                                sx={{
                                    borderRadius: "24px",
                                    padding: "12px 32px",
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                    background: "linear-gradient(145deg, #7C83FD, #5A61F5)",
                                    boxShadow: "4px 4px 12px rgba(124, 131, 253, 0.1), -2px -2px 8px rgba(255, 255, 255, 0.8)",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: "6px 6px 16px rgba(124, 131, 253, 0.2), -4px -4px 12px rgba(255, 255, 255, 0.9)",
                                    },
                                }}
                            >
                                Explore Our Menu
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default AboutUs;