import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, CardActions, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import EditProductCard from './EditProductCard';

const ProductCard = ({ products, handleDeletecard, handleUpdateProduct }) => {
    const [openEditModal, setOpenEditModal] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(null);

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setOpenEditModal(true);
    };

    const handleCloseModal = () => {
        setOpenEditModal(false);
        setSelectedProduct(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    handleDeletecard(id);
                    toast.success("🎉 Product deleted successfully!", { theme: "colored" });
                } else {
                    throw new Error("Failed to delete product.");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("❌ Error deleting product.", { theme: "colored" });
            }
        }
    };

    return (
        <Box sx={{
            borderRadius: { xs: 2, md: 4 }, display: 'flex',
            flexWrap: 'wrap', gap: 2, p: 2, marginTop: "90px", padding: "20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
        }}>
            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{
                            width: "260px", display: 'flex', flexDirection: 'column',
                            justifyContent: 'space-between', height: '100%',
                            transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' }
                        }}>
                            <CardMedia component="img" alt={product.name} height="200"
                                image={`https://picsum.photos/400/200?random=${Math.random()}`} />
                            <CardContent>
                                <Typography variant="h6" gutterBottom noWrap>{product.name}</Typography>
                                <Typography variant="h6" color="primary">Ksh:{product.price.toFixed(2)}</Typography>
                            </CardContent>
                            <CardActions sx={{ width: "100%", justifyContent: "space-between" }}>
                                <Button variant="text" color="success" startIcon={<EditIcon />}
                                    onClick={() => handleEdit(product)} />
                                <Button variant="text" color="error" startIcon={<DeleteIcon />}
                                    onClick={() => handleDelete(product._id)} />
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {selectedProduct && (
                <EditProductCard open={openEditModal} handleClose={handleCloseModal}
                    product={selectedProduct} handleUpdate={handleUpdateProduct} />
            )}
        </Box>
    );
};

export default ProductCard;
