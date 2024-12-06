import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, CircularProgress, Grid, Pagination, IconButton } from "@mui/material";
import axios from "axios";
import MovieModal from "./MovieModal";
import CloseIcon from '@mui/icons-material/Close';

const FavoritesModal = ({ onClose, favorites  }) => {
    const [moviesDetails, setMoviesDetails] = useState([]);
    const [loadingInfo, setLoadingInfo] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);

    const handleOpenModal = (movie) => {
        setSelectedMovie(movie);
        setIsMovieModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsMovieModalOpen(false);
        setSelectedMovie(null);
    };

    const fetchMovieInfo = async (movieId) => {
        console.log("Fetching info for movie ID:", movieId);
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, {
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer YOUR_API_KEY'
                }
            });
            return response.data
        } catch (error) {
            console.error("Error fetching movie info:", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchAllMoviesDetails = async () => {
            const detailsPromises = favorites.map(movieId => fetchMovieInfo(movieId));
            const details = await Promise.all(detailsPromises);
            setMoviesDetails(details.filter(detail => detail));
            setLoadingInfo(false);
        };

        fetchAllMoviesDetails();
    }, [favorites]);

    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 10;
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
                        top: 0,         
                        left: 0,
                        color: 'text.secondary',
                        zIndex: 999,
                        bgcolor: 'white',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" component="h2">
                        Your Favorites
                    </Typography>
                    <Box>
                        {loadingInfo ? (
                            <CircularProgress />
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

export default FavoritesModal;
