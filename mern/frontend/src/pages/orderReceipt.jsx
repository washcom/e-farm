import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Button, CircularProgress,Box } from "@mui/material";
import { CloudDownload as CloudDownloadIcon } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets.js";

const Receipt = () => {
    const { orderId } = useParams();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReceipt();
    }, []);

    const fetchReceipt = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/payment/order-payment/${orderId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch receipt");
            }

            const data = await response.json();
            setReceipt(data.receipt);
            toast.success("Receipt fetched successfully!");
        } catch (error) {
            console.error("Error fetching receipt:", error);
            toast.error("Failed to fetch receipt.");
        } finally {
            setLoading(false);
        }
    };

    const downloadReceipt = () => {
        const element = document.createElement("a");
        const file = new Blob([receipt], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = `receipt_${orderId}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <Container maxWidth="md" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
            <ToastContainer />
            <Card sx={{ borderRadius: 3, boxShadow: 2, mt: 4, p: 3, width: "80%", textAlign: "center" }}>
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                        <img src={assets.logo} width={50} height={50} style={{ borderRadius: "50%" }} />
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
                            E-Farm-Receipt
                        </Typography>
                    </Box>


                    {loading ? (
                        <CircularProgress sx={{ display: "block", margin: "auto", color: "#1976d2" }} />
                    ) : receipt ? (
                        <Typography
                            variant="body1"
                            sx={{
                                whiteSpace: "pre-wrap",
                                fontSize: 11,
                                fontFamily: "monospace",
                                backgroundColor: "#fff",
                                padding: 1,
                                borderRadius: 2,
                                boxShadow: 1,
                                textAlign: "left",
                                color: "#333",
                            }}
                        >
                            {receipt}
                        </Typography>
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: "center", color: "gray", mt: 2 }}>
                            No receipt available.
                        </Typography>
                    )}

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={downloadReceipt}
                        startIcon={<CloudDownloadIcon />}
                        sx={{
                            mt: 2,
                            fontWeight: "bold",
                            borderRadius: 1,
                            background: "linear-gradient(135deg, #42a5f5, #1e88e5)",
                            "&:hover": { background: "linear-gradient(135deg, #1e88e5, #1565c0)" },
                            py: 1.5,
                        }}
                        disabled={!receipt}
                    >
                        Download Receipt
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Receipt;
