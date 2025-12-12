import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  CssBaseline,
  Stack,
  Typography,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [timer, setTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const sendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/send-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      // Show server message only
      toast.success(data.message || "OTP sent to your email!");
      setOtpSent(true);
      setTimer(120);
    } catch (error) {
      // Show server error message only
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      // Show success message only on valid OTP
      toast.success(data.message || "Password reset successfully! Redirecting...");

      // ✅ Only execute the redirect after a successful OTP verification
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.message); // Show only server error message
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <CssBaseline />
      <ToastContainer position="top-right" autoClose={5000} />
      <Container
        maxWidth="sm"
        sx={{
          animation: `${fadeIn} 0.6s ease`,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          p: 4,
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Reset Password
          </Typography>
          <Typography color="text.secondary" variant="body1">
            {otpSent ? "Enter the OTP and new password" : "Enter your email to receive OTP"}
          </Typography>
        </Box>

        <Stack spacing={3} component="form" onSubmit={resetPassword}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />,
              sx: {
                borderRadius: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.1)",
                },
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={sendOTP}
            disabled={timer > 0 || isLoading}
            sx={{
              py: 1.5,
              borderRadius: "12px",
              background:
                timer > 0 || isLoading
                  ? "linear-gradient(45deg, #e0e0e0 30%, #bdbdbd 90%)"
                  : "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
              color: timer > 0 || isLoading ? "text.disabled" : "white",
              "&:hover": {
                transform: timer > 0 ? "none" : "translateY(-2px)",
                boxShadow: timer > 0 ? "none" : "0 4px 12px rgba(102, 126, 234, 0.4)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: "inherit" }} />
            ) : timer > 0 ? (
              `Resend OTP in ${timer}s`
            ) : (
              "Send OTP"
            )}
          </Button>

          {otpSent && (
            <>
              <TextField
                fullWidth
                label="OTP Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                InputProps={{
                  startAdornment: <SecurityIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  sx: {
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.1)",
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  sx: {
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.1)",
                    },
                  },
                }}
              />

              <Button fullWidth variant="contained" type="submit" disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} sx={{ color: "inherit" }} /> : "Reset Password"}
              </Button>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default ResetPassword;