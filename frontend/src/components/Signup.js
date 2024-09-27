import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signupService } from '../services/AuthService';

const Signup = ( ) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await signupService(username, email, password); // Get the token after signup
      setIsAuthenticated(true); // Update the app state to reflect that the user is logged in
      navigate('/'); // Redirect to home page
    } catch (err) {
      console.error('Signup failed', err);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "100vh"}}>
      <Grid item xs={11} sm={8} md={6} lg={5} xl={4}>
        <Box
          sx={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
          }}
        >
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
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Signup
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
        <Typography mt={1} textAlign={"end"}>
          Do you have an account? <span onClick={() => navigate("/login")} style={{cursor:"pointer", color:"#1976d2"}}>Sign In.</span>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Signup;
