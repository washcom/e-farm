import React, { useEffect, useState } from "react";
import { 
    Card, CardContent, CardHeader, CardMedia, 
    Typography, Grid, Container, IconButton, CircularProgress 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyWishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    

    const fetchWishlist = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/wishlist/get-wishlist", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch wishlist");
            const data = await response.json();
            setWishlist(data);
        } catch (error) {
            toast.error("Failed to load wishlist!");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleDeleteFromWishlist = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/wishlist/remove/${itemId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
    
            setWishlist(prev => prev.filter(item => item.itemId._id !== itemId));
            toast.success("Item removed successfully! 🎉");
        } catch (error) {
            toast.error(error.message);
        }
    };
    
    return (
        <Container sx={{ marginTop: 3, marginBottom: 3 }}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

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
                My Wishlist
            </Typography>

            <Grid container spacing={3} padding={2} justifyContent="center">
                {loading ? (
                    <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress color="primary" />
                    </Grid>
                ) : wishlist.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" color="textSecondary">
                            No items in wishlist.
                        </Typography>
                    </Grid>
                ) : (
                    wishlist.map((wishlistItem) => {
                        const product = wishlistItem.itemId;
                        return (
                            <Grid item xs={12} sm={6} md={4} key={wishlistItem._id}>
                                <Card sx={{ height: 350, display: "flex", flexDirection: "column" }}>
                                    <CardHeader 
                                        title={product.name} 
                                        action={
                                            // Corrected comment syntax here
                                            <IconButton onClick={() => handleDeleteFromWishlist(product._id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        }
                                    />
                                    <CardMedia 
                                        component="img"
                                        height="180"
                                        image={product.image} 
                                        alt={product.name}
                                        sx={{ width: "100%", objectFit: "cover", borderRadius: 1}}
                                    />
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary">
                                            {product.description}
                                        </Typography>
                                        <Typography variant="h6" mt={1} fontWeight="bold">
                                            Ksh {product.price?.toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                )}
            </Grid>
        </Container>
    );
};

export default MyWishlist;