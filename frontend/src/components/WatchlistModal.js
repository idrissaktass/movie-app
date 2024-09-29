import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, CircularProgress, Grid , Pagination} from "@mui/material";
import axios from "axios";
import MovieModal from "./MovieModal";
const WatchlistModal = ({ onClose, watchlist, refreshWatchlist }) => {
    const [moviesDetails, setMoviesDetails] = useState([]);
    const [loadingInfo, setLoadingInfo] = useState(true);   
    const [selectedMovie, setSelectedMovie] = useState(null); // State to hold the selected movie
    const [isMovieModalOpen, setIsMovieModalOpen] = useState(false); // State to control MovieModal visibility
    const [currentPage, setCurrentPage] = useState(1);

    const handleOpenModal = (movie) => {
        setSelectedMovie(movie);
        setIsMovieModalOpen(true); // Open the MovieModal
        refreshWatchlist(); // Call the refresh function here
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
                    p: 4, 
                    maxWidth: 600, 
                    margin: 'auto',
                    height:"80%",
                    overflow:"auto"
                }}>
                    <Typography variant="h6" component="h2">
                        Your Watchlist
                    </Typography>
                    <Box>
                        {loadingInfo ? (
                            <CircularProgress /> // Show a loading spinner while fetching
                        ) : (
                            moviesDetails.length > 0 ? (
                                currentMovies.map((movie, index) => (
                                    <>
                                        <Grid display={"flex"} alignItems={"center"} my={0.5} onClick={() => handleOpenModal(movie)}
                                            sx={{ cursor: 'pointer', background: {xs:'linear-gradient(to right, #ff923c42, #ff923c17)'}}}>
                                                <Box height={{xs:"100px", md:"100px"}} width={"20%"} overflow="hidden" display={"flex"} justifyContent={'center'}>
                                                    <Box
                                                    component="img"
                                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                                    alt={movie.title}
                                                    sx={{width: {xs:"100%", md:"85%", lg:"80%", xl:"70%"}, position: 'relative', alignSelf:"center" }}
                                                    />
                                                </Box>
                                                <Typography key={index} variant="body1">
                                                    {`${movie.title} (${movie.release_date.split('-')[0]})`} {/* Display movie title and release year */}
                                                </Typography>
                                            </Grid>
                                    </>
                                ))
                            ) : (
                                <Typography variant="body1">No movies in your watchlist.</Typography>
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

export default WatchlistModal;
