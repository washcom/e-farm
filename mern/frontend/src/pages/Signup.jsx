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
  InputAdornment
} from "@mui/material";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Google, Person, Email, Lock } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Signup = () => {
  const navegate=useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed. Try again.");
      }
      
      toast.success(data.message || "Signup successful! You can now log in.");
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      setTimeout(()=>
        navegate('/login'),2000);      
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
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
            Create Account
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Join our community today
          </Typography>
        </Box>

        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            label="Username"
            name="username"
            size="small"
            fullWidth
            value={formData.username}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "12px", backgroundColor: "rgba(255, 255, 255, 0.8)" },
            }}
            onChange={handleChange}
          />

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
              sx: { borderRadius: "12px", backgroundColor: "rgba(255, 255, 255, 0.8)" },
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
              sx: { borderRadius: "12px", backgroundColor: "rgba(255, 255, 255, 0.8)" },
            }}
            onChange={handleChange}
          />

          <TextField
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            size="small"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "12px", backgroundColor: "rgba(255, 255, 255, 0.8)" },
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
              'Create Account'
            )}
          </Button>

          <Divider sx={{ color: "text.secondary" }}>OR</Divider>

          <Button
            variant="outlined"
            size="small"
            onClick={handleGoogleSignup}
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
            Continue with Google
          </Button>

          <Typography
            align="center"
            sx={{
              mt: 1,
              cursor: "pointer",
              color: "text.secondary",
              "&:hover": { textDecoration: "underline" },
              transition: "all 0.2s ease",
            }}
          >
            Already have an account?{" "}
            <span 
              style={{ color: "#667eea", fontWeight: 500 }}
              onClick={() => window.location.href = "/login"}
            >
              Log In
            </span>
          </Typography>          
        </Stack>
      </Container>
    </Box>
  );
};

export default Signup;