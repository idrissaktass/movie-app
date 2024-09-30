import React, { useState, useEffect, useRef, useContext  } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogActions,Snackbar, DialogContent, DialogTitle, Grid,Alert, IconButton, List, ListItem, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import CreateList from './CreateList'; // Adjust the import based on your file structure
import axios from 'axios';
import { addFavoriteService, addToWatchlistService, removeFavoriteService, removeFromWatchlistService, fetchFavoritesService,fetchWatchlistService } from "../services/AuthService";
const apiKey = '404bc2a47139c3a5d826814f03794b21'; // TMDB API key


const MovieModal = ({ selectedMovie, onOpen, onClose  }) => {
  const [open, setOpen] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const modalContentRef = useRef(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isRandomMovie, setIsRandomMovie] = useState(false);
  const [isMoodMovie, setIsMoodMovie] = useState(false);
  const [moviesDetails, setMoviesDetails] = useState([]); // Ensure this is an array
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal open state
  const [isFavorite, setIsFavorite] = useState(false); // Modal open state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
  const topScrollRef = useRef(null); // Create a ref for the top scroll div

  const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setSnackbarOpen(false);
  };

  console.log("1234")
  useEffect(() => {
    const checkUserLists = async () => {
    if (selectedMovie) {
      setLoadingInfo(true);
      setLoadingReviews(true);
      setMovieDetails(null);
      setReviews([]);
      const email = localStorage.getItem("email");
      const favorites = await fetchFavoritesService(email);
      const watchlist = await fetchWatchlistService(email);
      const movieId = Number(selectedMovie.id);
      fetchMovieInfo(selectedMovie);
      fetchSimilarMovies(selectedMovie);
      setIsModalOpen(true)
      console.log("selected",selectedMovie)
      setIsFavorite(favorites.includes(selectedMovie.id.toString()));
      setIsInWatchlist(watchlist.includes(movieId));
    }}; checkUserLists();
  }, [selectedMovie]);
  // const smoothScrollTo = (target) => {
  //   const scrollContainer = target;
  //   const targetPosition = 0; // Scroll to the top of the container
  //   const startPosition = scrollContainer.scrollTop;
  //   const distance = targetPosition - startPosition;
  //   const duration = 500; // Duration in milliseconds
  //   let startTime = null;
  
  //   const animation = (currentTime) => {
  //     if (!startTime) startTime = currentTime;
  //     const timeElapsed = currentTime - startTime;
  //     const progress = Math.min(timeElapsed / duration, 1);
  //     scrollContainer.scrollTop = startPosition + distance * progress;
  
  //     if (timeElapsed < duration) {
  //       requestAnimationFrame(animation);
  //     }
  //   };
  
  //   requestAnimationFrame(animation);
  // };
  // const scrollToModalTop = () => {
  //   if (modalContentRef.current) {
  //     smoothScrollTo(modalContentRef.current); // Call custom smooth scroll
  //   }
  // };

  const scrollToModalTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0; // Scroll to the top
    }
  };
  useEffect(() => {
    if (isModalOpen) {
      scrollToModalTop(); // Scroll to top when modal opens
    }
  }, [isModalOpen]);

  const handleSimilarMovieClick = (movie) => {
    console.log("Selected movie:", movie);
    fetchMovieInfo(movie); // Fetch details of the selected movie
    fetchSimilarMovies(movie); // Fetch similar movies for the selected movie
    scrollToModalTop(); // Scroll to top of the modal
  };
  
  useEffect(() => {
    if (selectedMovie) {
      // Fetch similar movies based on genres
      console.log("1234",selectedMovie)
      setLoadingInfo(true);
      setLoadingReviews(true);
      setMovieDetails(null);
      setReviews([]);
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
    setLoadingSimilar(true); // Start loading
    try {
      const genreIds = movie.genre_ids || (movie.genres && movie.genres.map(genre => genre.id));
  
      // Determine the number of genres to use in the API request
      const genresToUse = genreIds?.length > 1 ? genreIds.slice(0, 2) : genreIds;
  
      // Convert the selected genres to a comma-separated string
      const genreIdsString = genresToUse.join(',');
  
      console.log("Fetching similar movies with genre IDs:", genreIdsString);
  
      const allMovies = [];
  
      // Fetch movies from pages 1, 2, and 3
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
  
        // Exclude the selected movie from the similar movies list
        const filteredMovies = response.data.results.filter(m => m.id !== movie.id);
        
        // Add the filtered movies from this page to the allMovies array
        allMovies.push(...filteredMovies);
      }
  
      // Shuffle the collected movies
      const shuffledMovies = allMovies.sort(() => 0.5 - Math.random());
      
      // Select a random number of movies (up to 6)
      const randomMovies = shuffledMovies.slice(0, 6); // Take only the first 6 shuffled movies
  
      console.log("Randomly selected movies:", randomMovies);
  
      // Set the state to the randomly selected movies
      setSimilarMovies(randomMovies);
    } catch (error) {
      console.error("Error fetching similar movies:", error);
    } finally {
      setLoadingSimilar(false); // End loading
    }
  };
  // const handleMovieClick = (movie) => {
  //   setSelectedGenres([]);
  //   setSelectedMovie(movie); // Set the selected movie
  //   console.log("Selected movie:", movie);
  //   setIsModalOpen(true); // Open the modal
  //   fetchMovieInfo(movie); // Fetch details of the selected movie
  //   fetchSimilarMovies(movie); // Fetch similar movies for the selected movie
  //   window.scrollTo(0, 0); // Scroll to top of the page
  // };
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleAddToListClick = () => {
    setOpen(true); // Open the dialog
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

const handleAddToFavorites = async () => {
  const email = localStorage.getItem("email");

  if (selectedMovie && email) {
    setLoadingFavorites(true); // Start loading
      try {
          if (isFavorite) {
              // Remove from favorites if already added
              await removeFavoriteService(email, selectedMovie.id);
              setIsFavorite(false); // Update state
              setSnackbarMessage('Removed from favorites!'); // Use Snackbar instead of alert
              setSnackbarSeverity('success');
          } else {
              // Add to favorites
              await addFavoriteService(email, selectedMovie.id);
              setIsFavorite(true); // Update state
              setSnackbarMessage('Added to favorites!'); // Use Snackbar instead of alert
              setSnackbarSeverity('success');
          }
      } catch (error) {
          console.error('Error updating favorites:', error);
          setSnackbarMessage(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`); // Use Snackbar instead of alert
          setSnackbarSeverity('error');
      } finally {
        setLoadingFavorites(false); // End loading
        setSnackbarOpen(true); // Open snackbar
    }
  } else {
    setSnackbarMessage('User not logged in or no movie selected.'); // Use Snackbar instead of alert
    setSnackbarOpen(true); // Open snackbar

  }
};

const handleAddToWatchlist = async () => {
  const email = localStorage.getItem("email");
  if (selectedMovie && email) {
    setLoadingWatchlist(true); // Start loading
      try {
          if (isInWatchlist) {
              // Remove from watchlist if already added
              await removeFromWatchlistService(email, selectedMovie.id);
              setIsInWatchlist(false); // Update state
              setSnackbarMessage('Removed from watchlist!'); // Use Snackbar instead of alert
              setSnackbarSeverity('success');
          } else {
              // Add to watchlist
              await addToWatchlistService(email, selectedMovie.id);
              setIsInWatchlist(true); // Update state
              setSnackbarMessage('Added to watchlist!'); // Use Snackbar instead of alert
              setSnackbarSeverity('success');
          }
      } catch (error) {
          console.error('Error updating watchlist:', error);
          setSnackbarMessage(`Failed to ${isInWatchlist ? 'remove from' : 'add to'} watchlist`); // Use Snackbar instead of alert
          setSnackbarSeverity('error');

      } finally {
          setLoadingWatchlist(false); // End loading
          setSnackbarOpen(true); // Open snackbar
      }
  } else {
    setSnackbarMessage('User not logged in or no movie selected.'); // Use Snackbar instead of alert
    setSnackbarOpen(true); // Open snackbar

  }
};


  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  return (
    <>
      {isModalOpen && (
            <Modal open={Boolean(selectedMovie)} onClose={onClose}>
              <Box ref={modalContentRef} height={"80%"} overflow={"scroll"} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs:"97%", sm:"90%", md:'80%', lg:"70%"}, bgcolor: 'background.paper', boxShadow: 24, borderRadius: '10px' }}>
                <IconButton
                  onClick={onClose}
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
                {movieDetails && (
                  loadingInfo ? (
                    <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%" // or any specific height you need
                  >
                    <CircularProgress size={60} /> {/* Adjust the size as needed */}
                  </Box>
                  ) : (
                  <Grid container paddingInline={{xs:"10px", lg:"40px"}} paddingBlock={{xs:"20px", lg:"40px"}} justifyContent={'center'}>
                    {/* Movie details section */}
                    <Grid xs={12} textAlign={"center"} mb={2}>
                      <Typography variant="h5" component="h2">
                        {movieDetails.title} ({movieDetails.release_date?.split('-')[0]})
                      </Typography>
                    </Grid>
                    <Grid mb={{xs:"0px", md:"20px"}} item xs={11.5} md={6} textAlign={"center"} sx={{ background: {xs:'linear-gradient(to right, #ff923c12, #ff923c42)', md:'linear-gradient(to right, transparent, #ff923c12)'}}}>
                      <Box height={{xs:"490px", md:"100%"}} overflow="hidden" display={"flex"} justifyContent={'center'}>
                        <Box
                          component="img"
                          src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                          alt={movieDetails.title}
                          sx={{ width: {xs:"100%", md:"85%", lg:"80%", xl:"70%"}, position: 'relative', alignSelf:"center" }}
                        />
                      </Box>
                    </Grid>
                      <Grid mb={{xs:"15px", md:"20px"}} item xs={11.5} md={6} pr={{xs:"10px", md:"20px"}} paddingBlock={{xs:"10px", md:"unset"}} paddingLeft={{xs:"10px", md:"0px"}} sx={{ background: 'linear-gradient(to right, #ff923c12, #ff923c42)'}}>
                      <Typography variant="body2" mt={2}>
                        {movieDetails.overview}
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
                      <Button onClick={handleAddToFavorites} disabled={loadingFavorites}>
                          {loadingFavorites ? (
                              <CircularProgress size={24} /> // Loading indicator
                          ) : isFavorite ? (
                              <FavoriteIcon style={{ color: 'red', fontSize: "36px" }} />
                          ) : (
                              <FavoriteBorderOutlinedIcon style={{ color: 'red', fontSize: "36px" }} />
                          )}
                      </Button>
                      <Button onClick={handleAddToWatchlist} disabled={loadingWatchlist}>
                          {loadingWatchlist ? (
                              <CircularProgress size={24} /> // Loading indicator
                          ) : isInWatchlist ? (
                              <WatchLaterIcon style={{ color: '#ff7b2e', fontSize: "36px" }} />
                          ) : (
                              <WatchLaterOutlinedIcon style={{ color: '#ff7b2e', fontSize: "36px" }} />
                          )}
                      </Button>

                        <div>
                  {/* <Button onClick={handleAddToListClick}>
                      Add to a List
                  </Button> */}
          
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
                              <Grid item xs={3.8} md={5.8} key={movie.id} onClick={() => handleSimilarMovieClick(movie)}>
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
                )
                )}
              </Box>
            </Modal>
      )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000} // Duration to show the Snackbar
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
    </>
  );
};

export default MovieModal;
