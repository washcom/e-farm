import React, { useState } from 'react';
import { TextField, Button, Grid, CircularProgress, Card, Box, Typography, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
const eastAfricanCountries = [
    'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'South Sudan', 'Somalia', 'Ethiopia', 'Djibouti', 'Eritrea'
];

const counties = [
    'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega',
    'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni',
    'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira',
    'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans-Nzoia', 'Turkana',
    'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

const ProfileSettings = () => {
    const redirect = useNavigate();   
    const [formData, setFormData] = useState({
        phone: '',        
        dateOfBirth: '',
        sex: 'Male',
        country: 'Kenya',
        county: '',
        postalCode: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData), // 🔥 FIX: Sending form data in the request
            });
            if (!response.ok) {
                const errorData = await response.json(); // 🔥 FIX: Get error message from server
                throw new Error(errorData.message || "Failed to update user profile!");
            }

            toast.success(response.message || "Profile updated successfully!");
            setTimeout(()=>redirect("/dashboard"),3000);
        } catch (error) {            
            toast.error(error.message || "Something went wrong. Try again.");
            console.log(error.message);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb', py: 6 }}>
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={10} md={8}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2, p: 4, bgcolor: 'white' }}>
                        <Typography variant="h5" align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#333' }}>
                            Update Profile
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        size="medium"
                                        label="Phone Number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        sx={{ bgcolor: 'white', borderRadius: 1 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Gender"
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleInputChange}
                                        sx={{ bgcolor: 'white', borderRadius: 1 }}
                                        size="medium"
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="Other">other</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        required
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        sx={{ bgcolor: 'white', borderRadius: 1 }}
                                        size="medium"
                                    >
                                        {eastAfricanCountries.map((country) => (
                                            <MenuItem key={country} value={country}>{country}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {formData.country === 'Kenya' && (
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            required
                                            label="County"
                                            name="county"
                                            value={formData.county}
                                            onChange={handleInputChange}
                                            sx={{ bgcolor: 'white', borderRadius: 1 }}
                                            size="medium"
                                        >
                                            {counties.map((county) => (
                                                <MenuItem key={county} value={county}>{county}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                )}

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Postal Code"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        sx={{ bgcolor: 'white', borderRadius: 1 }}
                                        size="medium"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        sx={{ bgcolor: 'white', borderRadius: 1 }}
                                        size="medium"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    disabled={isLoading}
                                    onClick={handleSubmit}                                >
                                    {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Changes'}
                                </Button>
                            </Box>
                        </form>
                    </Card>
                </Grid>
            </Grid>
            <ToastContainer />
        </Box>
    );
};
export default ProfileSettings;
