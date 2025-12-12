import React, { useState, useEffect } from "react";
import {
    Box,
    CssBaseline,
    Divider,
    Drawer,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Card,
    Badge,
    Avatar,
    useTheme,
    Tooltip,
} from "@mui/material";
import { Menu, Home, Person, Settings, Logout, AddBox, ShoppingCart, Favorite, Inventory, AccountBalanceWallet, Try, Receipt } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Storefront } from "@mui/icons-material";
import Group from "@mui/icons-material/Group";
import HourglassEmpty from "@mui/icons-material/HourglassEmpty";
import { MonetizationOn } from "@mui/icons-material";

const drawerWidth = 240;
const collapsedWidth = 80;

export default function Dashboard() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalWishlist, setTotalWishlist] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [paidOrders, setPaidOrders] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const theme = useTheme();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: 'MORNING', emoji: '🌅' };
        if (hour < 18) return { text: 'AFTERNOON', emoji: '☀️' };
        return { text: 'EVENING', emoji: '🌙' };
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/user/data", {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();
                console.log(data);

                if (data.userData.isAccountVerified === false) {
                    toast.error("Account not verified, redirecting to verification page...");
                    setTimeout(() => navigate("/send-otp"), 3000);
                }
                if (response.ok) {
                    setUser(data.userData);
                } else {
                    setError(data.message || "Unauthorized access");
                    if (response.status === 401) navigate("/login");
                }
            } catch (err) {
                console.error("Error:", err);
                setError("Failed to load user data");
            }
        };
        setTimeout(() => {
            fetchUserData();
        }, 250);
    }, []);

    //statistics
    useEffect(() => {
        const fetchOrdersStat = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/order/my-total-orders", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to get the user Statistics");
                }

                const data = await response.json();
                setTotalOrders(data.totalOrders);
            } catch (error) {
                console.error("Error fetching orders:", error.message);
                toast.error(error.message);
            }
        };
        const fetchItemsStat = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/items/total-items", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch the  total items");
                }
                const data = await response.json();
                setTotalProducts(data.totalItems);
            } catch (error) {
                console.log(error.message);
            }
        };
        const fetchWishlistStat = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/wishlist/total-wishlist", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Failed to get the  wishlist stats");
                }
                const data = await response.json();
                setTotalWishlist(data.totalWishlist);
            } catch (error) {
                console.log(error.message);
            }
        }
        const fetchCartItemsStat = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/cart/total-cart-items", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch the cart totals")
                }
                const data = await response.json();
                setCartCount(data.totalCartItems);
            } catch (error) {
                console.log(error.message);
            }
        }
        const fetchpaidOrdersStat = async () => {
            const response = await fetch("http://localhost:5000/api/order/total-paid-orders", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            if(response.ok){
                const data = await response.json();
                setPaidOrders(data);
                console.log("paid:",data);
            }
            
        }
        const fetchPendingOrdersStat = async () => {
            const response = await fetch("http://localhost:5000/api/order/total-pending-orders", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            if(response.ok){
                const data = await response.json();
                setPendingOrders(data);
            }
        }
        const fetchRevenueStat = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/order/revenue", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setTotalRevenue(data);  
                    console.log("revenue:",data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        //calling the functions to refresh after 250ms
        setTimeout(() => {
            fetchOrdersStat();
            fetchItemsStat();
            fetchWishlistStat();
            fetchCartItemsStat();
            fetchpaidOrdersStat();
            fetchPendingOrdersStat();
            fetchRevenueStat();            
        }, 250);
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                setTimeout(() => navigate("/"), 2000);
            } else {
                toast.error("Logout failed. Try again.");
            }
        } catch (error) {
            toast.error(`${error.message} Logout failed. Try again later.`);
        }
    };

    const menuItems = [
        { text: "Shop", icon: <Storefront sx={{ color: "#FF9800" }} />, onClick: () => navigate("/go-shopping") },
        { text: "Create", icon: <AddBox sx={{ color: "#2196F3" }} />, onClick: () => navigate("/add-item") },
        { text: "My Wishlist", icon: <Favorite sx={{ color: "#E91E63" }} />, onClick: () => navigate("/mywishlist") },
        { text: "My Orders", icon: <Receipt sx={{ color: "#3F51B5" }} />, onClick: () => navigate("/my-orders") },
        { text: "My Products", icon: <Inventory sx={{ color: "#673AB7" }} />, onClick: () => navigate("/MyProducts") },

        {
            text: "Cart",
            icon: (
                <Badge badgeContent={cartCount} color="error">
                    <ShoppingCart sx={{ color: "#E91E63" }} />
                </Badge>
            ),
            onClick: () => navigate("/my-cart"),
        },
        { text: "My Wallet", icon: <AccountBalanceWallet sx={{ color: "#009688" }} />, onClick: () => navigate("/my-wallet") },

        { text: "Profile", icon: <Person sx={{ color: "#9C27B0" }} />, onClick: () => navigate("/profile") },
        { text: "Logout", icon: <Logout sx={{ color: "#F44336" }} />, onClick: handleLogout },
    ];


    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <CssBaseline />
            <ToastContainer />
            <Drawer
                variant="permanent"
                sx={{
                    width: collapsed ? collapsedWidth : drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: collapsed ? collapsedWidth : drawerWidth,
                        transition: "width 0.3s ease",
                        overflowX: "hidden",
                        bgcolor: "#1e1e1e",
                        color: "#ffffff",
                        borderRight: "1px solid #333",
                    },
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: "#ffffff" }}>
                        <Menu />
                    </IconButton>
                </Toolbar>
                <Divider sx={{ bgcolor: "#333" }} />
                <List>
                    {menuItems.map((item, index) => (
                        <Tooltip key={index} title={item.text} placement="right" arrow disableHoverListener={!collapsed}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    sx={{
                                        justifyContent: collapsed ? "center" : "initial",
                                        px: 2.5,
                                        py: 1.5,
                                        '&:hover': { bgcolor: "#333" },
                                        transition: "background-color 0.2s ease",
                                    }}
                                    onClick={item.onClick}
                                >
                                    <ListItemIcon sx={{ color: "#ffffff", minWidth: "40px" }}>{item.icon}</ListItemIcon>
                                    {!collapsed && <ListItemText primary={item.text} sx={{ ml: 1 }} />}
                                </ListItemButton>
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`,
                    transition: "margin 0.3s ease",
                    color: "#000000",
                    marginTop: 3
                }}
            >
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        background: "linear-gradient(90deg, #673AB7, #3F51B5, #2196F3)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: "bold",
                        textAlign: "center",
                        display: "block",
                        mb: 3,
                    }}
                >
                    GOOD {getGreeting().text}, {user?.name || "Guest"}! {getGreeting().emoji}
                </Typography>

                <Grid container spacing={3}>
                    {[
                        ["Total Orders", totalOrders, "#4CAF50", "linear-gradient(135deg, #4CAF50, #81C784)", <ShoppingCart sx={{ fontSize: 40, color: "#fff" }} />], // Green
                        ["Total Wishlist", totalWishlist, "#FF5722", "linear-gradient(135deg, #FF5722, #FF8A65)", <Favorite sx={{ fontSize: 40, color: "#fff" }} />], // Orange
                        ["Total Products", totalProducts, "#3F51B5", "linear-gradient(135deg, #3F51B5, #7986CB)", <Inventory sx={{ fontSize: 40, color: "#fff" }} />], // Indigo
                        ["Total Revenue", totalRevenue, "#FFD700", "linear-gradient(135deg, #FFD700, #FFEB3B)", <MonetizationOn sx={{ fontSize: 40, color: "#fff" }} />], // Gold
                        ["Paid Orders", paidOrders, "#009688", "linear-gradient(135deg, #009688, #4DB6AC)", <MonetizationOn sx={{ fontSize: 40, color: "#fff" }} />],

                        ["Pending Orders", pendingOrders, "#E91E63", "linear-gradient(135deg, #E91E63, #F48FB1)", <HourglassEmpty sx={{ fontSize: 40, color: "#fff" }} />]  // Pink
                    ].map(([title, value, borderColor, bgColor, icon], idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Card
                                sx={{
                                    p: 3,
                                    textAlign: "center",
                                    borderRadius: "15px", // Rounded corners
                                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)", // Soft shadow
                                    background: bgColor, // Gradient background
                                    color: "#fff", // White text/icons
                                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                    "&:hover": {
                                        transform: "scale(1.05)", // Subtle zoom effect
                                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)", // Enhanced shadow on hover
                                    }
                                }}
                            >
                                {icon}
                                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>{title}</Typography>
                                <Typography variant="h4" sx={{ fontWeight: "bold" }}>{value}</Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </Box>
        </Box>
    );
}
