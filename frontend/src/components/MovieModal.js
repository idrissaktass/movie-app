import React, { useState, useEffect, useRef, useContext  } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, List, ListItem, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import CreateList from './CreateList'; // Adjust the import based on your file structure
import axios from 'axios';
import { addFavoriteService, addToWatchlistService, removeFavoriteService, removeFromWatchlistService, fetchFavoritesService,fetchWatchlistService } from "../services/AuthService";
const apiKey = '404bc2a47139c3a5d826814f03794b21'; // TMDB API key


const MovieModal = ({ selectedMovie, onOpen  }) => {
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

  const scrollToTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  };
  const handleSimilarMovieClick = (movie) => {
    setTimeout(() => {
      onOpen(movie); // Open the modal with the selected similar movie
    }, 100); // Optional: add a delay for a smoother experience
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
    try {
      const genreIds = movie.genre_ids || (movie.genres && movie.genres.map(genre => genre.id));
  
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
    try {
      if (isFavorite) {
        // Remove from favorites if already added
        await removeFavoriteService(email, selectedMovie.id);
        setIsFavorite(prev => prev.filter(id => id !== selectedMovie.id)); // Update state
        alert('Removed from favorites!');
      } else {
        // Add to favorites
        await addFavoriteService(email, selectedMovie.id);
        setIsFavorite(prev => [...prev, selectedMovie.id]); // Update state
        alert('Added to favorites!');
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`);
    }
  } else {
    alert('User not logged in or no movie selected.');
  }
};

const handleAddToWatchlist = async () => {
    const email = localStorage.getItem("email");
    if (selectedMovie && email) {
        try {
            if (isInWatchlist) {
                // Remove from watchlist if already added
                await removeFromWatchlistService(email, selectedMovie.id);
                setIsInWatchlist(false); // Update state
                alert('Removed from watchlist!');
            } else {
                // Add to watchlist
                await addToWatchlistService(email, selectedMovie.id);
                setIsInWatchlist(true); // Update state
                alert('Added to Watchlist!');
            }
        } catch (error) {
            console.error('Error updating watchlist:', error);
            alert(`Failed to ${isInWatchlist ? 'remove from' : 'add to'} watchlist`);
        }
    } else {
        alert('User not logged in or no movie selected.');
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
                        <Button onClick={handleAddToFavorites}>
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
                )}
              </Box>
            </Modal>
      )}
    </>
  );
};

export default MovieModal;
