import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CircularProgress,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";
const VerifyOtp = () => {
    const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Function to send OTP
  const handlesendOtp = async () => {
    try {
      setIsSending(true);
      const response = await fetch("http://localhost:5000/api/auth/send-verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        setCountdown(60);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setIsSending(false);
    }
  };
  // Function to verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setIsVerifying(true);
      const response = await fetch("http://localhost:5000/api/auth/verifyAccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Account verified successfully!");
        setTimeout(()=> navigate("/update-profile"),2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("OTP verification failed. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Card sx={{ p: 5, borderRadius: 3, boxShadow: 4, width: 494, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#333" }}>
          Verify Your Account
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handlesendOtp}
              disabled={isSending || countdown > 0}
            >
              {isSending ? <CircularProgress size={24} sx={{ color: "white" }} /> : 
              countdown > 0 ? `Resend OTP in ${countdown}s` : "Send OTP"}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Enter OTP"
              variant="outlined"
              inputProps={{ maxLength: 6, inputMode: "numeric", pattern: "[0-9]*" }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleVerifyOtp}
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Verify OTP"}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />
    </Box>
  );
};

export default VerifyOtp;
