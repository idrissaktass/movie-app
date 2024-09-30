import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signupService } from '../services/AuthService';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when signup starts
    try {
      const token = await signupService(username, email, password); // Get the token after signup
      localStorage.setItem("token", token); // Store token in localStorage if needed
      setLoading(false); // Set loading to false after the signup process
      navigate('/'); // Redirect to home page
    } catch (err) {
      console.error('Signup failed', err);
      setLoading(false); // Ensure loading is set to false even on error
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "100vh" }}>
      <Grid item xs={11} sm={8} md={6} lg={5} xl={4}>
        <Box
          sx={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            position: "relative", // Set position relative to position CircularProgress
          }}
        >
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)", // Center the loader
                zIndex: 1, // Ensure it appears above other elements
              }}
            />
          )}
          <Typography variant="h5" gutterBottom>
            Signup
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading} // Disable input while loading
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading} // Disable input while loading
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading} // Disable input while loading
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Signup"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
        <Typography mt={1} textAlign={"end"}>
          Do you have an account? <span onClick={() => navigate("/login")} style={{ cursor: "pointer", color: "#1976d2" }}>Sign In.</span>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Signup;
