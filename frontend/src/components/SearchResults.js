// SearchResults.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, useMediaQuery, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MovieModal from './MovieModal';
import { Helmet } from "react-helmet-async";

const SearchResults = ({ onClose, SearchResults  }) => {
  const [genres, setGenres] = useState([]);
  const [releaseYears, setReleaseYears] = useState([]);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState([]); // Update to array
  const isXs = useMediaQuery((theme) => theme.breakpoints.down('sm')); // for xs and sm sizes
  const isMd = useMediaQuery((theme) => theme.breakpoints.up('md')); // for md size
  const [currentChunk, setCurrentChunk] = useState(0);
  const yearsPerPage = 10; // Display 10 years at a time
  const totalYears = 50; // Total years to display
  const totalChunks = Math.ceil(totalYears / yearsPerPage);
  const years = Array.from({ length: totalYears }, (_, i) => new Date().getFullYear() - i); // Last 50 years
  const displayedYears = years.slice(currentChunk * yearsPerPage, (currentChunk + 1) * yearsPerPage);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Set to current year
  const [yearIsClicked, setYearIsClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [moviesDetails, setMoviesDetails] = useState([]);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null); // State to hold the selected movie
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false); // State to control MovieModal visibility

  // Determine how many page numbers to display
  const visiblePageCount = isMd ? 5 : isXs ? 3 : 10;

  // Calculate the range of pages to show
  const startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
  const endPage = Math.min(totalPages, startPage + visiblePageCount - 1);
  const adjustedStartPage = Math.max(1, endPage - visiblePageCount + 1);

  const handleChunkChange = (direction) => {
    setCurrentChunk((prevChunk) => {
      if (direction === 'next' && prevChunk < totalChunks - 1) {
        return prevChunk + 1;
      } else if (direction === 'prev' && prevChunk > 0) {
        return prevChunk - 1;
      }
      return prevChunk;
    });
  };

  const handleOpenModal = (movie) => {
    setSelectedMovie(movie);
    setIsMovieModalOpen(true); // Open the MovieModal
    console.log("xd",movie)
  };
  
  const refreshSearch = async () => {
    fetchMovies()
  };
  const handleCloseModal = () => {
    setIsMovieModalOpen(false);
    setSelectedMovie(null); // Clear the selected movie
    console.log("Closed modal"); // Debugging log

  };

  useEffect(() => {
    const fetchGenres = async () => {
      const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
      const options = {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDRiYzJhNDcxMzljM2E1ZDgyNjgxNGYwMzc5NGIyMSIsIm5iZiI6MTcyNjYxMzg3MC43NTcwODIsInN1YiI6IjY1NGEwN2JjMjg2NmZhMDBjNDI1OWJmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7jP0jl8WExn2tVvRBfkna_WrlXoGYbYCZDKcAwVoRbA'
        },
      };

      try {
        const response = await axios.get(url, options);
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    const fetchReleaseYears = () => {
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 21 }, (_, i) => currentYear - i); // Last 20 years
      setReleaseYears(years);
    };
    fetchMovies(selectedGenres, new Date().getFullYear(), 1); // Fetch current year movies initially
    fetchGenres();
    fetchReleaseYears();
  }, []);

  const handleGenreClick = async (genre) => {
    // If the clicked genre is already selected, deselect it by setting selectedGenres to an empty array
    const isGenreSelected = selectedGenres.includes(genre.id);
    
    // If it's selected, we clear the selection, otherwise, we select the clicked genre
    const updatedGenres = isGenreSelected ? [] : [genre.id];
    
    setSelectedGenres(updatedGenres); // Update state with only the selected genre
    setCurrentPage(1); // Reset to the first page
  
    // Fetch movies based on the selected genre or no genre (if deselected)
    fetchMovies(updatedGenres, selectedYear, 1);
  };
  
  
  
  const handlePageChange = async (page) => {
    setCurrentPage(page);
    fetchMovies(selectedGenres, selectedYear, page); // Fetch movies based on selected genres
  };

  const handleYearClick = async (year) => {
    setYearIsClicked(true);
    setSelectedYear(year);
    fetchMovies(selectedGenres, year); // Fetch movies based on selected year
  };

  const fetchMovies = async (genres, year, page = 1) => {
    setLoading(true)
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          with_genres: genres.join(','), // Convert array to comma-separated string
          primary_release_year: year,
          vote_count: 100,
          sort_by: 'popularity.desc',
          page,
        },
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDRiYzJhNDcxMzljM2E1ZDgyNjgxNGYwMzc5NGIyMSIsIm5iZiI6MTcyNjYxMzg3MC43NTcwODIsInN1YiI6IjY1NGEwN2JjMjg2NmZhMDBjNDI1OWJmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7jP0jl8WExn2tVvRBfkna_WrlXoGYbYCZDKcAwVoRbA'
        },
      });
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <Grid>
                <Helmet>
            <title>CineScope - Find Your Movie!</title>
            <meta name="description" content="Find your movie with searching" />
            <meta name="keywords" content="Movie Quiz, Film Quiz, Movie Trivia, Film Knowledge Test, Movie Games, movie, movies, film, films, movie suggestion, film suggestion, movie by mood" />
            <meta name="author" content="idrisaktas.online" />
            <meta property="og:title" content="CineScope - Find Your Movie!" />
            <meta property="og:description" content="Find your movie with suggestions" />
            <meta property="og:type" content="website" />
          </Helmet>
      <Navbar />
      <Grid container paddingInline={{ xs: 1, sm: 3, md: 5, lg: 10 }} paddingTop={2} paddingBottom={8} gap={3} justifyContent={'center'}>
        <Grid>
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Release Years
          </Typography>
          <Grid container gap={1}>
            {/* Pagination controls for years */}
            <Grid item>
              <Button
                onClick={() => handleChunkChange('prev')}
                disabled={currentChunk === 0}
                variant="outlined"
                sx={{ marginRight: 1 }}
              >
                <ArrowBackIcon />
              </Button>
            </Grid>
            {displayedYears.map((year) => (
              <Grid item key={year}>
                <Button 
                  variant="outlined" 
                  onClick={() => handleYearClick(year)}
                  sx={{
                    backgroundColor: selectedYear === year ? '#0050a0' : 'default', // Change background if selected
                    color: selectedYear === year ? 'white' : 'inherit'
                  }}
                >
                  {year}
                </Button>
              </Grid>
            ))}
            <Grid item>
              <Button
                onClick={() => handleChunkChange('next')}
                disabled={currentChunk === totalChunks - 1}
                variant="outlined"
              >
                <ArrowForwardIcon />
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid>
          <Typography variant="h6" gutterBottom>
            Genres
          </Typography>
          <Grid container gap={1}>
            {genres.map((genre) => (
              <Grid item width={"fit-content"} key={genre.id}>
                <Button 
                  variant="contained" 
                  onClick={() => handleGenreClick(genre)}
                  sx={{
                    backgroundColor: selectedGenres.includes(genre.id) ? '#0050a0' : 'default', // Change background if selected
                    color: selectedGenres.includes(genre.id) ? 'white' : 'inherit'
                  }}
                >
                  {genre.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {(selectedGenres.length > 0 || selectedYear) && !loading && (
          <Grid xs={12}>    
            <Grid item xs={12} mt={2}>
              <Typography variant="h5" align="center">
                <strong>{selectedGenres.map((id) => genres.find(genre => genre.id === id)?.name).join(', ')} {selectedYear}</strong> Movies
              </Typography>
            </Grid>
            {/* Movie List */}
            <Grid container gap={1} justifyContent={'center'} mt={2}>
              {movies.map((movie) => (
                <Grid item xs={5} sm={2.8} md={2} lg={2} key={movie.id}>
                  <Box position="relative" onClick={() => handleOpenModal(movie)} sx={{cursor:"pointer"}}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      style={{ width: '100%', height: 'auto' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background
                        color: 'white',
                        textAlign: 'center',
                        padding: '0.5rem',
                      }}
                    >
                      <Typography variant="h6">{movie.title}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Pagination Controls */}
            <Grid xs={12} sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                  {/* Previous Button */}
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outlined"
                    sx={{ marginRight: 1 }}
                  >
                    <ArrowBackIcon />
                  </Button>

                  {/* Page Number Buttons */}
                  {Array.from({ length: endPage - adjustedStartPage + 1 }).map((_, index) => {
                    const pageIndex = adjustedStartPage + index;
                    return (
                      <Button
                        key={pageIndex}
                        variant="outlined"
                        onClick={() => handlePageChange(pageIndex)}
                        sx={{ marginRight: 1 }}
                        disabled={currentPage === pageIndex}
                      >
                        {pageIndex}
                      </Button>
                    );
                  })}

                  {/* Next Button */}
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outlined"
                    sx={{ marginLeft: 1 }}
                  >
                    <ArrowForwardIcon />
                  </Button>
                </Grid>
          </Grid>
        )}
      </Grid>
      {isMovieModalOpen && ( // Render MovieModal if it's open
        <MovieModal selectedMovie={selectedMovie} onClose={handleCloseModal} onOpen={handleOpenModal}/>
      )}
    </Grid>
  );
};

export default SearchResults;
