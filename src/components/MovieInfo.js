import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';

function MovieInfo() {

  const { imdbID } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const apiKey = '1ff17b8f';

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
        if (response.ok) {
          const data = await response.json();
          setMovieDetails(data);
        } else {
          throw new Error('Failed to fetch movie details');
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [imdbID]);
  console.log(movieDetails)
  return (
    <Grid bgcolor={"#f6f2e5"} minHeight={"100vh"}>
      <Grid container justifyContent={'center'} alignItems={'center'}>
        {movieDetails ? (
          <Grid lg={8} md={11} xs={12} my={6} mx={1} bgcolor={"white"} boxShadow={"0px 5px 9px #dcd9d0"} borderRadius={"10px"}>
            <Grid color={"white"} textAlign={{xs:"center", sm:"unset"}} borderRadius={"10px 10px 0px 0px"} display={'flex'} flexDirection={{xs:"column", sm:"unset"}} justifyContent={'space-between'} alignItems={'center'} padding={"0px 40px 0px 40px"} bgcolor={"#315e8a"}>
              <h2>{movieDetails.Title}</h2>
              <Box display={'flex'} gap={"10px"} alignItems={'center'}>
                <FontAwesomeIcon icon={faStar} color='#ffe200' size='xl'/>
                <h2>{movieDetails.imdbRating}</h2>
              </Box>
            </Grid>
            <Grid display={'flex'} flexDirection={{xs:"column", md:"row"}} justifyContent={'center'} alignItems={{xs:"center", md:"unset"}} padding={"40px"} gap={"30px"}>
              <Grid sx={{filter:"drop-shadow(2px 4px 6px gray)"}}>
                <img src={movieDetails.Poster} style={{borderRadius:"10px"}}/>
              </Grid>
              <Grid container justifyContent={'space-around'} paddingBlock={"20px"} gap={"10px"}>
                <Typography>{movieDetails.Plot}</Typography>
                <Grid lg={3} md={4} sm={5} xs={7} textAlign={'center'} width={"fit-content"}>
                  <h3>Director</h3>
                  <Typography>{movieDetails.Director}</Typography>
                </Grid>
                <Grid lg={3} md={4} sm={5} xs={7}  textAlign={'center'} width={"fit-content"}>
                  <h3>Genre</h3>
                  <Typography>{movieDetails.Genre}</Typography>
                </Grid>
                <Grid lg={3} md={4} sm={5} xs={7}  textAlign={'center'} width={"fit-content"}>
                  <h3>Runtime</h3>
                  <Typography>{movieDetails.Runtime}</Typography>
                </Grid>
                <Grid lg={3} md={4} sm={5} xs={7} textAlign={'center'} width={"fit-content"}>
                  <h3>Relesaed</h3>
                  <Typography>{movieDetails.Released}</Typography>
                </Grid>
                <Grid lg={3} md={4} sm={5} xs={7} textAlign={'center'} width={"fit-content"}>
                  <h3>Writer</h3>
                  <Typography>{movieDetails.Writer}</Typography>
                </Grid>
                <Grid xs={12} textAlign={'center'} width={"fit-content"}>
                  <h3>Cast</h3>
                  <Typography>{movieDetails.Actors}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <p>Loading...</p>
        )}
      </Grid>
    </Grid>
  );
}

export default MovieInfo;
