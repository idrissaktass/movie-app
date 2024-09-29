import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, CircularProgress, Grid, Pagination, IconButton } from "@mui/material";
import axios from "axios";
import MovieModal from "./MovieModal";
import CloseIcon from '@mui/icons-material/Close'; // Import the Close icon

const FavoritesModal = ({ onClose, favorites, refreshFavorites  }) => {
    const [moviesDetails, setMoviesDetails] = useState([]);
    const [loadingInfo, setLoadingInfo] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null); // State to hold the selected movie
    const [isMovieModalOpen, setIsMovieModalOpen] = useState(false); // State to control MovieModal visibility

    const handleOpenModal = (movie) => {
        setSelectedMovie(movie);
        setIsMovieModalOpen(true); // Open the MovieModal
        refreshFavorites(); // Call the refresh function here
    };

    const handleCloseModal = () => {
        setIsMovieModalOpen(false);
        setSelectedMovie(null); // Clear the selected movie
    };

    // Function to fetch movie details for each movie in the favorites
    const fetchMovieInfo = async (movieId) => {
        console.log("Fetching info for movie ID:", movieId);
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, {
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer YOUR_API_KEY' // Replace with your API key
                }
            });
            return response.data; // Return the movie details
        } catch (error) {
            console.error("Error fetching movie info:", error);
            return null; // Return null if there's an error
        }
    };

    useEffect(() => {
        const fetchAllMoviesDetails = async () => {
            const detailsPromises = favorites.map(movieId => fetchMovieInfo(movieId));
            const details = await Promise.all(detailsPromises);
            setMoviesDetails(details.filter(detail => detail)); // Filter out any null responses
            setLoadingInfo(false);
        };

        fetchAllMoviesDetails();
    }, [favorites]);

    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 14;
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = moviesDetails.slice(indexOfFirstMovie, indexOfLastMovie);
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    }; 

    return (
        <>
            <Modal open={true} onClose={onClose}>
                <Box sx={{ 
                    bgcolor: 'background.paper', 
                    border: '2px solid #000', 
                    boxShadow: 24, 
                    p: 4, 
                    maxWidth: 600, 
                    margin: 'auto',
                    height:"70%",
                    overflow:"auto", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                }}>
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
                    <Typography variant="h6" component="h2">
                        Your Favorites
                    </Typography>
                    <Box>
                        {loadingInfo ? (
                            <CircularProgress /> // Show a loading spinner while fetching
                        ) : (
                            moviesDetails.length > 0 ? (
                                currentMovies.map((movie) => (
                                    <Grid display={"flex"} alignItems={"center"} my={0.5} onClick={() => handleOpenModal(movie)}
                                    sx={{ cursor: 'pointer', background: {xs:'linear-gradient(to right, #ff923c42, #ff923c17)'}}}>
                                        <Grid item xs={5.5} sm={3.5} key={movie.id}>
                                            <Box
                                            component="img"
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            alt={movie.title}
                                            onClick={() => handleOpenModal(movie)}
                                            sx={{width: {xs:"100%"},cursor: 'pointer', position: 'relative', alignSelf:"center" }}
                                            />                
                                            <Typography>{`${movie.title} (${movie.release_date.split('-')[0]})`}</Typography>
                                        </Grid>
                                    </Grid>
                                ))
                            ) : (
                                <Typography variant="body1">No movies in your Favorites.</Typography>
                            )
                        )}
                    </Box>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                        count={Math.ceil(moviesDetails.length / moviesPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        />
                    </Box>
                    <Button onClick={onClose} color="primary">Close</Button>
                </Box>
            </Modal>
            {isMovieModalOpen && ( // Render MovieModal if it's open
                <MovieModal selectedMovie={selectedMovie} onClose={handleCloseModal} onOpen={handleOpenModal}/>
            )}
        </>
    );
};

export default FavoritesModal;
