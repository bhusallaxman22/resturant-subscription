// Path: frontend/src/pages/LandingPage.js
import { Typography, Button, Box, Container, Card, CardMedia, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";
import sapphronImage from "../assets/sapphron.png";
import testimonialImage from "../assets/testimonial.jpg";
import menuImage1 from "../assets/menu1.png";
import HeroCarousel from "../components/organisms/HeroCarousel";

// Define animations
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
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        pb: 5,
        mt: 12,
        overflow: "hidden",
      }}
    >
      {/* Hero Carousel (Full Width/Height) */}
      <HeroCarousel />

      {/* 
        An overlay to darken the carousel (optional).
        Makes white text easier to read.
      */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 0,
        }}
      />

      {/* Floating Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 1,
          "& > div": {
            position: "absolute",
            borderRadius: "30px",
            background: "rgba(124, 131, 253, 0.1)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          },
        }}
      >
        <Box
          sx={{
            top: "10%",
            left: "5%",
            width: "80px",
            height: "80px",
            animation: `${float} 6s infinite`,
          }}
        />
        <Box
          sx={{
            bottom: "15%",
            right: "10%",
            width: "120px",
            height: "120px",
            animation: `${float} 7s infinite`,
          }}
        />
      </Box>

      {/* Hero Section Text Overlay */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: { xs: "calc(100vh - 96px)", md: "100vh" }, // subtract navbar height if needed
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
          Savor the Flavors of Nepal & India
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
          Enjoy carefully crafted meals made from traditional recipes delivered right to your door.
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
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* About Section */}
      <Box sx={{ py: 10, backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)" }}>
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
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "32px",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3 }}>
                About Saffron Kitchen
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, fontSize: "1.1rem" }}>
                At Saffron Kitchen, we bring the authentic flavors of Nepal and India to your table.
                Our chefs use traditional recipes passed down through generations, combined with
                fresh, high-quality ingredients to create unforgettable dining experiences.
              </Typography>
              <Link to="/about-us" style={{ textDecoration: "none" }}>
                <Button
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
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 10 }}>
        <Container>
          <Typography variant="h3" sx={{ fontWeight: "bold", textAlign: "center", mb: 6 }}>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: "🍴",
                title: "Choose Your Plan",
                description: "Select from our variety of meal plans tailored to your preferences.",
              },
              {
                icon: "🚚",
                title: "Get It Delivered",
                description: "Fresh meals delivered to your door at your preferred time.",
              },
              {
                icon: "😋",
                title: "Enjoy Your Meal",
                description: "Savor delicious, authentic flavors in the comfort of your home.",
              },
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: "32px",
                    background: "rgba(255,255,255,0.8)",
                    boxShadow: "12px 12px 32px rgba(0, 0, 0, 0.06)",
                    border: "1px solid rgba(255,255,255,0.5)",
                    backdropFilter: "blur(12px)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                    },
                  }}
                >
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {step.icon}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {step.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)" }}>
        <Container>
          <Typography variant="h3" sx={{ fontWeight: "bold", textAlign: "center", mb: 6 }}>
            What Our Customers Say
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                image: testimonialImage,
                name: "John Doe",
                review:
                  "The food is absolutely delicious! The delivery is always on time. Highly recommend Saffron Kitchen.",
              },
              {
                image: testimonialImage,
                name: "Jane Smith",
                review:
                  "Authentic flavors that remind me of home. The meal plans are convenient and affordable.",
              },
              {
                image: testimonialImage,
                name: "Michael Johnson",
                review:
                  "Excellent service and quality. The variety of dishes keeps me coming back for more!",
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    p: 3,
                    height: "100%",
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
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    "{testimonial.review}"
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    - {testimonial.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box sx={{ py: 10 }}>
        <Container
          sx={{
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: "32px",
            p: 6,
            textAlign: "center",
            boxShadow: "12px 12px 32px rgba(0, 0, 0, 0.06)",
            border: "1px solid rgba(255,255,255,0.5)",
            backdropFilter: "blur(12px)",
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
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
