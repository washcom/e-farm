import React from "react";
import { Box, Typography, AppBar, Toolbar, Button, CssBaseline } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";

const SignupAndLogin = () => {
  const navigate = useNavigate();
  return (
    <>
      <CssBaseline />
      <AppBar sx={{ backgroundColor: "#0D1B2A" }}>
        <Toolbar>
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            {/* Left Section - App Title */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h4"
                component="div" // Ensure it has a valid HTML component
                sx={{
                  background: "linear-gradient(90deg, rgb(120, 20, 150), rgb(110, 97, 219))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "bold",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                E-Farm-App
              </Typography>
            </Box>

            {/* Right Section - Login Button */}
            <Button
              onClick={() => navigate("/login")}
              variant="text"
              color="secondary"
              sx={{ borderRadius: 2 }}
            >
              Login <LoginIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};
export default SignupAndLogin;
