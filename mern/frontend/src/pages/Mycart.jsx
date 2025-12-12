import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Box,
    Card,
    CardContent,
    CircularProgress
} from "@mui/material";
import { Add, Remove, Delete, ShoppingCartCheckout } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/cart/view-cart", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (!response.ok) throw new Error("Failed to fetch cart items.");

                const data = await response.json();
                setCart(data.cart.items || []);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const updateQuantity = async (itemId, newQuantity) => {
        console.log("Updating item:", itemId, "New Quantity:", newQuantity);
        if (newQuantity < 1) return;

        try {
            const response = await fetch("http://localhost:5000/api/cart/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ itemId, quantity: newQuantity }),
            });

            if (!response.ok) {
                throw new Error("Failed to update cart.");
            }

            setCart((prevCart) =>
                prevCart.map((item) =>
                    item.itemId._id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );

            toast.success("Cart updated successfully!");
        } catch (error) {
            toast.error(`Error updating cart: ${error.message}`);
        }
    };


    const removeItem = async (itemId) => {
        try {
            const response = await fetch("http://localhost:5000/api/cart/remove", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ itemId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to remove item.");
            }

            setCart(prevCart => prevCart.filter(item => item.itemId._id !== itemId));

            toast.success("Item removed from cart.");
        } catch (error) {
            console.error("Remove item error:", error.message);
            toast.error(error.message || "Failed to remove item.");
        }
    };


    const placeOrder = async () => {
        if (cart.length === 0) {
            toast.warn("Your cart is empty!");
            return;
        }

        setLoading(true);

        const orderData = {
            items: cart.map(item => ({
                itemId: item.itemId._id,
                quantity: item.quantity,
                price: item.itemId.price
            })),
            totalPrice: cart.reduce((sum, item) => sum + item.itemId.price * item.quantity, 0)
        };

        try {
            const response = await fetch("http://localhost:5000/api/order/place-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(orderData),
            });
            if (!response.ok) {
                throw new Error("Failed to place order.");
            }

            toast.success("Order placed successfully!");
            setCart([]);
        } catch (error) {
            toast.error(`Order failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.itemId.price * item.quantity, 0);

    if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <ToastContainer position="top-right" autoClose={3000} />

            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom sx={{
                background: "linear-gradient(45deg, #FF6B6B, #6B47FF)",
                WebkitBackgroundClip: "text",
                color: "transparent"
            }}>
                🛒 Shopping Cart
            </Typography>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>

                {cart.length === 0 ? (
                    <Typography align="center">Your cart is empty.</Typography>
                ) : (
                    <>
                        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                        <TableCell><strong>Item</strong></TableCell>
                                        <TableCell align="center"><strong>Quantity</strong></TableCell>
                                        <TableCell align="center"><strong>Price (Ksh)</strong></TableCell>
                                        <TableCell align="center"><strong>Total (Ksh)</strong></TableCell>
                                        <TableCell align="center"><strong>Action</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cart.map((item) => (
                                        <TableRow key={item.itemId._id} sx={{ borderBottom: "1px solid #ddd" }}>
                                            <TableCell>{item.itemId.name}</TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small" onClick={() => updateQuantity(item.itemId._id, item.quantity - 1)}>
                                                    <Remove fontSize="small" />
                                                </IconButton>
                                                {item.quantity}
                                                <IconButton size="small" onClick={() => updateQuantity(item.itemId._id, item.quantity + 1)}>
                                                    <Add fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="center">{item.price.toFixed(2)}</TableCell>
                                            <TableCell align="center"><strong>{(item.price * item.quantity).toFixed(2)}</strong></TableCell>
                                            <TableCell align="center">
                                                <IconButton color="error" onClick={() => removeItem(item.itemId._id)}>
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Card elevation={3} sx={{ mt: 3, p: 2, textAlign: "center", borderRadius: 3, backgroundColor: "#fafafa" }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    Total Amount
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                    Ksh {totalPrice.toFixed(2)}
                                </Typography>
                            </CardContent>
                        </Card>

                        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ShoppingCartCheckout />}
                                onClick={placeOrder}
                                sx={{ fontSize: "1rem", fontWeight: "bold", px: 4, py: 1.5, borderRadius: 3, transition: "0.3s", "&:hover": { backgroundColor: "#0056b3" } }}
                            >
                                Place Order
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default Cart;
