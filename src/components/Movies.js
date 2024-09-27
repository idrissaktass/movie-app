import React, { useState, useEffect, useRef, useContext  } from 'react';
import { Grid, Typography, Button, Card, CardContent, CardMedia, useMediaQuery,
  Modal, Box, CircularProgress, List, ListItem, IconButton, FormGroup, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions  } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Movies.css'; // Import the CSS file
import { useTheme } from "@mui/material/styles";
import randomPic from "../images/random.png"
import moodsPic from "../images/moods.png"
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close'; // Import the Close icon
import { AuthContext } from '../context/AuthContext';
import { addFavoriteService, addToWatchlistService, removeFavoriteService, removeFromWatchlistService, fetchFavoritesService,fetchWatchlistService } from "../services/AuthService";
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import CreateList from './CreateList'; // Adjust the import based on your file structure

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
  curious: [878, 99], // Sci-Fi, Documentary
  rebellious: [28, 80], // Action, Crime
};

const apiKey = '404bc2a47139c3a5d826814f03794b21'; // TMDB API key

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
  const [selectedMovie, setSelectedMovie] = useState(null); // For storing the selected movie
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
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
  const [moviesDetails, setMoviesDetails] = useState([]); // Ensure this is an array
  const [selectedMood, setSelectedMood] = useState('');
  const [moodMovies, setMoodMovies] = useState([]);
  const [isMoodMovie, setIsMoodMovie] = useState(false);
  const {  addToWatchlist } = useContext(AuthContext);
  const { user } = useContext(AuthContext); // Assuming the user context provides the current user info
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [open, setOpen] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState({}); // To track favorites for each movie
  const [watchlistMovies, setWatchlistMovies] = useState({}); // To track favorites for each movie

  const handleAddToListClick = () => {
    setOpen(true); // Open the dialog
};

const handleClose = () => {
    setOpen(false); // Close the dialog
};

  useEffect(() => {
    const email = localStorage.getItem("email");
    const checkUserLists = async () => {
        if (email) {
            try {
                const favorites = await fetchFavoritesService(email);
                const watchlist = await fetchWatchlistService(email);

                // Log the results to verify they are correct
                console.log("Favorites:", favorites);
                console.log("Watchlist:", watchlist);

                // Convert selectedMovie.id to a number for comparison
                const movieId = Number(selectedMovie.id);

                // Check if the selected movie is in favorites or watchlist
                setIsFavorite(favorites.includes(selectedMovie.id.toString()));
                setIsInWatchlist(watchlist.includes(movieId));
            } catch (error) {
                console.error('Error fetching user lists:', error);
            }
        }
    };

    checkUserLists();
}, [selectedMovie]); // Run effect whenever selectedMovie changes


const handleAddToFavorites = async (movieId) => { // Accept movieId as an argument
  const email = localStorage.getItem("email");
  if (email) {
      try {
          if (favoriteMovies[movieId]) {
              // Remove from favorites if already added
              await removeFavoriteService(email, movieId);
              setFavoriteMovies((prev) => ({ ...prev, [movieId]: false })); // Update state
              setIsFavorite(false)
              alert('Removed from favorites!');
          } else {
              // Add to favorites
              await addFavoriteService(email, movieId);
              setFavoriteMovies((prev) => ({ ...prev, [movieId]: true })); // Update state
              setIsFavorite(true)
              alert('Added to favorites!');
          }
      } catch (error) {
          console.error('Error updating favorites:', error);
          alert(`Failed to ${favoriteMovies[movieId] ? 'remove from' : 'add to'} favorites`);
      }
  } else {
      alert('User not logged in.');
  }
};


