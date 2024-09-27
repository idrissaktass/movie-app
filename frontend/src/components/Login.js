import React, { useState } from "react";
import { TextField, Button, Snackbar, Grid, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginService } from "../services/AuthService";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const token = await loginService(email, password);
      localStorage.setItem("token", token); // Store token in localStorage
      localStorage.setItem("email", email);
      setIsAuthenticated(true); // Update authentication state
      setSnackbarMessage("Login successful!");
      navigate("/"); // Redirect to homepage
    } catch (error) {
      setSnackbarMessage("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setOpenSnackbar(true);
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
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
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
                  Login
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
        <Snackbar
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
          autoHideDuration={4000}
        />
        <Typography mt={1} textAlign={"end"}>
          Don't you have an account? <span onClick={() => navigate("/signup")} style={{cursor:"pointer", color:"#1976d2"}}>Sign Up.</span>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Login;
