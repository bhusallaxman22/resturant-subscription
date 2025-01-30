import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1", // Modern indigo
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#14b8a6", // Soothing teal
    },
    background: {
      default: "#f8faff",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1d1f",
      secondary: "#6f767e",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          padding: "12px 24px",
          fontSize: "1rem",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: "32px",
          paddingBottom: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "1440px!important",
        },
      },
      defaultProps: {
        maxWidth: "xl",
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(236, 99, 10, 0.6)",
          backdropFilter: "blur(12px)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;
