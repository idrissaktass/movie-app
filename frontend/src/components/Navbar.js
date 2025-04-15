import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Button,
  CircularProgress,
  Grid,useMediaQuery,
  Snackbar, Alert
} from "@mui/material";
import { Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Login from "./Login";
import WatchlistModal from "./WatchlistModal";
import FavoritesModal from "./FavoritesModal";
import axios from "axios";
import { useNavigate, useLocation  } from "react-router-dom";
import { fetchWatchlistService, fetchFavoritesService } from "../services/AuthService";
import { useTheme } from "@mui/material/styles";

// Style for the search bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [showLogin, setShowLogin] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem("username") || "username");
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const location = useLocation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error"); 
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    setIsAuthenticated(false);
    setUserName("User");
    handleMenuClose();
    window.location.reload();
  };

  const handleHome = () => {
    navigate("/");
    setAnchorEl(null);

  }

  const handleFavoritesOpen = async () => {
    if (!isAuthenticated) {
      alert("Please login first!");
      navigate("/login");
      setAnchorEl(null);
      return;
    }
    try {
      const email = localStorage.getItem("email");
      const fetchedFavorites = await fetchFavoritesService(email);
      setFavorites(fetchedFavorites);
      setShowFavorites(true);
      setAnchorEl(null);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  const showSnackbar = (message, severity = "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };  

  const handleWatchlistOpen = async () => {
    if (!isAuthenticated) {
      showSnackbar("Please login first!");
      setAnchorEl(null);
      return;
    }
    
    try {
      const email = localStorage.getItem("email");
      const fetchedWatchlist = await fetchWatchlistService(email);
      setWatchlist(fetchedWatchlist);
      setShowWatchlist(true);
      setAnchorEl(null);
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  //   const refreshWatchlist = async () => {
  //     handleWatchlistOpen()
  // };
  // const refreshFavorites = async () => {
  //   handleFavoritesOpen()
  // };
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&language=en-US`,
          {
            headers: {
              accept: "application/json",
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDRiYzJhNDcxMzljM2E1ZDgyNjgxNGYwMzc5NGIyMSIsIm5iZiI6MTcyNjYxMzg3MC43NTcwODIsInN1YiI6IjY1NGEwN2JjMjg2NmZhMDBjNDI1OWJmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7jP0jl8WExn2tVvRBfkna_WrlXoGYbYCZDKcAwVoRbA'
            },
          }
        );

        // Navigate to the SearchResults page with the fetched results
        navigate("/search-results", { state: { results: response.data.results } });
      } catch (error) {
        console.error("Error fetching movie info:", error);
      }
    }
  };

  const handleSearchOptions = () => {
    navigate("/search-results");
    setAnchorEl(null);
  };

  const handleQuiz = () => {
    if (!isAuthenticated) {
      showSnackbar("Please login first!");
      setAnchorEl(null);
      return;
    }
    
    navigate("/quiz");
    setAnchorEl(null);
  };
  const getButtonColor = (path) => (location.pathname === path ? "black" : "inherit");

  return (
    <AppBar position="static" sx={{background:"linear-gradient(to right,#201003,#934c14)"}}>
      <Toolbar>
        <Grid flexGrow={1}>
          <Typography 
              onClick={() => navigate("/")} 
              fontSize={"20px"} 
              fontWeight={"700"} 
              color="#de7618" 
              width={"fit-content"}
              sx={{ cursor: "pointer" }}
          >
              CineScope
          </Typography>
        </Grid>
        <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
          <Button sx={{ color: getButtonColor("/") }} onClick={handleHome}>
            <Typography>Home</Typography>
          </Button>
          <Button sx={{ color: getButtonColor("/search-results") }} onClick={handleSearchOptions}>
            <Typography>Search Movies</Typography>
          </Button>
          <Button sx={{ color: getButtonColor("/quiz") }} onClick={handleQuiz}>
            <Typography>Quiz</Typography>
          </Button>
          <Button sx={{ color: "inherit" }} onClick={handleWatchlistOpen}>
            <Typography>Watchlist</Typography>
          </Button>
          <Button sx={{ color: "inherit" }} onClick={handleFavoritesOpen}>
            <Typography>Favorites</Typography>
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={handleMenuOpen}>
                {userName}
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>
              <Typography>Login</Typography>
            </Button>
          )}
        </Box>

        {/* Hamburger Menu for Mobile */}
          {isSmallScreen && (
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem sx={{ color: getButtonColor("/") }} onClick={handleHome}>Home</MenuItem>
                <MenuItem onClick={handleWatchlistOpen}>Watchlist</MenuItem>
                <MenuItem onClick={handleFavoritesOpen}>Favorites</MenuItem>
                <MenuItem sx={{ color: getButtonColor("/quiz") }} onClick={handleQuiz}>Quiz</MenuItem>
                <MenuItem sx={{ color: getButtonColor("/search-results") }} onClick={handleSearchOptions}>Search Movies</MenuItem>

                {isAuthenticated ? (
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                ) : (
                  <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>
                )}
              </Menu>
            </Box>
          )}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>

        {/* Modals for Watchlist and Favorites */}
        {showWatchlist && <WatchlistModal onClose={() => setShowWatchlist(false)} watchlist={watchlist}/>}
        {showFavorites && <FavoritesModal onClose={() => setShowFavorites(false)} favorites={favorites}/>}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
