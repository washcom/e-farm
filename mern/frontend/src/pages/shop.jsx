import { useState, useEffect } from "react";
import { 
    Card, CardContent, CardHeader, CardMedia, Typography, 
    IconButton, Container, CircularProgress
} from "@mui/material";
import Grid from "@mui/material/Grid";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Shop = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [added, setAdded] = useState(false);

    const fetchItems = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/display-items", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Fetch error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddtoWishlist = async (itemId) => {
        try {
            const response = await fetch("http://localhost:5000/api/wishlist/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ itemId }),
            });
            if (!response.ok) {
                throw new Error("Server failed to respond");
            }
            const data = await response.json();
            toast.success("Added to wishlist!");
            setAdded(true);
            console.log("Wishlist updated:", data.message);
        } catch (error) {
            toast.error("Failed to add to wishlist");
            console.log("Error adding to wishlist", error.message);
        }
    };

    const handleAddToCart = async (itemId) => {
        try {
            const response = await fetch("http://localhost:5000/api/cart/add-to-cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ itemId, quantity: 1 }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to add item to cart");
            }
    
            const data = await response.json();
            toast.success(data.message);
            console.log("Cart updated:", data.message);
        } catch (error) {
            toast.error("Failed to add to cart");
            console.error("Error adding to cart:", error);
        }
    };

    const calculatePrice = (price, discount) => {
        return discount > 0 
            ? (price * (1 - discount / 100)).toFixed(2)
            : price.toFixed(2);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    if (loading) return (
        <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress />
        </Container>
    );
    if (error) return <Typography color="error" variant="h6" align="center">Error: {error}</Typography>;

    return (
        <Container sx={{ marginTop: 3, marginLeft: 8 }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <Typography 
                variant="h4" 
                align="center" 
                gutterBottom 
                fontWeight="bold"
                sx={{
                    background: "linear-gradient(45deg, #FF6B6B, #6B47FF)",
                    WebkitBackgroundClip: "text",
                    color: "transparent"
                }}
            >
                Our Products
            </Typography>

            <Grid container spacing={3} padding={2}>
                {items.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card>
                            <CardHeader 
                                title={item.name} 
                                action={
                                    <>
                                       
                                            <IconButton onClick={() => handleAddtoWishlist(item._id)}>
                                                <FavoriteBorderIcon color="error" />
                                            </IconButton>
                                          
                                        <IconButton onClick={() => handleAddToCart(item._id)}>
                                            <ShoppingCartIcon color="primary" />
                                        </IconButton>
                                    </>
                                }
                            />
                            <CardMedia 
                                component="img"
                                height="180"
                                image={item.image || "https://via.placeholder.com/800x600"}
                                alt={item.name}
                                sx={{ width: "100%", objectFit: "cover", borderRadius: 1 }}
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary">
                                    {item.description}
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" mt={1}>
                                    Ksh: {calculatePrice(item.price, item.discount)}
                                </Typography>
                                {item.discount > 0 && (
                                    <Typography variant="body2" color="error">
                                        Discount: {item.discount}% off
                                    </Typography>
                                )}
                                <Typography variant="body2" color={item.stock > 0 ? "success.main" : "error"}>
                                    {item.stock > 0 ? `In Stock: ${item.stock}` : "Out of Stock"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Shop;
