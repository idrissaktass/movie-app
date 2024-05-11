import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieInfo from './components/MovieInfo';
import Movies from './components/Movies';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/movie/:imdbID" element={<MovieInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
