import React, { useState, useEffect, useRef, useContext  } from 'react';
import { Grid, Typography, Button, Card, CardContent, CardMedia, useMediaQuery,
  Modal, Box, CircularProgress, List, ListItem, IconButton, FormGroup, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert  } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Movies.css'; // Import the CSS file
import { useTheme } from "@mui/material/styles";
import randomPic from "../images/random.png"
import moodsPic from "../images/moods.png"
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../context/AuthContext';
import { addFavoriteService, addToWatchlistService, removeFavoriteService, removeFromWatchlistService, fetchFavoritesService,fetchWatchlistService } from "../services/AuthService";
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import { Helmet } from "react-helmet-async";

const genresList = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];
const moodsGenresMapping = {
  happy: [35, 12, 28], // Comedy, Adventure, Action
  sad: [18, 10749], // Drama, Romance
  excited: [28, 878, 80], // Action, Sci-Fi
  relaxed: [10751, 16, 35, 99], // Family, Animation
  // nostalgic: [35, 10749], // Comedy, Romance
  // inspired: [18, 99], // Drama, Documentary
  adventurous: [12, 28, 878], // Adventure, Action, Sci-Fi
  scared: [27, 53], // Horror, Thriller
  romantic: [10749, 18], // Romance, Drama
  romanticcomedy: [10749, 35], // Romance, Comedy
  thoughtful: [99, 36], // Documentary, History
  humorous: [35, 10402], // Comedy, Music
  uplifting: [35, 12, 10751], // Comedy, Adventure, Family
  tense: [53, 9648], // Thriller, Mystery
  // curious: [878, 99], // Sci-Fi, Documentary
  rebellious: [28, 80], // Action, Crime
};

const apiKey = '404bc2a47139c3a5d826814f03794b21';

function Movies() {
  const [movieData, setMovieData] = useState(null);
  const [filterText, setFilterText] = useState('pokemon');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filter, setFilter] = useState(null);
  const moviesPerPage = 10;
  const navigate = useNavigate();
  const [topMovies, setTopMovies] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isBiggerScreen = useMediaQuery((theme) => theme.breakpoints.up("xl"));
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const modalContentRef = useRef(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState(null);
  const [isRandomMovie, setIsRandomMovie] = useState(false);
  const [movies, setMovies] = useState([]);
  const [moviesDetails, setMoviesDetails] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [moodMovies, setMoodMovies] = useState([]);
  const [isMoodMovie, setIsMoodMovie] = useState(false);
  const {  addToWatchlist } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [open, setOpen] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState({});
  const [watchlistMovies, setWatchlistMovies] = useState({});
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedGenreNames, setSelectedGenreNames] = useState([]);

  const handleAddToListClick = () => {
    setOpen(true); // Open the dialog
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setSnackbarOpen(false);
  };

  const handleClose = () => {
      setOpen(false);
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    const checkUserLists = async () => {
        if (email) {
            try {
                const favorites = await fetchFavoritesService(email);
                const watchlist = await fetchWatchlistService(email);

                console.log("Favorites:", favorites);
                console.log("Watchlist:", watchlist);

                const movieId = Number(selectedMovie.id);

                setIsFavorite(favorites.includes(selectedMovie.id.toString()));
                setIsInWatchlist(watchlist.includes(movieId));
            } catch (error) {
                console.error('Error fetching user lists:', error);
            }
        }
    };

    checkUserLists();
}, [selectedMovie]);


