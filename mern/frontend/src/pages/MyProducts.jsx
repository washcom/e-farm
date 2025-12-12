import React, { useEffect, useState } from "react";
import {
    Card, CardContent, CardHeader, CardMedia,
    Typography, Grid, Container, IconButton, CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const MyProducts = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch user-specific items
    const fetchMyItems = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/items/my-items", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to get the Items");

            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Error fetching items:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyItems();
    }, []);

    const handleDelete = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/items/delete/${itemId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error("Item deletion failed!!");
            }
            const data = await response.json();
            console.log(data);
            // Update state by removing the deleted item
            setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
        } catch (error) {
            console.log(error);
        }
    }
    const editHandle = (itemId) => {
        navigate(`/edit-item/${itemId}`);
    }
    return (
        <Container maxWidth="md" sx={{ marginTop: 3, marginBottom: 3 }}>
            {/* 🔹 Gradient-Filled "My Products" Title */}
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
                My Products
            </Typography>

            <Grid container spacing={3} padding={2} justifyContent="center">
                {loading ? (
                    <Grid item xs={12} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                        <CircularProgress color="primary" />
                        <Typography variant="h6" align="center" mt={2} color="textSecondary">
                            Loading...
                        </Typography>
                    </Grid>
                ) : items.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" color="textSecondary">
                            No products found.
                        </Typography>
                    </Grid>
                ) : (
                    items.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item._id}>
                            <Card>
                                <CardHeader
                                    title={item.name}
                                    action={
                                        <>
                                            <IconButton onClick={() => { handleDelete(item._id) }}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                            <IconButton onClick={() => {
                                                editHandle(item._id)
                                            }}>
                                                <EditIcon color="primary" />
                                            </IconButton>
                                        </>
                                    }
                                />
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={item.image}
                                    alt={item.name}
                                    sx={{ width: "100%", objectFit: "cover", borderRadius: 1 }}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary">
                                        {item.description}
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold" mt={1}>
                                        Ksh:{item.price}
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
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default MyProducts;
