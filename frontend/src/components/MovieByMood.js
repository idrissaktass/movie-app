import React from "react";

const MovieByMood = (selectedMovie, onOpen  ) => {
    return(
        <Modal open={isMoodMovie} onClose={handleCloseMoodModal}>
        <Box height={"90%"} overflow={"scroll"} p={4}
            sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: {xs:"97%", sm:"90%", md:'80%', lg:"70%"}, bgcolor: 'background.paper', boxShadow: 24, borderRadius: '10px' }}>
          <Typography variant="h6">Select Your Mood</Typography>
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
          
          <Button variant="contained" onClick={handleSubmit} disabled={!selectedMood}>
            Find Movies
          </Button>
          
          <Typography variant="h6" mt={2}>Recommended Movies:</Typography>
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
    )
}
export default MovieByMood;