import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";

const facebookTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1877F2", // Facebook blue
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#42B72A", // Facebook green
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F0F2F5", // Facebook background
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1C1E21", // Dark text
      secondary: "#606770", // Lighter text
      disabled: "#BEC3C9", // Muted text
    },
    divider: "rgba(28, 30, 33, 0.12)",
  },
  typography: {
    fontFamily: [
      '"Segoe UI"', // Facebook uses Segoe UI
      '"Roboto"',
      '"Arial"',
      'sans-serif',
    ].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          padding: "10px 24px",
          fontSize: "1rem",
          fontWeight: 600,
          transition: "background 0.3s ease",
          "&:hover": {
            opacity: 0.9,
          },
        },
        containedPrimary: {
          backgroundColor: "#1877F2",
          "&:hover": {
            backgroundColor: "#166FE5",
          },
        },
        containedSecondary: {
          backgroundColor: "#42B72A",
          "&:hover": {
            backgroundColor: "#36A420",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          background: "#FFFFFF",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          "& label": {
            color: "#606770",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "& fieldset": {
              borderColor: "#DADDE1",
            },
            "&:hover fieldset": {
              borderColor: "#1877F2",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1877F2",
              boxShadow: "0 0 0 2px rgba(24, 119, 242, 0.2)",
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          "&::before, &::after": {
            borderColor: "rgba(28, 30, 33, 0.12)",
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={facebookTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
