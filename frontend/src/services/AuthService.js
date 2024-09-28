const BASE_URL = 'https://movie-app-back-bkm97t59k-idris-aktass-projects.vercel.app/api';

export const loginService = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  console.log("data", data);
  
  if (!response.ok) throw new Error(data.message);
  
  return {
    token: data.token,
    user: { id: data.userId, /* other user data */ }
  }; // Ensure user data is returned
};


export const signupService = async (username, email, password) => {
  console.log("datasignup")

  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const data = await response.json();
  console.log("datasignup",data)
  if (!response.ok) throw new Error(data.message);

  // Save the token to localStorage or manage it as required
  localStorage.setItem('token', data.token);
  localStorage.setItem('email', email); // Save other user info as needed
  
  return data.token;
};


// Add this function in your AuthService.js

// AuthService.js

// AuthService.js

export const addFavoriteService = async (email, movieId) => {
  console.log("ye",email,movieId)
  const response = await fetch(`${BASE_URL}/user-actions/add-favorite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Keep the token for authentication
    },
    body: JSON.stringify({ email, movieId }) // Pass the email instead of userId
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data; // You can return whatever is necessary
};

export const addToWatchlistService = async (email, movieId) => {
  console.log("wooww",email,movieId)
  const response = await fetch(`${BASE_URL}/user-actions/add-watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Keep the token for authentication
    },
    body: JSON.stringify({ email, movieId }) // Pass the email instead of userId
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data; // You can return whatever is necessary
};

export const removeFavoriteService = async (email, movieId) => {
  const response = await fetch(`${BASE_URL}/user-actions/remove-favorite`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ email, movieId })
  });
  const data = await response.json();
  console.log("qwe",data)
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const removeFromWatchlistService = async (email, movieId) => {
  const response = await fetch(`${BASE_URL}/user-actions/remove-watchlist`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ email, movieId })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const fetchFavoritesService = async (email) => {
  const response = await fetch(`${BASE_URL}/user-actions/favorites`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
  });

  if (!response.ok) {
      throw new Error('Failed to fetch favorites');
  }

  const data = await response.json();
  return data.favorites; // Adjust according to your response structure
};

export const fetchWatchlistService = async (email) => {
  console.log("121212",email)
  const response = await fetch(`${BASE_URL}/user-actions/watchlist`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
  });
  console.log("121212",response)

  if (!response.ok) {
      throw new Error('Failed to fetch watchlist');
  }

  const data = await response.json();
  return data.watchlist; // Adjust according to your response structure
};

// AuthService.js

export const createListService = async (email, listName, isPublic) => {
  const response = await fetch(`${BASE_URL}/user-actions/create-list`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ email, listName, isPublic })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data; // You can return whatever is necessary
};
// AuthService.js

export const getUserListsService = async (email) => {
  const response = await fetch(`${BASE_URL}/user-actions/get-lists`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }), // Send email in body
  });
  
  if (!response.ok) {
      throw new Error('Failed to fetch lists');
  }
  return await response.json(); // Assuming the response is JSON
};

// AuthService.js

export const addMovieToListService = async (email, listName, movieId) => {
  const response = await fetch(`${BASE_URL}/user-actions/add-to-list`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, listName, movieId }), // Adjust the body as needed
  });
  
  if (!response.ok) {
      throw new Error('Failed to add movie to the list');
  }
  return await response.json(); // Assuming the response is JSON
};
