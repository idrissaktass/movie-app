import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Movies from './components/Movies';
import AuthProvider from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import SearchResults from './components/SearchResults';
import FilmQuiz from './components/FilmQuiz';
import { Helmet, HelmetProvider } from "react-helmet-async";
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';

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
            <HelmetProvider>
              <Helmet>
                <title>Diary AI - Personal Journal and Mood Analysis</title>
                <meta name="google-site-verification" content="qWuFVhUHkiJjBTNgbKDHhSduS6BoA8ZDMTkXO2N6wYg" />
                <meta name="google-site-verification" content="qWuFVhUHkiJjBTNgbKDHhSduS6BoA8ZDMTkXO2N6wYg" />
                <meta name="description" content="Find your movie with suggestions" />
                <meta name="keywords" content="Movie Quiz, Film Quiz, Movie Trivia, Film Knowledge Test, Movie Games, movie, movies, film, films, movie suggestion, film suggestion, movie by mood" />
              </Helmet>
              <Routes>
                <Route path="/" element={<Movies />} />
                <Route path="/quiz" element={<FilmQuiz />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/search-results" element={<SearchResults/>} />
                {/* Add protected routes based on authentication */}
                {/* Example: <Route path="/protected" element={isAuthenticated ? <ProtectedComponent /> : <Navigate to="/login" />} /> */}
              </Routes>
              <Footer/>
            </HelmetProvider>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Grid>
  );
}

export default App;
