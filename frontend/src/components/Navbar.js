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
  Grid,
} from "@mui/material";
import { Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Login from "./Login";
import WatchlistModal from "./WatchlistModal";
import FavoritesModal from "./FavoritesModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchWatchlistService, fetchFavoritesService } from "../services/AuthService";

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
  const [userName, setUserName] = useState(localStorage.getItem("email") || "email");
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");

    setIsAuthenticated(false);
    setUserName("User");
    handleMenuClose();
    window.location.reload();
  };

  const handleFavoritesOpen = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const email = localStorage.getItem("email");
      const fetchedFavorites = await fetchFavoritesService(email);
      setFavorites(fetchedFavorites);
      setShowFavorites(true);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  const handleWatchlistOpen = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const email = localStorage.getItem("email");
      const fetchedWatchlist = await fetchWatchlistService(email);
      setWatchlist(fetchedWatchlist);
      setShowWatchlist(true);
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
    const refreshWatchlist = async () => {
      handleWatchlistOpen()
  };
  const refreshFavorites = async () => {
    handleFavoritesOpen()
};
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
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#934c14" }}>
      <Toolbar>
        <Grid flexGrow={1}>
          <Typography
            variant="h6"
            noWrap
            width={"fit-content"}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            MovieHub
          </Typography>
        </Grid>
        <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
          <Button color="inherit" onClick={handleWatchlistOpen}>
            Watchlist
          </Button>
          <Button color="inherit" onClick={handleFavoritesOpen}>
            Favorites
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
              Login
            </Button>
          )}
        </Box>

        {/* Hamburger Menu for Mobile */}
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
            <MenuItem onClick={handleWatchlistOpen}>Watchlist</MenuItem>
            <MenuItem onClick={handleFavoritesOpen}>Favorites</MenuItem>
            {isAuthenticated ? (
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            ) : (
              <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>
            )}
          </Menu>
        </Box>

        {/* Modals for Watchlist and Favorites */}
        {showWatchlist && <WatchlistModal onClose={() => setShowWatchlist(false)} watchlist={watchlist} />}
        {showFavorites && <FavoritesModal onClose={() => setShowFavorites(false)} favorites={favorites} />}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
