import { Typography, Button, Box, Container, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import sapphronImage from "../assets/sapphron.png";
import testimonialImage from "../assets/testimonial.jpg"; // Replace with real assets
import menuImage1 from "../assets/menu1.png";
import menuImage2 from "../assets/menu2.png";

const LandingPage = () => {
  return (
    <Box sx={{ bgcolor: "#f8faff", pb: 5, mt: 12 }}>
      {/* Hero Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: "100vh",
          alignItems: "center",
          px: 3,
        }}
      >
        <Box sx={{ flex: 1, px: { xs: 2, md: 5 } }}>
          <Typography variant="h1" sx={{ fontWeight: "bold", mb: 2 }}>
            Discover Delicious Meals
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Experience the authentic taste of Nepali and Indian cuisine delivered to your doorstep.
          </Typography>
          <Button
            component={Link}
            to="/subscription"
            variant="contained"
            color="primary"
            size="large"
          >
            Get Started
          </Button>
        </Box>
        <Box sx={{ flex: 1, px: { xs: 2, md: 5 } }}>
          <img
            src={sapphronImage}
            alt="Saffron Kitchen"
            style={{
              maxWidth: "100%",
              height: "40vh",
              borderRadius: "16px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          />
        </Box>
      </Box>

      {/* How It Works */}
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Container sx={{ mt: 5 }}>
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

      <Container sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
          How It Works
        </Typography>
        <Grid container spacing={3}>
          {["Choose a Plan", "Get it Delivered", "Enjoy Your Meal"].map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ p: 3 }}>
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
      <Container sx={{ py: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
          What Our Customers Say
        </Typography>
        <Card sx={{ display: "flex", p: 2, alignItems: "center", boxShadow: 3 }}>
          <CardMedia
            component="img"
            sx={{ width: 100, borderRadius: "50%" }}
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
      <Container>
        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
          Featured Dishes
        </Typography>
        <Grid container spacing={3}>
          {[menuImage1, menuImage2].map((image, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={image}
                  alt={`Dish ${index + 1}`}
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
