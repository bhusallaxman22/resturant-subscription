import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7C83FD", // Softer indigo
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#96BAFF", // Pastel teal
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "24px",
          textTransform: "none",
          padding: "12px 28px",
          fontSize: "1rem",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "4px 4px 12px rgba(124, 131, 253, 0.1), -2px -2px 8px rgba(255, 255, 255, 0.8)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "6px 6px 16px rgba(124, 131, 253, 0.2), -4px -4px 12px rgba(255, 255, 255, 0.9)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "32px",
          boxShadow: "8px 8px 24px rgba(0, 0, 0, 0.06), inset 2px 2px 4px rgba(255, 255, 255, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
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
          color: "#2D3142", // Ensure text color contrast
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            backgroundColor: "#F5F6FF",
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          border: "1px solid #E0E3FF",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "16px",
          borderBottom: "1px solid #E0E3FF",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "16px",
        },
      },
    },
    MuiTypography: {
      MuiTypography: {
        styleOverrides: {
          h1: {
            fontSize: '4rem',
            lineHeight: 1.2,
            '@media (max-width: 600px)': {
              fontSize: '2.5rem'
            }
          },
          h3: {
            fontSize: '2.5rem',
            '@media (max-width: 600px)': {
              fontSize: '2rem'
            }
          }
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          overflow: "hidden",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#F5F6FF",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "#666A7B",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontWeight: 600,
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          "& .MuiTableSortLabel-icon": {
            color: "#7C83FD !important",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "capitalize",
          fontWeight: 600,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "#F5F6FF",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
  },
  shape: {
    borderRadius: 24,
  },
});

export default theme;