import { Typography, Button, Box, Container, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";
import sapphronImage from "../assets/sapphron.png";
import testimonialImage from "../assets/testimonial.jpg"; // Replace with real assets
import menuImage1 from "../assets/menu1.png";
import menuImage2 from "../assets/menu2.png";

// Define a gentle floating animation
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const LandingPage = () => {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(145deg, #F5F6FF, #FFFFFF)",
        pb: 5,
        mt: 12,
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

      {/* Hero Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          px: 3,
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left: Headline & CTA */}
        <Box sx={{ flex: 1, px: { xs: 2, md: 5 } }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: "#7C83FD",
              textShadow: "2px 2px 8px rgba(124, 131, 253, 0.2)",
            }}
          >
            Discover Delicious Meals
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Experience the authentic taste of Nepali and Indian cuisine delivered to your doorstep.
          </Typography>
          <Button
            component={Link}
            to="/subscription"
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(45deg, #ff6f61, #ffa726)",
              borderRadius: "24px",
              padding: "12px 32px",
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
        {/* Right: Image */}
        <Box sx={{ flex: 1, px: { xs: 2, md: 5 } }}>
          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.8)",
              borderRadius: "24px",
              padding: 2,
              boxShadow:
                "12px 12px 32px rgba(0, 0, 0, 0.06), -8px -8px 24px rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(255,255,255,0.5)",
              backdropFilter: "blur(12px)",
              animation: `${float} 4s ease-in-out infinite`,
            }}
          >
            <img
              src={sapphronImage}
              alt="Saffron Kitchen"
              style={{
                maxWidth: "100%",
                height: "40vh",
                borderRadius: "16px",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* How It Works Introduction */}
      <Box sx={{ textAlign: "center", py: 5, position: "relative", zIndex: 1 }}>
        <Container
          sx={{
            mt: 5,
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: "24px",
            padding: 3,
            boxShadow:
              "12px 12px 32px rgba(0, 0, 0, 0.06), -8px -8px 24px rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(255,255,255,0.5)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Saffron Kitchen
          </Typography>
          <Typography variant="h6">Authentic Nepali & Indian flavors🌶️</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Fresh & made with love 💛
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, fontStyle: "italic" }}>
            COMING SOON!!
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            SIGN UP FOR 50% OFF⬇️
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            component="a"
            href="https://forms.gle/oKyzN1QCYy5pawidA"
            target="_blank"
            rel="noopener noreferrer"
          >
            forms.gle/oKyzN1QCYy5pawidA
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            5005 S Cooper St Suite 163, Arlington, Texas 76017
          </Typography>
        </Container>
      </Box>

      {/* How It Works Steps */}
      <Container sx={{ textAlign: "center", py: 5, position: "relative", zIndex: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
          How It Works
        </Typography>
        <Grid container spacing={3}>
          {["Choose a Plan", "Get it Delivered", "Enjoy Your Meal"].map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  p: 3,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: "24px",
                  boxShadow:
                    "12px 12px 32px rgba(0, 0, 0, 0.06), -8px -8px 24px rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{step}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {`Description for step ${index + 1}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials */}
      <Container sx={{ py: 5, position: "relative", zIndex: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
          What Our Customers Say
        </Typography>
        <Card
          sx={{
            display: "flex",
            p: 2,
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.5)",
            backdropFilter: "blur(12px)",
            boxShadow:
              "12px 12px 32px rgba(0, 0, 0, 0.06), -8px -8px 24px rgba(255, 255, 255, 0.8)",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
              mr: 2,
            }}
            image={testimonialImage}
            alt="Customer"
          />
          <CardContent>
            <Typography variant="body1">
              "The food is absolutely delicious! The delivery is always on time. Highly recommend Saffron Kitchen."
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              - John Doe
            </Typography>
          </CardContent>
        </Card>
      </Container>

      {/* Featured Menu */}
      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
          Featured Dishes
        </Typography>
        <Grid container spacing={3}>
          {[menuImage1, menuImage2].map((image, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: "24px",
                  boxShadow:
                    "12px 12px 32px rgba(0, 0, 0, 0.06), -8px -8px 24px rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={image}
                  alt={`Dish ${index + 1}`}
                  sx={{ borderRadius: "16px" }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
