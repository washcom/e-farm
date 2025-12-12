import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/display-items", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the products");
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Unexpected API response format:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    console.log("Edit product:", product);
  };

  const handleDeleteClick = (product) => {
    console.log("Delete product:", product);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: "90%",
        margin: "auto",
        mt: 4,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          padding: 2,
          backgroundColor: "#1E293B",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        Product Inventory
      </Typography>
      <Table>
        <TableHead sx={{ background: "#374151" }}>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>#</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Product Name</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Price (KES)</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Category</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Stock</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <TableRow
                key={product._id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#F8FAFC" : "#E2E8F0",
                  "&:hover": { backgroundColor: "#CBD5E1" },
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.name || "N/A"}</TableCell>
                <TableCell>{`KES ${product.price}`}</TableCell>
                <TableCell>{product.category || "Uncategorized"}</TableCell>
                <TableCell>{product.stock ?? "0"}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Product">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(product)}
                      sx={{ "&:hover": { color: "#0ea5e9" } }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Product">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(product)}
                      sx={{ "&:hover": { color: "#dc2626" } }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminProducts;
