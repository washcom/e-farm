import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AccountBalanceWallet,
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";

const MyWallet = () => {
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accessToken, setAccessToken] = useState("");

  // Fetch Wallet Data
  const fetchWallet = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/wallet/my-wallet",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("You don't have an active wallet account.");
      }

      const data = await response.json();
      setWalletData(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch Access Token
  const fetchToken = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/daraja/access-Token",
        {
          method: "GET",
          credentials: "include", // Include cookies in request
        }
      );

      const data = await response.json();
      if (response.ok) {
        setAccessToken(data);
        console.log("Access Token:", data);
      } else {
        console.log("Failed to retrieve token. Generate it first.");
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  // Deposit via M-Pesa
  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.warn("Enter a valid amount.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/daraja/deposit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: phoneNumber, amount }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(data.CustomerMessage || "Deposit initiated successfully.");
        fetchWallet(); // Refresh wallet balance
      } else {
        toast.error(data.error || "Failed to initiate deposit.");
      }
    } catch (error) {
      toast.error("Error processing deposit.");
    }
  };

  // Withdraw to M-Pesa
  const handleWithdraw = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.warn("Enter a valid amount.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/wallet/withdraw",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: phoneNumber, amount }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Withdrawal request sent.");
        fetchWallet(); // Refresh wallet balance
      } else {
        toast.error(data.error || "Failed to process withdrawal.");
      }
    } catch (error) {
      toast.error("Error processing withdrawal.");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchWallet();
      fetchToken();
    }, 250);
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Card
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 5,
          p: 3,
          boxShadow: 4,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <AccountBalanceWallet fontSize="large" sx={{ color: "#009688" }} />
            <Typography variant="h5" fontWeight="bold">
              My Wallet
            </Typography>
          </Box>

          {isLoading ? (
            <CircularProgress />
          ) : walletData ? (
            <>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 1, color: "#009688" }}
              >
                Wallet Name:{" "}
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#00796B",
                  }}
                >
                  {walletData.userId.name}
                </span>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "#4CAF50",
                  mb: 2,
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  backgroundColor: "#E8F5E9",
                  padding: "8px",
                  borderRadius: "5px",
                }}
              >
                Balance: Ksh {walletData.balance.toFixed(2)}
              </Typography>

              <TextField
                fullWidth
                label="Enter Phone Number (2547XXXXXXXX)"
                variant="outlined"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Enter Amount (Ksh)"
                variant="outlined"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ArrowUpward />}
                  onClick={handleDeposit}
                >
                  Deposit via M-Pesa
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<ArrowDownward />}
                  onClick={handleWithdraw}
                >
                  Withdraw to M-Pesa
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No wallet data found.
            </Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default MyWallet;
