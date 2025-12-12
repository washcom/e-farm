import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  Avatar,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Chip
} from "@mui/material";
import {
  Email,
  Phone,
  VerifiedUser,
  Public,
  LocationCity,
  Transgender
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const abortController = new AbortController();
        
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/user/data", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    signal: abortController.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.message || "Error fetching user data");
                }

                if (!data.userData.isAccountVerified) {
                    toast.error("Account not verified! Redirecting...");
                    setTimeout(() => navigate("/send-otp"), 3000);
                    return;
                }

                setUser(data.userData);
                setError(null);
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError(err.message);
                toast.error(err.message);
                setTimeout(() => navigate("/login"), 3000);
            } finally {
                setLoading(false);
            }
        };

        // Add slight delay for better UX
        const fetchTimer = setTimeout(fetchUserData, 250);
        
        return () => {
            abortController.abort();
            clearTimeout(fetchTimer);
        };
    }, [navigate]);

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress 
                    size={60} 
                    thickness={4} 
                    sx={{ 
                        color: theme.palette.primary.main,
                        animation: `${float} 2s ease-in-out infinite`
                    }} 
                />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
                <Typography variant="body1">
                    Redirecting to login page...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4, background: 'linear-gradient(160deg, #f3f4f6 0%, #e5e7eb 100%)', minHeight: '100vh' }}>
            <Card sx={{ 
                borderRadius: 6,
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                position: 'relative',
                overflow: 'visible',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)' }
            }}>
                <CardContent sx={{ p: 5 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ 
                                width: 140, 
                                height: 140, 
                                fontSize: 52,
                                bgcolor: 'primary.main',
                                mb: 3,
                                mx: 'auto',
                                transform: 'translateY(-50%)',
                                boxShadow: 3,
                                border: '3px solid',
                                borderColor: 'primary.light',
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                animation: `${float} 4s ease-in-out infinite`,
                                '&:hover': { transform: 'translateY(-50%) scale(1.05)' }
                            }}>
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" component="h1" sx={{ 
                                fontWeight: 800,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                                letterSpacing: '-0.5px'
                            }}>
                                {user.name}
                            </Typography>
                            <Chip
                                icon={<VerifiedUser fontSize="small" />}
                                label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                color="primary"
                                variant="outlined"
                                sx={{ 
                                    borderRadius: 2,
                                    borderWidth: 2,
                                    fontWeight: 600,
                                    backdropFilter: 'blur(4px)'
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ 
                                my: 2, 
                                background: `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.light} 50%, transparent 100%)`,
                                height: '2px'
                            }} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <List disablePadding>
                                {[
                                    { icon: <Email />, primary: "Email", secondary: user.email },
                                    { icon: <Phone />, primary: "Phone", secondary: user.phone || "Not provided" },
                                    { icon: <Transgender />, primary: "Gender", secondary: user.sex || "Not specified" },
                                ].map((item, index) => (
                                    <ListItem key={index} sx={{
                                        borderRadius: 3,
                                        mb: 1,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(144, 202, 249, 0.1)',
                                            transform: 'translateX(8px)'
                                        }
                                    }}>
                                        <ListItemIcon sx={{ 
                                            minWidth: 44,
                                            color: 'primary.main' 
                                        }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={item.primary} 
                                            primaryTypographyProps={{ fontWeight: 600 }}
                                            secondary={item.secondary}
                                            secondaryTypographyProps={{ 
                                                sx: { 
                                                    color: 'text.primary',
                                                    fontWeight: 500
                                                }
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <List disablePadding>
                                {[
                                    { icon: <Public />, primary: "Country", secondary: user.country || "Not provided" },
                                    { icon: <LocationCity />, primary: "County", secondary: user.county || "Not provided" },
                                ].map((item, index) => (
                                    <ListItem key={index} sx={{
                                        borderRadius: 3,
                                        mb: 1,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(144, 202, 249, 0.1)',
                                            transform: 'translateX(8px)'
                                        }
                                    }}>
                                        <ListItemIcon sx={{ 
                                            minWidth: 44,
                                            color: 'primary.main' 
                                        }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={item.primary} 
                                            primaryTypographyProps={{ fontWeight: 600 }}
                                            secondary={item.secondary}
                                            secondaryTypographyProps={{ 
                                                sx: { 
                                                    color: 'text.primary',
                                                    fontWeight: 500
                                                }
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Profile;