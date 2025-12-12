import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, CardContent, Typography, Grid, Button, Box } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { toast, ToastContainer } from "react-toastify";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useNavigate } from "react-router-dom";

const PaymentSection = () => {
  const { orderId } = useParams(); // Extract orderId from URL
  const [walletData, setWalletData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/wallet/my-wallet", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Can't fetch wallet data");
        }

        const data = await response.json();
        setWalletData(data);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    const fetchOrderData = async () => {
      if (!orderId) return;
      try {
        const response = await fetch(`http://localhost:5000/api/order/one-order/${orderId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order data");
        }

        const data = await response.json();
        setOrderData(data);
        console.log("order", data)
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
    fetchOrderData();
  }, [orderId]);

  if (isLoading) {
    return <Typography sx={{ textAlign: "center", mt: 4 }}>Loading data...</Typography>;
  }

  if (!walletData) {
    return <Typography sx={{ textAlign: "center", mt: 4, color: "red" }}>Error: No wallet data found.</Typography>;
  }
  const handleCheckout = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/payment/checkout/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({}),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Payment failed.");
      }
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }

  };
  //generating payment receipt
  const receipt = (orderId) => {
    navigate(`/receipt/${orderData._id}`);
  };

  // Extract user details
  const userName = walletData.userId?.name || "Unknown User";
  const balance = walletData.balance !== undefined ? walletData.balance : "N/A";
  const totalPrice = orderData?.totalPrice ?? "N/A";
   

  return (
    <Container maxWidth="sm">
      <ToastContainer />
      <Card sx={{ borderRadius: 2, boxShadow: 2, mt: 4, p: 2 }}>
        <CardContent>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
          >
            <MonetizationOnIcon
              sx={{ verticalAlign: "middle", mr: 1, color: "primary.main" }}
            />
            Payment Section
          </Typography>

          <Typography
            variant="body1"
            sx={{ textAlign: "center", fontSize: 18, fontWeight: 500, mb: 2 }}
          >
            <strong>Name:</strong> {userName}
          </Typography>

          <Box
            sx={{
              mt: 2,
              p: 2,
              textAlign: "center",
              borderRadius: 1,
              backgroundColor: "#f5f5f5",
            }}
          >
            <AccountBalanceWalletIcon
              sx={{ verticalAlign: "middle", mr: 1, color: "primary.main" }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: balance > 0 ? "green" : "red",
              }}
            >
              Token Balance: {balance} Tokens
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 2,
              p: 2,
              textAlign: "center",
              borderRadius: 1,
              backgroundColor: "#f5f5f5",
            }}
          >
            <MonetizationOnIcon
              sx={{ verticalAlign: "middle", mr: 1, color: "secondary.main" }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: totalPrice !== "N/A" ? "black" : "gray",
              }}
            >
              Amount to Pay: {totalPrice} Tokens
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={4}>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                startIcon={<MonetizationOnIcon />}
                sx={{ fontWeight: "bold", borderRadius: 1 }}
              >
                Checkout
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={() => receipt(orderData._id)}
                startIcon={<ReceiptIcon />}
                sx={{ fontWeight: "bold", borderRadius: 1 }}
              >
                Receipt
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PaymentSection;
