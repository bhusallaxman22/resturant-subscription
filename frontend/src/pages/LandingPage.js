import { Typography, Button, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import sapphronImage from "../assets/sapphron.png"; // Ensure the path matches your file structure

const LandingPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // Stacks on small screens, side-by-side on larger screens
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 5,
      }}
    >
      {/* Left Section: Text */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          textAlign: { xs: "center", md: "left" }, // Centered on small screens
          color: "#333",
          px: { xs: 2, md: 5 },
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: "bold", mb: 2 }}>
          Delicious Meals, Delivered!
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Subscribe to our meal plans and enjoy fresh, healthy food every week.
        </Typography>
        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          color="primary"
          size="large"
        >
          Get Started
        </Button>

        {/* Additional Info */}
        <Box sx={{ mt: 5 }}>
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
        </Box>
      </Box>

      {/* Right Section: Image */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 2, md: 5 },
        }}
      >
        <img
          src={sapphronImage}
          alt="Saffron Kitchen"
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "16px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        />
      </Box>
    </Box>
  );
};

export default LandingPage;
