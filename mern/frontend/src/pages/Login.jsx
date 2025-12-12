import {
  Container,
  Button,
  CssBaseline,
  Stack,
  Typography,
  TextField,
  Box,
  Divider,
  CircularProgress,
  InputAdornment,
  Link
} from "@mui/material";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Google, Email, Lock } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.error || "Login failed. Try again.");
      }
      if (data.role === "admin") {
        setTimeout(() => navigate("/admin-dashboard"), 2000);
        toast.success("Login successful! Redirecting...");
      }
      else {
        setTimeout(() => navigate('/dashboard'), 2000);
        toast.success("Login successful! Redirecting...");
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        p: 1,
      }}
    >
      <CssBaseline />
      <ToastContainer position="top-right" autoClose={3000} />
      <Container
        maxWidth="sm"
        sx={{
          animation: `${fadeIn} 0.6s ease`,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          p: 2,
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <Box textAlign="center" mb={2}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Welcome Back
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Sign in to continue
          </Typography>
        </Box>

        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            label="Email"
            size="small"
            name="email"
            type="email"
            fullWidth
            value={formData.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                borderWidth: '2px',
                borderColor: 'primary.main'
              }
            }}
            onChange={handleChange}
          />

          <TextField
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            size="small"
            fullWidth
            value={formData.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                borderWidth: '2px',
                borderColor: 'primary.main'
              }
            }}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: "12px",
              background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
              },
              transition: "all 0.3s ease",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>

          <Divider sx={{ color: "text.secondary" }}>OR</Divider>

          <Button
            variant="outlined"
            size="small"
            onClick={handleGoogleLogin}
            sx={{
              py: 1.5,
              borderRadius: "12px",
              borderColor: "#ddd",
              "&:hover": {
                borderColor: "#ccc",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                transform: "translateY(-1px)"
              },
              transition: "all 0.3s ease",
            }}
            startIcon={<Google sx={{ color: "#DB4437" }} />}
          >
            Sign in with Google
          </Button>

          {/* Forgot Password and Sign Up Links */}
          <Box textAlign="center" mt={2}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/reset-password")}
              sx={{
                textDecoration: "none",
                color: "#667eea",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          <Box textAlign="center" mt={1}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/signup")}
                sx={{
                  textDecoration: "none",
                  color: "#667eea",
                  fontWeight: "600",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Login;