const handleAddToWatchlist = async (movieId) => {
    const email = localStorage.getItem("email");
    if (selectedMovie && email) {
        try {
            if (isInWatchlist) {
                // Remove from watchlist if already added
                await removeFromWatchlistService(email, selectedMovie.id);
                setWatchlistMovies((prev) => ({ ...prev, [movieId]: false })); // Update state
                alert('Removed from watchlist!');
                setIsInWatchlist(false)
            } else {
                // Add to watchlist
                await addToWatchlistService(email, selectedMovie.id);
                setWatchlistMovies((prev) => ({ ...prev, [movieId]: true })); // Update state
                alert('Added to Watchlist!');
                setIsInWatchlist(true)
            }
        } catch (error) {
            console.error('Error updating watchlist:', error);
            alert(`Failed to ${isInWatchlist ? 'remove from' : 'add to'} watchlist`);
        }
    } else {
        alert('User not logged in or no movie selected.');
    }
};

  const handleMoodChange = (event) => {
    setSelectedMood(event.target.value);
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
    const genreIds = moodsGenresMapping[selectedMood];
    console.log("genreIds", genreIds);
  
    const combinations = getGenreCombinations(genreIds);
    const allMovies = [];
  
    // Fetch movies for each combination
    for (const combination of combinations) {
      const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_genres=${combination}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDRiYzJhNDcxMzljM2E1ZDgyNjgxNGYwMzc5NGIyMSIsIm5iZiI6MTcyNjYxMzg3MC43NTcwODIsInN1YiI6IjY1NGEwN2JjMjg2NmZhMDBjNDI1OWJmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7jP0jl8WExn2tVvRBfkna_WrlXoGYbYCZDKcAwVoRbA'
        },
      };
  
      const response = await fetch(url, options);
      const data = await response.json();
      
      const filteredMovies = data.results.filter(movie => 
        movie.vote_count >= 500 && movie.vote_average >= 6.5
      );
      allMovies.push(...filteredMovies); // Collect movies from all combinations
    }
  
    // Shuffle and pick unique movies
    const uniqueMovies = Array.from(new Set(allMovies.map(movie => movie.id))) // Ensure uniqueness by ID
      .map(id => allMovies.find(movie => movie.id === id));
  
    const randomMovies = uniqueMovies
      ?.sort(() => Math.random() - 0.5) // Shuffle movies
      .slice(0, 3); // Pick 3 movies
  
    setMoodMovies(randomMovies); // Set the state with random movies
    
    if (randomMovies?.length > 0) {
      setMoviesDetails([]); // Reset previous movie details
      // Fetch details for each random movie
      await Promise.all(randomMovies.map((movie) => fetchMovieInfo(movie)));
    }
  };
  
  const handleSubmit = () => {
    fetchMovies();
  };

  const fetchRandomMovie = async () => {
    if (selectedGenres.length === 0) return; // Ensure at least one genre is selected
  
    const genreIds = selectedGenres.join(',');
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_genres=${genreIds}`;
  
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDRiYzJhNDcxMzljM2E1ZDgyNjgxNGYwMzc5NGIyMSIsIm5iZiI6MTcyNjYxMzg3MC43NTcwODIsInN1YiI6IjY1NGEwN2JjMjg2NmZhMDBjNDI1OWJmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7jP0jl8WExn2tVvRBfkna_WrlXoGYbYCZDKcAwVoRbA'
      }
    };
  
    setMovies([]); // Clear previous movies
    setLoading(true); // Show loading spinner
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      // Filter movies based on vote count and average score
      const filteredMovies = data.results.filter(movie => 
        movie.vote_count >= 500 && movie.vote_average >= 6.5
      );
      // Filter and pick 3 random movies
      const randomMovies = filteredMovies
      ?.sort(() => Math.random() - 0.5) // Shuffle movies
      .slice(0, 3); // Pick 3 movies

      setMovies(randomMovies); // Update state with random movies
      console.log("filteredMovies", filteredMovies);
  
      if (randomMovies?.length > 0) {
        setMoviesDetails([]); // Reset previous movie details
        // Fetch details for each random movie
        await Promise.all(randomMovies.map((movie) => fetchMovieInfo(movie)));
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const handleGenreChange = (event) => {
    const genreId = parseInt(event.target.value, 10);
    
    setSelectedGenres((prevGenres) => {
      if (prevGenres.includes(genreId)) {
        return prevGenres.filter((id) => id !== genreId); // Remove genre if already selected
      }
      if (prevGenres?.length < 3) {
        return [...prevGenres, genreId]; // Allow adding up to 3 genres
      }
      return prevGenres; // If 3 genres are selected, do nothing
    });
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`);
        const data = await response.json();
    
        if (data.results) {
          // Randomly pick 10 movies for the carousel
          setTopMovies(data.results.sort(() => 0.5 - Math.random()).slice(0, 12));
        } else {
          console.error('Error:', data.status_message);
        }
      } catch (error) {
        console.error('Error fetching top movies:', error);
      }
    };

    fetchTopMovies();
    // fetchMovieData();
  }, [filterText, currentPage, apiKey, moviesPerPage, selectedYear, filter]);

  useEffect(() => {
    if (selectedMovie) {
      // Fetch similar movies based on genres

      // Fetch movie reviews
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
    try {
      const genreIds = movie.genre_ids;
  
      // Determine the number of genres to use in the API request
      const genresToUse = genreIds?.length > 1 ? genreIds.slice(0, 2) : genreIds;
  
      // Convert the selected genres to a comma-separated string
      const genreIdsString = genresToUse.join(',');
  
      console.log("Fetching similar movies with genre IDs:", genreIdsString);
  
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: apiKey,
          with_genres: genreIdsString,
          'vote_average.gte': 7,
          'vote_count.gte': 500,
          language: 'en-US',
          page: 1
        }
      });
  
      // Exclude the selected movie from the similar movies list
      const filteredMovies = response.data.results
        .filter(m => m.id !== movie.id)
        .slice(0, 6);
  
      console.log("Filtered movies:", filteredMovies);
  
      setSimilarMovies(filteredMovies);
      setLoadingSimilar(false);
      console.log("filteredMovies",filteredMovies)
    } catch (error) {
      console.error("Error fetching similar movies:", error);
      setLoadingSimilar(false);
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
  
  const handleMovieClick = (movie) => {
    setSelectedGenres([]);
    setSelectedMovie(movie); // Set the selected movie
    console.log("Selected movie:", movie);
    setIsModalOpen(true); // Open the modal
    fetchMovieInfo(movie); // Fetch details of the selected movie
    fetchSimilarMovies(movie); // Fetch similar movies for the selected movie
    window.scrollTo(0, 0); // Scroll to top of the page
  };
  
  const scrollToTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleCloseRandomModal = () => {
    setIsRandomMovie(false); // Close the modal
  };

  const handleCloseMoodModal = () => {
    setIsMoodMovie(false); // Close the modal
  };

  return (
    <Grid>
      <Navbar/>
      <Grid container flexDirection="column" alignItems="center" gap={5} pb={10}>
        {/* Hero Section */}
        <Grid container justifyContent="center" alignItems="center" className="hero-section">
          <div className="hero-text">
            <Typography variant="h2" fontWeight="700">
              Welcome to Movie Explorer
            </Typography>
            <Typography variant="h6" mt={2}>
              Dive into the world of cinema! Discover top-rated movies, get suggestions, and find the perfect film to match your mood. Explore, enjoy, and get lost in the magic of movies.
            </Typography>
          </div>
        </Grid>

        {/* Random Movie Carousel */}
        <Grid container justifyContent="center" alignItems="center">
          {isSmallScreen ? (
              <Carousel showThumbs={false} autoPlay infiniteLoop >
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
              <Carousel showThumbs={false} autoPlay infiniteLoop>
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
            <Carousel showThumbs={false} autoPlay infiniteLoop>
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
        <Grid container justifyContent="center" spacing={4} mt={5}>
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
                <Button onClick={() => setIsRandomMovie(true)} variant="contained" sx={{ mt: 2 }}>Get Random Movie</Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2 - Movie by Mood */}
          <Grid item xs={12} md={5} sm={5.8} lg={4}>
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
            <Button variant="contained" sx={{ mt: 2 }}  onClick={() => setIsMoodMovie(true)}>
              Find Movie by Mood
            </Button>
          </CardContent>
        </Card>
      </Grid>
        <Modal open={isMoodMovie} onClose={handleCloseMoodModal}>
        <Grid container height={"90%"} overflow={"scroll"} p={4}
            sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: {xs:"97%", sm:"90%", md:'80%', lg:"70%"}, bgcolor: 'background.paper', boxShadow: 24, borderRadius: '10px' }}>
          <Grid display={'flex'} flexDirection={'column'} alignItems={'center'} gap={1}>
            <Typography variant="h6">Select Your Mood</Typography>
              <Box textAlign={'center'}>
                  <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="happy" />}
                  label="Happy"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="sad" />}
                  label="Sad"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="excited" />}
                  label="Excited"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="relaxed" />}
                  label="Relaxed"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="adventurous" />}
                  label="Adventurous"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="scared" />}
                  label="Scared"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="romantic" />}
                  label="Romantic"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="romanticcomedy" />}
                  label="Romantic Comedy"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="thoughtful" />}
                  label="Thoughtful"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="humorous" />}
                  label="Humorous"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="uplifting" />}
                  label="Uplifting"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="tense" />}
                  label="Tense"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="curious" />}
                  label="Curious"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleMoodChange} value="rebellious" />}
                  label="Rebellious"
                />
              </Box>
            
            <Button sx={{width:"50%"}} variant="contained" onClick={handleSubmit} disabled={!selectedMood}>
              Find Movies
            </Button>
            
          </Grid>
          {loading && <CircularProgress sx={{ mt: 2 }} />}
              {moodMovies?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {moodMovies.map((movie) => {
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
                          pr={{ xs: "10px", md: "20px" }} 
                          display={'flex'} 
                          gap={2}
                          paddingBlock={{ xs: "10px", md: "unset" }} 
                          paddingLeft={{ xs: "10px", md: "0px" }} 
                          sx={{ background: 'linear-gradient(to right, #ff923c12, #ff923c42)' }}>
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            style={{ width: '20%', height: 'auto' }}
                          />
                          
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
                              <strong>Budget:</strong> {details?.budget ? `$${details.budget.toLocaleString()}` : 'N/A'}
                            </Typography>
                            <Typography variant="body1" mt={1}>
                              <strong>Revenue:</strong> {details?.revenue ? `$${details.revenue.toLocaleString()}` : 'N/A'}
                            </Typography>
                            <Typography variant="body1" mt={1}>
                              <strong>Production Companies:</strong> {details?.production_companies?.map(company => company.name).join(', ') || 'N/A'}
                            </Typography>
                            <Typography variant="body1" mt={1}>
                              <strong>Tagline:</strong> {details?.tagline || 'N/A'}
                            </Typography>
                            <Grid container mt={1} gap={1} mb={1}>
                            <Button onClick={() => {
    setSelectedMovie(movie); // Set the selected movie
    handleAddToFavorites(movie.id); // Pass movie.id to the function
}}>
    {favoriteMovies[movie.id] ? (
        <FavoriteIcon style={{ color: 'red', fontSize: "36px" }} />
    ) : (
        <FavoriteBorderOutlinedIcon style={{ color: 'red', fontSize: "36px" }} />
    )}
</Button>

                              <Button onClick={() => {
                                  setSelectedMovie(movie); // Set the selected movie
                                  handleAddToWatchlist(movie.id); // Pass movie.id to the function
                              }}>
                                {watchlistMovies[movie.id] ? (
                                    <WatchLaterIcon style={{ color:'#ff7b2e', fontSize:"36px" }} />
                                  ) : (
                                    <WatchLaterOutlinedIcon style={{ color:'#ff7b2e', fontSize:"36px" }} />
                                  )}                  
                              </Button>
                              <div>
                                <Button onClick={handleAddToListClick}>
                                    Add to a List
                                </Button>

                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>Create a New List</DialogTitle>
                                    <DialogContent>
                                        <CreateList selectedMovie={selectedMovie}  onClose={handleClose} />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>Cancel</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })}
                </Box>
              )}
        </Grid>
      </Modal>
        </Grid>
      </Grid>

      {/* Movie Details Modal */}
      {isModalOpen && (
        <Modal open={Boolean(selectedMovie)} onClose={handleCloseModal}>
        <Box height={"95%"} overflow={"scroll"} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs:"97%", sm:"90%", md:'80%', lg:"70%"}, bgcolor: 'background.paper', boxShadow: 24, borderRadius: '10px' }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.secondary'
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedMovie && (
            <Grid container paddingInline={{xs:"10px", lg:"40px"}} paddingBlock={{xs:"20px", lg:"40px"}} justifyContent={'center'}>
              {/* Movie details section */}
              <Grid xs={12} textAlign={"center"} mb={2}>
                <Typography variant="h5" component="h2">
                  {selectedMovie.title} ({selectedMovie.release_date?.split('-')[0]})
                </Typography>
              </Grid>
              <Grid mb={{xs:"0px", md:"20px"}} item xs={11.5} md={6} textAlign={"center"} sx={{ background: {xs:'linear-gradient(to right, #ff923c12, #ff923c42)', md:'linear-gradient(to right, transparent, #ff923c12)'}}}>
                <Box height={{xs:"500px", md:"100%"}} overflow="hidden" display={"flex"} justifyContent={'center'}>
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
                  <Button onClick={() => handleAddToFavorites(selectedMovie.id)}>
                  {isFavorite ? (
                      <FavoriteIcon style={{ color:'red', fontSize:"36px" }} />
                    ) : (
                      <FavoriteBorderOutlinedIcon style={{ color:'red', fontSize:"36px" }} />
                    )}
                  </Button>
                  <Button onClick={handleAddToWatchlist}>
                    {isInWatchlist ? (
                        <WatchLaterIcon style={{ color:'#ff7b2e', fontSize:"36px" }} />
                      ) : (
                        <WatchLaterOutlinedIcon style={{ color:'#ff7b2e', fontSize:"36px" }} />
                      )}                  
                  </Button>
                  <div>
            <Button onClick={handleAddToListClick}>
                Add to a List
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create a New List</DialogTitle>
                <DialogContent>
                    <CreateList selectedMovie={selectedMovie}  onClose={handleClose} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
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
                    <Grid container spacing={2} ml={-1} justifyContent={'center'}>
                      {similarMovies.map((movie) => (
                        <Grid item xs={3.8} md={5.8} lg={5.8} xl={3.8} key={movie.id} onClick={() => {handleMovieClick(movie); scrollToTop();}}>
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                            onClick={() => console.log(movie.title)}
                          />
                          <Typography variant="body2" mt={1} textAlign="center">
                            {movie.title} ({movie.vote_average}/10)
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
                                sx={{ cursor: 'pointer', mt: 1 }}
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
        <Modal open={Boolean(isRandomMovie)} onClose={handleCloseRandomModal}>
          <Box height={"90%"} overflow={"scroll"} p={4}
          sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: {xs:"97%", sm:"90%", md:'80%', lg:"70%"}, bgcolor: 'background.paper', boxShadow: 24, borderRadius: '10px' }}>
            <Typography variant="h6" gutterBottom>
              Pick Genres (Select up to 3)
            </Typography>  
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent:"center" }}>
              {genresList.map((genre) => (
                <FormControlLabel
                  key={genre.id}
                  control={
                    <Checkbox
                      value={genre.id}
                      checked={selectedGenres.includes(genre.id)}
                      onChange={handleGenreChange}
                      disabled={
                        selectedGenres.length === 3 && !selectedGenres.includes(genre.id)
                      }
                    />
                  }
                  label={genre.name}
                />
              ))}
            </Box>
            <Button variant="contained" onClick={fetchRandomMovie} sx={{ mt: 2 }}>
              Find a Movie
            </Button>
            {loading && <CircularProgress sx={{ mt: 2 }} />}
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
                        gap={2}
                        paddingBlock={{ xs: "10px", md: "unset" }} 
                        paddingLeft={{ xs: "10px", md: "0px" }} 
                        sx={{ background: 'linear-gradient(to right, #ff923c12, #ff923c42)' }}>
                        
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          style={{ width: '20%', height: 'auto', marginTop: '10px' }}
                        />
                        
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
                            <strong>Budget:</strong> {details?.budget ? `$${details.budget.toLocaleString()}` : 'N/A'}
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            <strong>Revenue:</strong> {details?.revenue ? `$${details.revenue.toLocaleString()}` : 'N/A'}
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            <strong>Production Companies:</strong> {details?.production_companies?.map(company => company.name).join(', ') || 'N/A'}
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            <strong>Tagline:</strong> {details?.tagline || 'N/A'}
                          </Typography>
                          <Grid container  mt={1} gap={1} mb={1}>
                            <Button onClick={() => {
                                setSelectedMovie(movie); // Set the selected movie
                                handleAddToFavorites(movie.id); // Pass movie.id to the function
                            }}>
                                {favoriteMovies[movie.id] ? (
                                    <FavoriteIcon style={{ color: 'red', fontSize: "36px" }} />
                                ) : (
                                    <FavoriteBorderOutlinedIcon style={{ color: 'red', fontSize: "36px" }} />
                                )}
                            </Button>
                              <Button onClick={() => {
                                  setSelectedMovie(movie); // Set the selected movie
                                  handleAddToWatchlist(movie.id); // Pass movie.id to the function
                              }}>
                                {watchlistMovies[movie.id] ? (
                                    <WatchLaterIcon style={{ color:'#ff7b2e', fontSize:"36px" }} />
                                  ) : (
                                    <WatchLaterOutlinedIcon style={{ color:'#ff7b2e', fontSize:"36px" }} />
                                  )}                  
                              </Button>
        <div>
            <Button onClick={handleAddToListClick}>
                Add to a List
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create a New List</DialogTitle>
                <DialogContent>
                    <CreateList selectedMovie={selectedMovie} onClose={handleClose} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
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
