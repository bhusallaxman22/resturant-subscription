// src/theme/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7C83FD",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#96BAFF",
    },
    background: {
      default: "#F5F6FF",
      paper: "#ffffff",
    },
    text: {
      primary: "#2D3142",
      secondary: "#666A7B",
    },
  },
  typography: {
    fontFamily: "'Nunito Sans', sans-serif",
    h1: {
      fontSize: "3rem",
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontSize: "1.35rem",
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 24,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "24px",
          textTransform: "none",
          padding: "12px 28px",
          fontSize: "1rem",
          boxShadow:
            "4px 4px 12px rgba(124, 131, 253, 0.1), -2px -2px 8px rgba(255, 255, 255, 0.8)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              "6px 6px 16px rgba(124, 131, 253, 0.2), -4px -4px 12px rgba(255, 255, 255, 0.9)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "24px",
          boxShadow:
            "8px 8px 24px rgba(0, 0, 0, 0.06), inset 2px 2px 4px rgba(255, 255, 255, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(8px)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          color: "#2D3142",
        },
      },
    },
    // Add or adjust more component styles as needed…
  },
});

export default theme;
