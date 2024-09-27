// FavoriteContext.js
import React, { createContext, useState } from 'react';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  return (
    <FavoriteContext.Provider value={{ favoriteMovies, setFavoriteMovies }}>
      {children}
    </FavoriteContext.Provider>
  );
};
