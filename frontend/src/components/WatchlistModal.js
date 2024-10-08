import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, CircularProgress, Grid , Pagination, IconButton} from "@mui/material";
import axios from "axios";
import MovieModal from "./MovieModal";
import CloseIcon from '@mui/icons-material/Close'; // Import the Close icon

const WatchlistModal = ({ onClose, watchlist }) => {
    const [moviesDetails, setMoviesDetails] = useState([]);
    const [loadingInfo, setLoadingInfo] = useState(true);   
    const [selectedMovie, setSelectedMovie] = useState(null); // State to hold the selected movie
    const [isMovieModalOpen, setIsMovieModalOpen] = useState(false); // State to control MovieModal visibility
    const [currentPage, setCurrentPage] = useState(1);

    const handleOpenModal = (movie) => {
        setSelectedMovie(movie);
        setIsMovieModalOpen(true); // Open the MovieModal
    };

    const handleCloseModal = () => {
        setIsMovieModalOpen(false);
        setSelectedMovie(null); // Clear the selected movie
    };

    // Function to fetch movie details for each movie in the watchlist
    const fetchMovieInfo = async (movieId) => {
        console.log("Fetching info for movie ID:", movieId);
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, {
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDRiYzJhNDcxMzljM2E1ZDgyNjgxNGYwMzc5NGIyMSIsIm5iZiI6MTcyNjYxMzg3MC43NTcwODIsInN1YiI6IjY1NGEwN2JjMjg2NmZhMDBjNDI1OWJmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7jP0jl8WExn2tVvRBfkna_WrlXoGYbYCZDKcAwVoRbA'
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
            console.log("watchlist111111",watchlist)
            const detailsPromises = watchlist.map(movieId => fetchMovieInfo(movieId));
            console.log("detailsPromises",detailsPromises)
            const details = await Promise.all(detailsPromises);
            console.log("details",details)
            setMoviesDetails(details.filter(detail => detail)); // Filter out any null responses
            setLoadingInfo(false);
        };

        fetchAllMoviesDetails();
    }, [watchlist]);


    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    }; 
    const moviesPerPage = 14;
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = moviesDetails.slice(indexOfFirstMovie, indexOfLastMovie);


    return (
        <>
            <Modal open={true} onClose={onClose}>
                <Box sx={{ 
                    bgcolor: 'background.paper', 
                    border: '2px solid #000', 
                    boxShadow: 24, 
                    maxWidth: 600,
                    p:2,
                    width:{xs:"80%", sm:"60%", md:"40%"},
                    margin: 'auto',
                    height:"70%",
                    overflow:"auto", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                }}>
                    <IconButton
                        onClick={onClose}
                        sx={{
                        position: 'sticky',
                        top: 0,           // Stick the button to the top of the scrolling area
                        left: 0,
                        color: 'text.secondary',
                        zIndex: 999,
                        bgcolor: 'white', // Add background color if needed for visibility
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" component="h2">
                        Your Watchlist
                    </Typography>
                    <Box>
                        {loadingInfo ? (
                            <CircularProgress /> // Show a loading spinner while fetching
                        ) : (
                            moviesDetails.length > 0 ? (
                                <>
                                    <Grid container justifyContent={"center"} gap={2}>
                                        {currentMovies.map((movie) => (
                                            <Grid xs={5.5} sm={3.5}  alignItems={"center"} my={0.5} onClick={() => handleOpenModal(movie)}
                                            sx={{ cursor: 'pointer'}}>
                                                <Grid itemkey={movie.id}>
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
                                        ))}
                                    </Grid>
                                    <Box display="flex" justifyContent="center" mt={2}>
                                        <Pagination
                                        count={Math.ceil(moviesDetails.length / moviesPerPage)}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        color="primary"
                                        />
                                    </Box>
                                </>
                                
                            ) : (
                                <Typography variant="body1" mt={3}>No movies in your Favorites.</Typography>
                            )
                        )}
                    </Box>
                </Box>
            </Modal>
            {isMovieModalOpen && ( // Render MovieModal if it's open
                <MovieModal selectedMovie={selectedMovie} onClose={handleCloseModal} onOpen={handleOpenModal}/>
            )}
        </>
    );
};

export default WatchlistModal;
