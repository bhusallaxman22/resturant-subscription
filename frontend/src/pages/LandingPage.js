// src/pages/LandingPage.js
import React from "react";
import {
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";
import HeroCarousel from "../components/organisms/HeroCarousel";
import menuImage1 from "../assets/menu1.png";
import testimonialImage from "../assets/testimonial.jpg";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const scaleIn = keyframes`
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const LandingPage = () => {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Hero Carousel in the background */}
      <HeroCarousel />

      {/* Dark overlay to improve text contrast */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />

      {/* Hero text and CTA */}
      <Box
        sx={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "#fff",
            mb: 2,
            textShadow: "3px 3px 10px rgba(0,0,0,0.3)",
            animation: `${scaleIn} 0.8s ease-out`,
          }}
        >
          Savor Authentic Flavors
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            color: "rgba(255,255,255,0.85)",
            maxWidth: "600px",
            animation: `${scaleIn} 0.8s ease-out 0.2s`,
            animationFillMode: "backwards",
          }}
        >
          Enjoy traditional Nepali &amp; Indian cuisine crafted with passion and delivered to your door.
        </Typography>
        <Button
          component={Link}
          to="/subscription"
          variant="contained"
          size="large"
          sx={{
            background: "linear-gradient(45deg, #7C83FD, #96BAFF)",
            borderRadius: "24px",
            padding: "16px 40px",
            fontSize: "1.1rem",
            boxShadow: "4px 4px 12px rgba(0,0,0,0.2)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "6px 6px 16px rgba(0,0,0,0.25)",
            },
            animation: `${scaleIn} 0.8s ease-out 0.4s`,
            animationFillMode: "backwards",
            zIndex: 4, // ensures button is clickable
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* About Section */}
      <Box
        sx={{
          py: 10,
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          zIndex: 2,
          position: "relative",
        }}
      >
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: "32px",
                  overflow: "hidden",
                  boxShadow: "12px 12px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={menuImage1}
                  alt="About Us"
                  style={{ width: "100%", height: "auto", borderRadius: "32px" }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3 }}>
                About Saffron Kitchen
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, fontSize: "1.1rem" }}>
                At Saffron Kitchen, we deliver authentic flavors of Nepali and Indian cuisines,
                crafted with passion and served with care.
              </Typography>
              <Button
                component={Link}
                to="/about-us"
                variant="contained"
                size="large"
                sx={{
                  background: "linear-gradient(45deg, #7C83FD, #96BAFF)",
                  borderRadius: "24px",
                  padding: "12px 32px",
                  fontSize: "1rem",
                  boxShadow: "4px 4px 12px rgba(0,0,0,0.1)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "6px 6px 16px rgba(0,0,0,0.15)",
                  },
                }}
              >
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        sx={{
          py: 10,
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          zIndex: 2,
          position: "relative",
        }}
      >
        <Container>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 6 }}
          >
            What Our Customers Say
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                image: testimonialImage,
                name: "John Doe",
                review:
                  "The food is absolutely delicious! The service is top-notch, and the flavors transport you straight to Nepal and India.",
              },
              {
                image: testimonialImage,
                name: "Jane Smith",
                review:
                  "Authentic, flavorful, and delivered on time. Saffron Kitchen is my go-to for comfort food with a twist.",
              },
              {
                image: testimonialImage,
                name: "Michael Johnson",
                review:
                  "I was blown away by the quality and taste of the meals. Every dish is a masterpiece!",
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: "32px",
                    background: "rgba(255,255,255,0.8)",
                    boxShadow: "12px 12px 32px rgba(0, 0, 0, 0.06)",
                    border: "1px solid rgba(255,255,255,0.5)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      objectFit: "cover",
                      mb: 2,
                    }}
                    image={testimonial.image}
                    alt={testimonial.name}
                  />
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      "{testimonial.review}"
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      - {testimonial.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          py: 10,
          backgroundColor: "rgba(255,255,255,0.8)",
          borderRadius: "32px",
          p: 6,
          textAlign: "center",
          boxShadow: "12px 12px 32px rgba(0, 0, 0, 0.06)",
          border: "1px solid rgba(255,255,255,0.5)",
          backdropFilter: "blur(12px)",
          position: "relative",
          zIndex: 2,
          mb: 4,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3 }}>
          Ready to Experience Authentic Flavors?
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, color: "text.secondary" }}>
          Join our community of happy customers today!
        </Typography>
        <Button
          component={Link}
          to="/subscription"
          variant="contained"
          size="large"
          sx={{
            background: "linear-gradient(45deg, #7C83FD, #96BAFF)",
            borderRadius: "24px",
            padding: "16px 40px",
            fontSize: "1.1rem",
            boxShadow: "4px 4px 12px rgba(0,0,0,0.1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "6px 6px 16px rgba(0,0,0,0.15)",
            },
          }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage;
