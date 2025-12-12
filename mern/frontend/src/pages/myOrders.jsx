import React, { useEffect, useState } from "react";
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, CircularProgress, Typography, Box
} from "@mui/material";
import { Cancel, ShoppingCart } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    

    useEffect(() => {
        fetchOrders();
        isOrderPaid();
    }, []);
    //fetch order data
    const fetchOrders = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/order/my-orders", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }
            const data = await response.json();
            console.log("Fetched orders:", data);
            setOrders(data || []);
        } catch (error) {
            setError("Error fetching orders. Please try again.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    //const check if order is paid
    const isOrderPaid = async (orderId) => {        
        try {
            const response = await fetch(`http://localhost:5000/api/order/is-order-paid/${orderId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("failed to fetch Payment details");
            }
            const data = await response.json();
            console.log("payment:", data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/order/cancel-order/${orderId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to cancel order");
            }
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: "cancelled" } : order
            ));
            alert("Order cancelled successfully");
        } catch (error) {
            alert("Error cancelling order: " + error.message);
        }
    };

    const purchase = (orderId) => {
        navigate(`/checkout/${orderId}`);
    };
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" mt={3}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" textAlign={'center'} gutterBottom sx={{ color: "#1976d2", fontWeight: "bold" }}>
                My Orders
            </Typography>

            {orders.length === 0 ? (
                <Typography variant="h6" color="textSecondary">
                    No orders found.
                </Typography>
            ) : (
                <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableRow>
                                <TableCell><strong>Order ID</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Total Price (kes)</strong></TableCell>
                                <TableCell><strong>Items</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id} sx={{ '&:nth-of-type(even)': { backgroundColor: "#fafafa" } }}>
                                    <TableCell>{order._id}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{order.totalPrice?.toFixed(2)}</TableCell>
                                    <TableCell>
                                        {order.items?.length > 0 ? (
                                            order.items.map((item, index) => (
                                                <Typography key={index} variant="body2">
                                                    {item.itemId?.name || "Unknown Item"} (x{item.quantity}) - {item.price}
                                                </Typography>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                No items found
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {order.status !== "paid" && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    startIcon={<Cancel />}
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    size="small"
                                                    sx={{ mr: 1 }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<ShoppingCart />}
                                                    onClick={() => purchase(order._id)}
                                                    size="small"
                                                >
                                                    Pay
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default MyOrders;