const handleAddToFavorites = async (movieId) => {
  const email = localStorage.getItem("email");
  if (email) {
    setLoadingFavorites(true)
      try {
          if (favoriteMovies[movieId]) {
              await removeFavoriteService(email, movieId);
              setFavoriteMovies((prev) => ({ ...prev, [movieId]: false }));
              setIsFavorite(false);
              setSnackbarMessage('Removed from favorites!');
              setSnackbarSeverity('success');
          } else {
              await addFavoriteService(email, movieId);
              setFavoriteMovies((prev) => ({ ...prev, [movieId]: true }));
              setIsFavorite(true);
              setSnackbarMessage('Added to favorites!');
              setSnackbarSeverity('success');
          }
      } catch (error) {
          console.error('Error updating favorites:', error);
          setSnackbarMessage(`Failed to ${favoriteMovies[movieId] ? 'remove from' : 'add to'} favorites`);
          setSnackbarSeverity('error');
      } finally {
          setLoadingFavorites(false)
          setSnackbarOpen(true); // Open snackbar
          setLoadingFavorites(false)
      }
  } else {
      setSnackbarMessage('User not logged in.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
  }
};

const handleAddToWatchlist = async (movieId) => {
  const email = localStorage.getItem("email");
  if (email) {
    setLoadingWatchlist(true)
      try {
          if (watchlistMovies[movieId]) {
              await removeFromWatchlistService(email, movieId);
              setWatchlistMovies((prev) => ({ ...prev, [movieId]: false }));
              setSnackbarMessage('Removed from watchlist!');
              setIsInWatchlist(false);
              setSnackbarSeverity('success');
          } else {
              await addToWatchlistService(email, movieId);
              setWatchlistMovies((prev) => ({ ...prev, [movieId]: true }));
              setSnackbarMessage('Added to Watchlist!');
              setSnackbarSeverity('success');
              setIsInWatchlist(true);

          }
      } catch (error) {
          console.error('Error updating watchlist:', error);
          setSnackbarMessage(`Failed to ${isInWatchlist ? 'remove from' : 'add to'} watchlist`);
          setSnackbarSeverity('error');
      } finally {
          setLoadingWatchlist(false)
          setSnackbarOpen(true); // Open snackbar
      }
  } else {
      setSnackbarMessage('User not logged in');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
  }
};

  const handleMoodChange = (event) => {
    const value = event.target.value;

    if (value === selectedMood) {
      setSelectedMood(null);
    } else {
      setSelectedMood(value);
    }
  };

  const handleMoodChangeMobile = (event) => {
    const {
      target: { value },
    } = event;

    const valueArray = typeof value === 'string' ? value.split(',') : value;

    setSelectedMood(valueArray);
  };

  const getGenreCombinations = (genreIds) => {
    const combinations = [];
    
    for (let i = 0; i < genreIds.length; i++) {
      for (let j = i + 1; j < genreIds.length; j++) {
        combinations.push(`${genreIds[i]},${genreIds[j]}`);
      }
    }
    
    return combinations;
  };  
  const fetchMovies = async () => {
    setLoading(true);
    const genreIds = moodsGenresMapping[selectedMood];
    console.log("genreIds", genreIds);
  
    const combinations = getGenreCombinations(genreIds);
    const allMovies = [];
  
    for (const combination of combinations) {
      for (let page = 1; page <= 5; page++) {
        const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_genres=${combination}&page=${page}`;
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDRiYzJhNDcxMzljM2E1ZDgyNjgxNGYwMzc5NGIyMSIsIm5iZiI6MTcyNjYxMzg3MC43NTcwODIsInN1YiI6IjY1NGEwN2JjMjg2NmZhMDBjNDI1OWJmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7jP0jl8WExn2tVvRBfkna_WrlXoGYbYCZDKcAwVoRbA'
          },
        };
  
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          
          const filteredMovies = data.results.filter(movie => 
            movie.vote_count >= 300 && movie.vote_average >= 6.0
          );
          allMovies.push(...filteredMovies);
        } catch (error) {
          console.error(`Error fetching movies for page ${page} of combination ${combination}:`, error);
        }
      }
    }
    console.log("123",allMovies)
    const uniqueMovies = Array.from(new Set(allMovies.map(movie => movie.id))) // Ensure uniqueness by ID
      .map(id => allMovies.find(movie => movie.id === id));
  
    const randomMovies = uniqueMovies
      ?.sort(() => Math.random() - 0.5)
      .slice(0, 3); // Pick 3 movies
  
    setMoodMovies(randomMovies);
    
    if (randomMovies?.length > 0) {
      setMoviesDetails([]);
      await Promise.all(randomMovies.map((movie) => fetchMovieInfo(movie)));
    }
  
    setLoading(false);
  };
  
  
  const handleSubmit = () => {
    fetchMovies();
  };

  const fetchRandomMovie = async () => {
    if (selectedGenres.length === 0) return;
  
    let genreIds;
  
    if (selectedGenres.length === 3) {
      const shuffledGenres = selectedGenres.sort(() => 0.5 - Math.random());
      genreIds = shuffledGenres.slice(0, 2).join(',');
    } else {
      genreIds = selectedGenres.join(',');
    }
  
    const baseUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_genres=${genreIds}`;
  
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDRiYzJhNDcxMzljM2E1ZDgyNjgxNGYwMzc5NGIyMSIsIm5iZiI6MTcyNjYxMzg3MC43NTcwODIsInN1YiI6IjY1NGEwN2JjMjg2NmZhMDBjNDI1OWJmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7jP0jl8WExn2tVvRBfkna_WrlXoGYbYCZDKcAwVoRbA'
      }
    };
  
    setMovies([]); 
    setLoading(true);
  
    try {
      let allMovies = [];
  
      for (let page = 1; page <= 8; page++) {
        const response = await fetch(`${baseUrl}&page=${page}`, options);
        const data = await response.json();
  
        allMovies = [...allMovies, ...data.results];
      }
  
      console.log("All fetched movies:", allMovies);
  
      const filteredMovies = allMovies.filter(
        movie => movie.vote_count >= 300 && movie.vote_average >= 6.0
      );
  
      const randomMovies = filteredMovies
        .sort(() => Math.random() - 0.5)
        .slice(0, 3); // Pick 3 movies
  
      setMovies(randomMovies);
  
      if (randomMovies.length > 0) {
        setMoviesDetails([]); 
        await Promise.all(randomMovies.map(movie => fetchMovieInfo(movie)));
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleGenreChange = (event) => {
    const genreId = parseInt(event.target.value, 10);
    
    setSelectedGenres((prevGenres) => {
      if (prevGenres.includes(genreId)) {
        return prevGenres.filter((id) => id !== genreId);
      }
      if (prevGenres?.length < 3) {
        return [...prevGenres, genreId];
      }
      return prevGenres;
    });
  };

  const handleGenreChangeMobile = (event) => {
    const {
        target: { value },
    } = event;

    const valueArray = typeof value === 'string' ? value.split(',') : value;
    setSelectedGenres((prevSelected) => {
      const newSelected = valueArray.map((id) => parseInt(id, 10));
      if (newSelected.length <= 3) {
        return newSelected;
      }
      return prevSelected;
    });

    setSelectedGenreNames((prevSelected) => {
        const newSelected = valueArray.map((id) => parseInt(id, 10));
        
        if (newSelected.length <= 4) {
            const selectedGenreNames = newSelected.map((id) => {
                const genre = genresList.find((genre) => genre.id === id);
                return genre ? genre.name : null;
            }).filter(name => name !== null);
            
            console.log("Selected Genre Names:", selectedGenreNames);
            return newSelected;
        }
        
        return prevSelected;
    });
};
    console.log("selected genres", selectedGenres, genresList);

  

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchTopMovies = async () => {
      const totalPages = 5;
      const allMovies = [];
  
      try {
        for (let page = 1; page <= totalPages; page++) {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=${page}`
          );
          const data = await response.json();
          console.log("data",data)

          if (data.results) {
            allMovies.push(...data.results);
          } else {
            console.error('Error:', data.status_message);
            break;
          }
        }
  
        const randomMovies = allMovies.sort(() => 0.5 - Math.random()).slice(0, 24);
        setTopMovies(randomMovies);
  
      } catch (error) {
        console.error('Error fetching top movies:', error);
      }
    };
  
    fetchTopMovies();
  }, [filterText, currentPage, apiKey, moviesPerPage, selectedYear, filter]);
  

  useEffect(() => {
    if (selectedMovie) {

      const fetchReviews = async () => {
        try {
          const response = await axios.get(`https://api.themoviedb.org/3/movie/${selectedMovie.id}/reviews?api_key=${apiKey}&language=en-US&page=1`);
          setReviews(response.data.results);
          setLoadingReviews(false);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };
    
      fetchReviews();    }
  }, [selectedMovie]);
  const fetchSimilarMovies = async (movie) => {
    setLoadingSimilar(true); // Start loading
    try {
      const genreIds = movie.genre_ids;
  
      const genresToUse = genreIds?.length > 1 ? genreIds.slice(0, 2) : genreIds;
  
      const genreIdsString = genresToUse.join(',');
  
      console.log("Fetching similar movies with genre IDs:", genreIdsString);
  
      const allMovies = [];
  
      for (let page = 1; page <= 5; page++) {
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
          params: {
            api_key: apiKey,
            with_genres: genreIdsString,
            'vote_average.gte': 6,
            'vote_count.gte': 300,
            language: 'en-US',
            page: page
          }
        });
  
        const filteredMovies = response.data.results.filter(m => m.id !== movie.id);
        
        allMovies.push(...filteredMovies);
      }
  
      const shuffledMovies = allMovies.sort(() => 0.5 - Math.random());
      
      const randomMovies = shuffledMovies.slice(0, 6);
  
      console.log("Randomly selected movies:", randomMovies);
  
      setSimilarMovies(randomMovies);
    } catch (error) {
      console.error("Error fetching similar movies:", error);
    } finally {
      setLoadingSimilar(false); // End loading
    }
  };
  
  
  
  const fetchMovieInfo = async (movie) => {
    setLoadingInfo(true);
    console.log("Fetching info for movie ID:", movie.id);
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDRiYzJhNDcxMzljM2E1ZDgyNjgxNGYwMzc5NGIyMSIsIm5iZiI6MTcyNjYxMzg3MC43NTcwODIsInN1YiI6IjY1NGEwN2JjMjg2NmZhMDBjNDI1OWJmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7jP0jl8WExn2tVvRBfkna_WrlXoGYbYCZDKcAwVoRbA'
        }
      });
      console.log("Movie details:", response.data);
      const data = response.data;
      if((selectedGenres.length > 0 && isRandomMovie) || isMoodMovie) {
        setMoviesDetails((prevDetails) => [...prevDetails, data]);
        console.log("1")
      } else{
        setMovieDetails(response.data); // Adjusted to response.data instead of response.data.results
        console.log("2")
        console.log("Movie details:", response.data);
      }
      setLoadingInfo(false);
    } catch (error) {
      console.error("Error fetching movie info:", error);
      setLoadingInfo(false);
    }
  };
  const scrollToModalTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  };
  useEffect(() => {
    if (isModalOpen) {
      scrollToModalTop();
    }
  }, [isModalOpen]);
  
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    console.log("Selected movie:", movie);
    setIsModalOpen(true); 
    fetchMovieInfo(movie); 
    fetchSimilarMovies(movie); 
    scrollToModalTop(); 
  };
  
  
  const scrollToTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseRandomModal = () => {
    setIsRandomMovie(false);
  };

  const handleCloseMoodModal = () => {
    setIsMoodMovie(false);
  };

  const moods = [
    { value: 'happy', label: 'Happy' },
    { value: 'sad', label: 'Sad' },
    { value: 'excited', label: 'Excited' },
    { value: 'relaxed', label: 'Relaxed' },
    { value: 'adventurous', label: 'Adventurous' },
    { value: 'scared', label: 'Scared' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'romanticcomedy', label: 'Romantic Comedy' },
    { value: 'thoughtful', label: 'Thoughtful' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'uplifting', label: 'Uplifting' },
    { value: 'tense', label: 'Tense' },
    // { value: 'curious', label: 'Curious' },
    { value: 'rebellious', label: 'Rebellious' },
  ];

  return (
    <Grid>
          <Helmet>
      <title>CineScope - Find Your Movie!</title>
      <meta name="description" content="Find your movie with suggestions" />
      <meta name="keywords" content="Movie Quiz, Film Quiz, Movie Trivia, Film Knowledge Test, Movie Games, movie, movies, film, films, movie suggestion, film suggestion, movie by mood" />
      <meta name="author" content="idrisaktas.online" />
      <meta property="og:title" content="CineScope - Find Your Movie!" />
      <meta property="og:description" content="Find your movie with suggestions" />
      <meta property="og:type" content="website" />
    </Helmet>
      <Navbar/>
      <Grid container flexDirection="column" alignItems="center" gap={5} pb={10}>
        {/* Hero Section */}
        <Grid container justifyContent="center" alignItems="center" className="hero-section">
          <div className="hero-text">
            <Typography fontWeight="700" fontSize={{xs:"2.2rem", sm:"2.7rem", md:"3rem"}}>
              Welcome to Movie Explorer
            </Typography>
            <Typography fontSize={{xs:"1.1rem", sm:"1.3rem", md:"1.5rem"}} mt={2}>
              Dive into the world of cinema! Discover top-rated movies, get suggestions, and find the perfect film to match your mood. Explore, enjoy, and get lost in the magic of movies.
            </Typography>
          </div>
        </Grid>

        {/* Random Movie Carousel */}
        <Grid container justifyContent="center" alignItems="center">
          {isSmallScreen ? (
              <Carousel showThumbs={false} autoPlay infiniteLoop swipeable={false}>
                {topMovies.map((movie) => (
                  <Grid xs={10} sm={8} key={movie.id} onClick={() => handleMovieClick(movie)} sx={{cursor:"pointer"}}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                    <p
                      className="legend"
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10%',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '5px',
                        width:"80%",
                        borderRadius: '5px',
                        fontSize: '14px',
                        margin: 0
                      }}
                    >
                      {movie.title} ({movie.release_date.split('-')[0]})
                    </p>
                  </Grid>
                ))}
            </Carousel>
          ) : !isBiggerScreen && (
              <Carousel showThumbs={false} autoPlay infiniteLoop swipeable={false}>
              {topMovies.reduce((result, movie, index) => {
                const chunkIndex = Math.floor(index / 3);

                if (!result[chunkIndex]) {
                  result[chunkIndex] = []; // Start a new chunk
                }

                result[chunkIndex].push(movie);

                return result;
              }, []).map((movieGroup, i) => (
                <div key={i}>
                  <Grid container sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    {movieGroup.map((movie) => (
                      <Grid xs={8} md={3} lg={3} xl={2} key={movie.id} onClick={() => handleMovieClick(movie)}  sx={{ position: 'relative', maxWidth: '200px', cursor: 'pointer' }}>
                        <img 
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                          alt={movie.title} 
                          style={{ width: '100%', height: 'auto', display: 'block' }} 
                        />
                        <p className="legend" style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '10px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '5px',
                          borderRadius: '5px',
                          fontSize: '14px',
                          margin: 0
                        }}>
                          {movie.title} ({movie.release_date.split('-')[0]})
                        </p>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ))}
            </Carousel>
          )}
          {isBiggerScreen && (
            <Carousel showThumbs={false} autoPlay infiniteLoop swipeable={false}>
              {topMovies.reduce((result, movie, index) => {
                const chunkIndex = Math.floor(index / 4);

                if (!result[chunkIndex]) {
                  result[chunkIndex] = []; // Start a new chunk
                }

                result[chunkIndex].push(movie);

                return result;
              }, []).map((movieGroup, i) => (
                <div key={i}>
                  <Grid container sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    {movieGroup.map((movie) => (
                      <Grid xs={8} md={3} lg={3} xl={2} key={movie.id} onClick={() => handleMovieClick(movie)}  sx={{ position: 'relative', maxWidth: '200px', cursor: 'pointer' }}>
                        <img 
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                          alt={movie.title} 
                          style={{ width: '100%', height: 'auto', display: 'block' }} 
                        />
                        <p className="legend" style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '10px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '5px',
                          borderRadius: '5px',
                          fontSize: '14px',
                          margin: 0
                        }}>
                          {movie.title} ({movie.release_date.split('-')[0]})
                        </p>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ))}
            </Carousel>
          )}
        </Grid>
        {/* Explanation Cards */}
        <Grid container justifyContent="center" spacing={4} mt={{xs:0, md:2}}>
          {/* Card 1 - Random Movie Suggestions */}
          <Grid item xs={11} sm={5.8} md={5} lg={4}>
            <Card sx={{boxShadow:"0px 5px 10px #a5792a3d"}}>
              <CardMedia
                component="img"
                alt="Random Movie Suggestion"
                height="250"
                image={randomPic}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  Movie Suggestions
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Need a movie recommendation? Whether you're craving action, comedy, or drama, we'll help you find the perfect film to enjoy!"
                </Typography>
                <Button onClick={() => setIsRandomMovie(true)} variant="contained" fullWidth sx={{ mt: 2, backgroundColor:"#934c14" }}>Get Movie Suggestion</Button>
              </CardContent>
            </Card>
          </Grid>
          {/* Card 2 - Movie by Mood */}
          <Grid item xs={11} md={5} sm={5.8} lg={4}>
        <Card sx={{ boxShadow: "0px 5px 10px #a5792a3d" }}>
          <CardMedia
            component="img"
            alt="Movie by Mood"
            height="250"
            image={moodsPic}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              Movie by Mood
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Feeling happy, sad, or in need of excitement? Use our "Movie by Mood" feature to find the perfect film for your current mood.
            </Typography>
            <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor:"#934c14" }}  onClick={() => setIsMoodMovie(true)}>
              Find Movie by Mood
            </Button>
          </CardContent>
        </Card>
      </Grid>
        <Modal open={isMoodMovie} onClose={handleCloseMoodModal}>
        <Box height={"80%"} overflow={"auto"} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs:"97%", sm:"90%", md:'90%', lg:"70%"}, bgcolor: 'background.paper', boxShadow: 24, borderRadius: '10px' }}>
          <IconButton
            onClick={handleCloseMoodModal}
            sx={{
              position: 'sticky',
              top: 5,           // Stick the button to the top of the scrolling area
              left: 5,
              color: 'text.secondary',
              zIndex: 999,
              bgcolor: 'white', // Add background color if needed for visibility
            }}
          >
            <CloseIcon />
          </IconButton>
          <Grid display={'flex'} flexDirection={'column'} alignItems={'center'} gap={1}>
            <Typography variant="h6">Select Your Mood</Typography>
            {isSmallScreen ? (
                  <FormControl sx={{ mb: 2 , width:"97%"}}>
                    <InputLabel id="mood-select-label">Select Moods</InputLabel>
                    <Select
                      labelId="mood-select-label"
                      value={selectedMood}
                      onChange={handleMoodChangeMobile}
                      renderValue={(selected) => selected.join(', ')} // Display selected moods
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                            "& .MuiMenuItem-root": {
                              display: 'flex',
                              justifyContent: 'space-between',
                            },
                          },
                        },
                      }}
                    >
                      {moods.map((mood) => (
                        <MenuItem key={mood.value} value={mood.value} sx={{display:"flex",justifyContent:"start !important"}}>
                          <Checkbox checked={selectedMood.indexOf(mood.value) > -1} />
                          {mood.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
            ) : (
              <Box textAlign={'center'} paddingInline={3}>
                {moods.map((mood) => (
                  <FormControlLabel sx={{backgroundColor:"#ff923c42", marginBottom:"5px", paddingRight:"8px", borderRadius:"10px"}}
                    key={mood.value}
                    control={
                      <Checkbox
                        checked={selectedMood === mood.value}
                        onChange={handleMoodChange}
                        value={mood.value}
                      />
                    }
                    label={mood.label}
                  />
                ))}
              </Box>
            )}      
            <Button sx={{width:{xs:"90%", md:"50%"}, backgroundColor:"#934c14"}} variant="contained" onClick={handleSubmit} disabled={!selectedMood}>
              Find Movies
            </Button>
          </Grid>
          {loading ? (
            <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="60%" // or any specific height you need
            >
              <CircularProgress size={60} /> {/* Adjust the size as needed */}
            </Box>
          ) : (
            moodMovies?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {moodMovies.map((movie) => {
                  // Find the corresponding details for the current movie
                  const details = moviesDetails?.find(detail => detail.id === movie.id);
                  const isMovieFavorite = favoriteMovies[movie.id] || false; // Get specific movie's favorite state
                  const isMovieInWatchlist = watchlistMovies[movie.id] || false; // Get specific movie's watchlist state
                  
                  console.log("details",moviesDetails)
                  return (
                    <Box key={movie.id} sx={{ mb: 3 }} pl={{xs:2, sm:3.5}}>
                      <Typography variant="h6">{movie.title}</Typography>
                      <Grid 
                        mb={{ xs: "15px", md: "20px" }} 
                        item 
                        xs={11.5} 
                        pr={{ xs: "10px", md: "20px" }} 
                        display={'flex'}
                        flexDirection={{xs:"column", md:"unset"}}
                        gap={2}
                        paddingBlock={{ xs: "10px", md: "unset" }} 
                        paddingLeft={{ xs: "10px", md: "0px" }} 
                        sx={{ background: 'linear-gradient(to right, #ff923c12, #ff923c42)' }}>
                          <Grid display={'flex'} justifyContent={'center'}>
                            <Box 
                            height={{xs:"50%", sm:"600px", md:"100%"}}
                            width={{xs:"100%", sm:"70%", md:"250px"}} 
                            overflow="hidden" 
                            display={"flex"} 
                            justifyContent="center"
                          >
                            <Box
                              component="img"
                              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                              alt={movie.title}
                              sx={{ 
                                width: '100%',       // Kutunun genişliğine tam sığacak
                                height: 'auto',      // Kutunun yüksekliğine tam sığacak
                                objectFit: 'cover',  // Resim kutunun içinde tam görünür
                              }}
                            />
                          </Box>
                          </Grid>
                        <Grid>
                          <Typography variant="body2" mt={2}>
                            {movie.overview}
                          </Typography>
                          <Typography variant="body1" mt={2}>
                            <strong>Score:</strong> {details ? (Math.round(details.vote_average * 10) / 10) : 'N/A'}/10
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            <strong>Runtime:</strong> {details?.runtime || 'Unknown'} minutes
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            <strong>Genres:</strong> {details?.genres?.map(genre => genre.name).join(', ') || 'N/A'}
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            <strong>Release Date:</strong> {details?.release_date || 'N/A'}
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            <strong>Original Language:</strong> {details?.original_language?.toUpperCase() || 'N/A'}
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            <strong>Tagline:</strong> {details?.tagline || 'N/A'}
                          </Typography>
                          <Grid container mt={1} gap={1} mb={1}>
                          <Button onClick={() => handleAddToFavorites(movie.id)}disabled={loadingFavorites}>
                            {loadingFavorites ? (
                                <CircularProgress size={24} /> // Loading indicator
                            ) : isMovieFavorite ? (
                                <FavoriteIcon style={{ color: 'red', fontSize: "36px" }} />
                            ) : (
                                <FavoriteBorderOutlinedIcon style={{ color: 'red', fontSize: "36px" }} />
                            )}
                        </Button>
                        <Button onClick={handleAddToWatchlist} disabled={loadingWatchlist}>
                            {loadingWatchlist ? (
                                <CircularProgress size={24} /> // Loading indicator
                            ) : isMovieInWatchlist ? (
                                <WatchLaterIcon style={{ color: '#ff7b2e', fontSize: "36px" }} />
                            ) : (
                                <WatchLaterOutlinedIcon style={{ color: '#ff7b2e', fontSize: "36px" }} />
                            )}
                        </Button>
                            <div>
                              {/* <Button onClick={handleAddToListClick}>
                                  Add to a List
                              </Button> */}
                          </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
              </Box>
            )
          )             
            }
        </Box>
      </Modal>
        </Grid>
      </Grid>

      {/* Movie Details Modal */}
      {isModalOpen && (
        <Modal open={Boolean(selectedMovie)} onClose={handleCloseModal}>
        <Box height={"80%"} ref={modalContentRef} overflow={"auto"} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs:"97%", sm:"90%", md:'80%', lg:"70%"}, bgcolor: 'background.paper', boxShadow: 24, borderRadius: '10px' }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'sticky',
              top: 5,           // Stick the button to the top of the scrolling area
              left: 5,
              color: 'text.secondary',
              zIndex: 999,
              bgcolor: 'white', // Add background color if needed for visibility
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedMovie && (
            <Grid container paddingInline={{xs:"10px", lg:"40px"}} paddingBlock={{xs:"10px", sm:"20px", lg:"40px"}} justifyContent={'center'}>
              {/* Movie details section */}
              <Grid xs={12} textAlign={"center"} mb={2}>
                <Typography variant="h5" component="h2">
                  {selectedMovie.title} ({selectedMovie.release_date?.split('-')[0]})
                </Typography>
              </Grid>
              <Grid mb={{xs:"0px", md:"20px"}} item xs={11.5} md={6} textAlign={"center"} sx={{ background: {xs:'linear-gradient(to right, #ff923c12, #ff923c42)', md:'linear-gradient(to right, transparent, #ff923c12)'}}}>
                <Box height={{xs:"475px", md:"100%"}} overflow="hidden" display={"flex"} justifyContent={'center'}>
                  <Box
                    component="img"
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    sx={{ width: {xs:"100%", md:"85%", lg:"80%", xl:"70%"}, position: 'relative', alignSelf:"center" }}
                  />
                </Box>
              </Grid>
              {loadingInfo ? (
                  <CircularProgress />
              ) : (
                <Grid mb={{xs:"15px", md:"20px"}} item xs={11.5} md={6} pr={{xs:"10px", md:"20px"}} paddingBlock={{xs:"10px", md:"unset"}} paddingLeft={{xs:"10px", md:"0px"}} sx={{ background: 'linear-gradient(to right, #ff923c12, #ff923c42)'}}>
                <Typography variant="body2" mt={2}>
                  {selectedMovie.overview}
                </Typography>
                <Typography variant="body1" mt={2}>
                  <strong>Score:</strong> {Math.round(movieDetails.vote_average * 10) / 10}/10
                </Typography>
                <Typography variant="body1" mt={1}>
                  <strong>Runtime:</strong> {movieDetails.runtime || 'Unknown'} minutes
                </Typography>
                <Typography variant="body1" mt={1}>
                  <strong>Genres:</strong> {movieDetails.genres?.map(genre => genre.name).join(', ')}
                </Typography>
                <Typography variant="body1" mt={1}>
                  <strong>Release Date:</strong> {movieDetails.release_date}
                </Typography>
                <Typography variant="body1" mt={1}>
                  <strong>Original Language:</strong> {movieDetails.original_language?.toUpperCase()}
                </Typography>
                <Typography variant="body1" mt={1}>
                  <strong>Budget:</strong> {movieDetails.budget ? `$${movieDetails.budget.toLocaleString()}` : 'N/A'}
                </Typography>
                <Typography variant="body1" mt={1}>
                  <strong>Revenue:</strong> {movieDetails.revenue ? `$${movieDetails.revenue.toLocaleString()}` : 'N/A'}
                </Typography>
                <Typography variant="body1" mt={1}>
                  <strong>Production Companies:</strong> {movieDetails.production_companies?.map(company => company.name).join(', ')}
                </Typography>
                <Typography variant="body1" mt={1}>
                  <strong>Tagline:</strong> {movieDetails.tagline || 'N/A'}
                </Typography>
                <Grid container mt={3} gap={1}>
                <Button onClick={() => handleAddToFavorites(selectedMovie.id)} disabled={loadingFavorites}>
                  {loadingFavorites ? (
                    <CircularProgress size={24} style={{ color: 'red' }} />
                  ) : isFavorite ? (
                    <FavoriteIcon style={{ color:'red', fontSize: "36px" }} />
                  ) : (
                    <FavoriteBorderOutlinedIcon style={{ color:'red', fontSize: "36px" }} />
                  )}
                </Button>
                
                <Button onClick={() => handleAddToWatchlist(selectedMovie.id)} disabled={loadingWatchlist}>
                  {loadingWatchlist ? (
                    <CircularProgress size={24} style={{ color: '#ff7b2e' }} />
                  ) : isInWatchlist ? (
                    <WatchLaterIcon style={{ color:'#ff7b2e', fontSize: "36px" }} />
                  ) : (
                    <WatchLaterOutlinedIcon style={{ color:'#ff7b2e', fontSize: "36px" }} />
                  )}
                </Button>
                  <div>
            {/* <Button onClick={handleAddToListClick}>
                Add to a List
            </Button> */}

        </div>
                </Grid>
              </Grid>
              )}
              {/* Reviews section */}
              <Grid container justifyContent="center" xs={12}>
                {/* Similar Movies section */}
                <Grid item xs={11.5} md={6} order={{ xs: 1, md: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Similar Movies
                  </Typography>
                  {loadingSimilar ? (
                    <CircularProgress />
                  ) : (
                    <Grid container spacing={2} justifyContent={'center'}>
                      {similarMovies.map((movie) => (
                        <Grid item xs={3.8} md={5.8} lg={5.8} xl={3.8} key={movie.id} onClick={() => {handleMovieClick(movie); scrollToTop();}}>
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                            onClick={() => console.log(movie.title)}
                          />
                          <Typography variant="body2" mt={1} textAlign="center">
                            {movie.title} {(Math.round(movie.vote_average * 10) / 10)}/10
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Grid>
    
                {/* Reviews section */}
                <Grid item xs={11.5} md={6} order={{ xs: 2, md: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Reviews
                  </Typography>
                  {loadingReviews ? (
                    <CircularProgress />
                  ) : reviews?.length > 0 ? (
                    <List sx={{paddingTop:"0px"}}>
                      {reviews.map((review) => (
                        <ListItem sx={{paddingTop:"0px", paddingLeft:"0px", paddingRight:"0px"}}>
                          <Box sx={{ background: 'linear-gradient(to right, #ff923c12, #ff923c42)'}} width={"100%"} padding={1.5}>
                            <Typography variant="body1">
                              <strong>{review.author}</strong> wrote:
                            </Typography>
                            <Typography variant="body2">
                              {isExpanded ? review.content : review.content?.length > 200 ? `${review.content.slice(0, 200)}...` : review.content}
                              {review.content?.length > 300 && (
                              <span
                                variant="body2"
                                style={{ cursor: 'pointer', mt: 1 , color:"#006effe6"}}
                                onClick={handleToggle}
                              >
                                {isExpanded ? ' Read Less' : ' Read More'}
                              </span>
                              )}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No reviews available for this movie.</Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
      )}
                  <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        <Modal open={Boolean(isRandomMovie)} onClose={handleCloseRandomModal}>
          <Box height={"80%"} overflow={"auto"} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs:"97%", sm:"90%", md:'90%', lg:"70%"}, bgcolor: 'background.paper', boxShadow: 24, borderRadius: '10px' }}>
          <IconButton
            onClick={handleCloseRandomModal}
            sx={{
              position: 'sticky',
              top: 5,           // Stick the button to the top of the scrolling area
              left: 5,
              color: 'text.secondary',
              zIndex: 999,
              bgcolor: 'white', // Add background color if needed for visibility
            }}
          >
            <CloseIcon />
          </IconButton>
            <Typography variant="h6" gutterBottom textAlign={'center'}>
              Pick Genres (Select up to 3)
            </Typography>  
            <Grid display={'flex'} flexDirection={'column'} alignItems={'center'} gap={1}>
      {isSmallScreen ? (
        <FormControl sx={{ mb: 2, width: "98%" }}>
          <InputLabel id="genre-select-label">Select Genres</InputLabel>
          <Select
              labelId="genre-select-label"
              multiple
              value={selectedGenres}
              onChange={handleGenreChangeMobile}
              renderValue={(selected) => {
                  const selectedNames = selected.map((id) => {
                      const genre = genresList.find((genre) => genre.id === id);
                      return genre ? genre.name : null; // Return the genre name or null if not found
                  }).filter(name => name !== null); // Filter out any null values

                  return selectedNames.join(', '); // Join the names for display
              }}
              MenuProps={{
                  PaperProps: {
                      sx: {
                          maxHeight: 300,
                          "& .MuiMenuItem-root": {
                              display: 'flex',
                              justifyContent: 'space-between',
                          },
                      },
                  },
              }}
          >
              {genresList.map((genre) => (
                  <MenuItem
                      key={genre.id}
                      value={genre.id}
                      sx={{ display: "flex", justifyContent: "start !important" }}
                      disabled={!selectedGenres.includes(genre.id) && selectedGenres.length >= 3} // Disable if not selected and 3 genres are already selected
                  >
                      <Checkbox checked={selectedGenres.includes(genre.id)} />
                      {genre.name}
                  </MenuItem>
              ))}
          </Select>
      </FormControl>

      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: "center" }} paddingInline={3} textAlign={"center"}>
          {genresList.map((genre) => (
            <FormControlLabel sx={{backgroundColor:"#ff923c42", marginBottom:"5px", paddingRight:"8px", borderRadius:"10px"}}
              key={genre.id}
              control={
                <Checkbox
                  value={genre.id}
                  checked={selectedGenres.includes(genre.id)}
                  onChange={handleGenreChange}
                  disabled={selectedGenres.length === 3 && !selectedGenres.includes(genre.id)}
                />
              }
              label={genre.name}
            />
          ))}
        </Box>
      )}
      <Button variant="contained" onClick={fetchRandomMovie} sx={{ mt: 2 }}>
        Find a Movie
      </Button>
    </Grid>
            {loading &&
              <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="60%" // or any specific height you need
              >
                <CircularProgress size={60} /> {/* Adjust the size as needed */}
              </Box>
            }
            {movies?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {movies.map((movie) => {
                  // Find the corresponding details for the current movie
                  const details = moviesDetails?.find(detail => detail.id === movie.id);
                  console.log("details",moviesDetails)
                  return (
                    <Box key={movie.id} sx={{ mb: 3 }}>
                      <Typography variant="h6">{movie.title}</Typography>
                      <Grid 
                        mb={{ xs: "15px", md: "20px" }} 
                        item 
                        xs={11.5} 
                        md={6} 
                        pr={{ xs: "10px", md: "20px" }} 
                        display={'flex'} 
                        flexDirection={{xs:"column", md:"unset"}}
                        gap={2}
                        paddingBlock={{ xs: "10px", md: "unset" }} 
                        paddingLeft={{ xs: "10px", md: "0px" }} 
                        sx={{ background: 'linear-gradient(to right, #ff923c12, #ff923c42)' }}>
                            <Grid display={'flex'} justifyContent={'center'}>
                              <Box 
                              height={{xs:"50%", sm:"600px", md:"100%"}}
                              width={{xs:"100%", sm:"70%", md:"250px"}} 
                              overflow="hidden" 
                              display={"flex"} 
                              justifyContent="center"
                            >
                              <Box
                                component="img"
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                sx={{ 
                                  width: '100%',       // Kutunun genişliğine tam sığacak
                                  height: 'auto',      // Kutunun yüksekliğine tam sığacak
                                  objectFit: 'cover',  // Resim kutunun içinde tam görünür
                                }}
                              />
                            </Box>
                            </Grid>
                        <Grid>
                          <Typography variant="body2" mt={2}>
                            {movie.overview}
                          </Typography>
                          <Typography variant="body1" mt={2}>
                            <strong>Score:</strong> {details ? (Math.round(details.vote_average * 10) / 10) : 'N/A'}/10
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            <strong>Runtime:</strong> {details?.runtime || 'Unknown'} minutes
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            <strong>Genres:</strong> {details?.genres?.map(genre => genre.name).join(', ') || 'N/A'}
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            <strong>Release Date:</strong> {details?.release_date || 'N/A'}
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            <strong>Original Language:</strong> {details?.original_language?.toUpperCase() || 'N/A'}
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            <strong>Tagline:</strong> {details?.tagline || 'N/A'}
                          </Typography>
                          <Grid container  mt={1} gap={1} mb={1}>
                            <Button onClick={() => {
                                setSelectedMovie(movie); // Set the selected movie
                                handleAddToFavorites(movie.id); // Pass movie.id to the function
                            }}>
                                {loadingFavorites ? (
                                  <CircularProgress size={24} style={{ color: 'red' }} />
                                ) : favoriteMovies[movie.id] ? (
                                  <FavoriteIcon style={{ color: 'red', fontSize: "36px" }} />
                                ) : (
                                  <FavoriteBorderOutlinedIcon style={{ color: 'red', fontSize: "36px" }} />
                                )}
                            </Button>
                              <Button onClick={() => {
                                  setSelectedMovie(movie); // Set the selected movie
                                  handleAddToWatchlist(movie.id); // Pass movie.id to the function
                              }}>
                                {loadingWatchlist ? (
                                    <CircularProgress size={24} style={{ color: 'red' }} />
                                  ) : watchlistMovies[movie.id] ? (
                                    <WatchLaterIcon style={{ color:'#ff7b2e', fontSize:"36px" }} />
                                  ) : (
                                    <WatchLaterOutlinedIcon style={{ color:'#ff7b2e', fontSize:"36px" }} />
                                  )}                  
                              </Button>
                            <div>
                                {/* <Button onClick={handleAddToListClick}>
                                    Add to a List
                                </Button> */}

                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </Modal>

    </Grid>
  );
}

export default Movies;
