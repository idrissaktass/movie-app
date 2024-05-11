import React, { useState, useEffect } from 'react';
import { Box, Grid, Input, Table, Select, MenuItem, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, PaginationItem, FormControl, IconButton } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

function Movies() {
  const [movieData, setMovieData] = useState(null);
  const [filterText, setFilterText] = useState('pokemon');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filter, setFilter] = useState(null);
  const apiKey = '1ff17b8f';
  const moviesPerPage = 10;
  const navigate = useNavigate();

  const handleFilter = (selectedValue) => {
    if (selectedValue === "All") {
      setFilter(null);
    } else {
      setFilter(selectedValue);
    }
  };
  console.log(movieData)
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        let url;
        if (filterText.trim() !== '') {
          url = `http://www.omdbapi.com/?s=${filterText}&page=${currentPage}&apikey=${apiKey}`;
        } else {
          url = `http://www.omdbapi.com/?page=${currentPage}&apikey=${apiKey}`;
        }

        if (selectedYear) {
          url += `&y=${selectedYear}`;
        }
        
        if (filter) {
          url += `&type=${filter}`;
        }
  
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setMovieData(data.Search);
          setTotalPages(Math.ceil(data.totalResults / moviesPerPage));
        } else {
          throw new Error('Failed to fetch movie data');
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };
  
    fetchMovieData();
  }, [filterText, currentPage, apiKey, moviesPerPage, selectedYear, filter]);

  const clearSelectedYear = () => {
    setSelectedYear(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Grid container justifyContent={'center'} alignItems={'center'} my={2}>
      <Grid xs={8} display={'flex'} flexDirection={'column'} gap={"30px"}>
        <Typography textAlign={'center'} fontSize={"32px"} color={"#315e8a"} fontWeight={"700"}>Movies</Typography>
        <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Box>
            <Input 
              defaultValue={"Pokemon"}
              type="text" 
              placeholder="Search for a movie..." 
            />
            <Button sx={{minWidth:"fit-content"}} onClick={() => { setFilterText(document.querySelector('input').value); setCurrentPage(1); }}>
              <FontAwesomeIcon style={{color:"#315e8a"}} icon={faSearch} />
            </Button>
          </Box>
          <Grid width={"250px"}>
            <FormControl fullWidth>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter ? filter : "All"}
                onChange={(event) => handleFilter(event.target.value)}
                sx={{marginTop:"5px"}}
              >
                <MenuItem value="All" fontSize={"16px"} fontWeight={"600"}>
                  All
                </MenuItem>
                <MenuItem value="movie" fontSize={"16px"} fontWeight={"600"}>
                  Movie
                </MenuItem>
                <MenuItem value="series" fontSize={"16px"} fontWeight={"600"}>
                  TV Series
                </MenuItem>
                <MenuItem value="episode" fontSize={"16px"} fontWeight={"600"}>
                  Episode
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Box display="flex" alignItems="center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker', 'DatePicker']}>
                <DatePicker
                  label={'Released year'}
                  openTo="year"
                  maxDate={dayjs()}
                  views={['year']}
                  value={selectedYear ? dayjs(`${selectedYear}`) : null}
                  onChange={(date) => setSelectedYear(date ? date.year() : null)}
                />
              </DemoContainer>
            </LocalizationProvider>
            {selectedYear && (
              <IconButton onClick={clearSelectedYear}>
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            )}
          </Box>
        </Grid>
        {movieData ? (
          <Grid display={'flex'} flexDirection={'column'} gap={"30px"}>
            <TableContainer>
              <Table aria-label='movie-table'>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{fontSize:"24px"}}>IMDB</TableCell>
                    <TableCell sx={{fontSize:"24px"}} >Type</TableCell>
                    <TableCell sx={{fontSize:"24px"}} >Title</TableCell>
                    <TableCell sx={{fontSize:"24px"}} align='right'>Year</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movieData.map((movie, index) => (
                    <TableRow key={index} sx={{cursor:"pointer", "&:hover": {boxShadow:"0px 2px 3px gray"}}} onClick={() => {navigate(`/movie/${movie.imdbID}`)}}>
                      <TableCell sx={{fontSize:"18px"}} >{movie.imdbID}</TableCell>
                      <TableCell sx={{fontSize:"18px"}} >{movie.Type}</TableCell>
                      <TableCell sx={{fontSize:"18px"}} >{movie.Title}</TableCell>
                      <TableCell sx={{fontSize:"18px"}}  align="right">{movie.Year}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid alignSelf={"end"}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
            </Grid>
          </Grid>
        ) : (
            <Typography mt={5} fontSize={"20px"}>
                {filter === "episode" ? "There is no episode" : 
                filter === "movie" ? "There are no movies" : 
                filter === "series" ? "There are no TV Series" : 
                selectedYear ? "There are no movies for the selected year" :
                "Loading..."}
            </Typography>
        )}
      </Grid>
    </Grid>
  );
}

export default Movies;
