import React, { useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { ToastContainer } from "react-toastify";
import ProductCard from '../components/ProductCard';

const Homepage = () => {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [serverError, setServerError] = React.useState(false);

    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then((response) => {
                if (response.ok) return response.json();
                throw new Error("Server loading error.");
            })
            .then((data) => {
                setProducts(Array.isArray(data.data) ? data.data : []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setServerError(true);
                setLoading(false);
            });
    }, []);

    const handleDeletecard = (deletedId) => {
        setProducts(products.filter((product) => product._id !== deletedId));
    };

    const handleUpdateProduct = (updatedProduct) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product._id === updatedProduct._id ? updatedProduct : product
            )
        );
    };

    if (loading) {
        return <Typography variant="h6" align="center">Loading...</Typography>;
    }

    return (
        <Container>
            <ToastContainer />
            {serverError ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
                    <Typography variant="h6" color="error">Failed to load products.</Typography>
                </Box>
            ) : (
                <ProductCard products={products} handleDeletecard={handleDeletecard} handleUpdateProduct={handleUpdateProduct} />
            )}
        </Container>
    );
};

export default Homepage;
