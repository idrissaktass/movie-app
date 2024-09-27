import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Movies from './components/Movies';
import AuthProvider from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import SearchResults from './components/SearchResults';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Moved inside the App component

  return (
    <Grid bgcolor={"#ff923c42"} style={{ minHeight: '100vh' }}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Movies />} />
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search-results" element={<SearchResults/>} />
              {/* Add protected routes based on authentication */}
              {/* Example: <Route path="/protected" element={isAuthenticated ? <ProtectedComponent /> : <Navigate to="/login" />} /> */}
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Grid>
  );
}

export default App;
