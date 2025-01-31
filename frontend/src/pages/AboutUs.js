import { Container, Typography, Box, Grid, Card, CardContent } from "@mui/material";
import aboutImage from "../assets/about.jpg";

const AboutUs = () => {
    return (
        <Container sx={{ mt: 5, mb: 5 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                    About Us
                </Typography>
                <Typography variant="h6" color="textSecondary" sx={{ maxWidth: "800px", margin: "0 auto" }}>
                    At Saffron Kitchen, we’re passionate about delivering authentic Nepali & Indian flavors right to your doorstep.
                    With fresh, healthy, and handcrafted meals, we aim to make every meal a celebration of taste and tradition.
                </Typography>
            </Box>
            <Grid container spacing={4}>
                {/* Left Section: Image */}
                <Grid item xs={12} md={6}>
                    <img
                        src={aboutImage}
                        alt="About Us"
                        style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "16px",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                        }}
                    />
                </Grid>
                {/* Right Section: Content */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Our Mission
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Our mission is to provide customers with a seamless meal subscription experience, bringing convenience and
                            culinary excellence to your home. Each dish is crafted with love, care, and the finest ingredients.
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Why Choose Us?
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            - Authentic flavors from Nepal and India 🌶️ <br />
                            - Fresh, made-to-order meals 💛 <br />
                            - Flexible subscription plans tailored to your needs <br />
                            - Commitment to health and sustainability
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AboutUs;
