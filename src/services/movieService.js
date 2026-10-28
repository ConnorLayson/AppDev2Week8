const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

async function request(endpoint) {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('TMDB API key is missing. Add VITE_TMDB_API_KEY to your .env file.');
  }

  const separator = endpoint.includes('?') ? '&' : '?';
  const response = await fetch(`${BASE_URL}${endpoint}${separator}api_key=${encodeURIComponent(API_KEY)}`);

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status}). Please try again.`);
  }

  return response.json();
}

export async function getPopularMovies() {
  return request('/movie/popular');
}

export async function searchMovies(query) {
  return request(`/search/movie?query=${encodeURIComponent(query)}`);
}
