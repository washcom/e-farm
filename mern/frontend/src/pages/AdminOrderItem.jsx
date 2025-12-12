import React, { useEffect, useState } from "react";
import {
  Button,
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
import { Delete, LocalShipping } from "@mui/icons-material";

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/display-orders", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []); 

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
        Orders
      </Typography>
      <Table>
        <TableHead sx={{ background: "#374151" }}>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>#</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total (KES)</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <TableRow
                key={order._id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#F8FAFC" : "#E2E8F0",
                  "&:hover": { backgroundColor: "#CBD5E1" },
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{order.totalPrice}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Tooltip title={order.status === "Pending" ? "Mark as Shipped" : "Mark as Pending"}>
                    <IconButton
                      color="primary"
                      onClick={() => updateOrderStatus(order._id, order.status)}
                      sx={{ "&:hover": { color: "#0ea5e9" } }}
                    >
                      <LocalShipping />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Order">
                    <IconButton
                      color="error"
                      onClick={() => deleteOrder(order._id)}
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
              <TableCell colSpan={4} align="center">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminOrderList;
