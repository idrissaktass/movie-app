import React, { createContext, useState, useEffect } from 'react';
import { loginService, signupService, addFavoriteService, addToWatchlistService } from '../services/AuthService';
const BASE_URL = 'http://localhost:5000/routes';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('token', token);
      const data = await response.json();
      setUserId(data.userId)
      // Log userId instead of token
      console.log("userid", userId);
      
      setUser({ email, _id: userId }); // Include other user data as needed
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  
  useEffect(() => {
    console.log("userrrr", user);
  }, [user]); // This will log whenever `user` changes

  const signup = async (username, email, password) => {
    const token = await signupService(username, email, password);
    localStorage.setItem('token', token);
    setUser({ email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const likeMovie = async (movieId) => {
    try {
      const response = await fetch('/routes/user-actions/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ movieId })
      });

      if (!response.ok) throw new Error('Failed to like movie');
      return await response.json();
    } catch (error) {
      console.error('Error liking movie:', error);
    }
  };

  const unlikeMovie = async (movieId) => {
    try {
      const response = await fetch('/routes/user-actions/unlike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ movieId })
      });

      if (!response.ok) throw new Error('Failed to unlike movie');
      return await response.json();
    } catch (error) {
      console.error('Error unliking movie:', error);
    }
  };

  const recommendMovie = async (movieId) => {
    try {
      const response = await fetch('/routes/user-actions/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ movieId })
      });

      if (!response.ok) throw new Error('Failed to recommend movie');
      return await response.json();
    } catch (error) {
      console.error('Error recommending movie:', error);
    }
  };

  const addToFavorites = async (movieId) => {
    try {
      if (!user) throw new Error('User not logged in'); // Ensure user is logged in
      await addFavoriteService(user._id, movieId); // Pass userId and movieId
      console.log('Movie added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const addToWatchlist = async (movieId) => {
    try {
      if (!user) throw new Error('User not logged in'); // Ensure user is logged in
      await addToWatchlistService(user._id, movieId); // Pass userId and movieId
      console.log('Movie added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, likeMovie, unlikeMovie, recommendMovie, addToFavorites, addToWatchlist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
