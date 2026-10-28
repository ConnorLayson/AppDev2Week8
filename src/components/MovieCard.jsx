import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../contexts/MovieContext';

const FAVORITES_KEY = 'movieshelf_favorites';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; } catch { return []; }
}

function MovieCard({ movie, watchlistName }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { watchlists, addMovie, removeMovie } = useMovies();

  useEffect(() => setIsFavorite(getFavorites().some((favorite) => favorite.id === movie.id)), [movie.id]);

  function toggleFavorite() {
    const favorites = getFavorites();
    const alreadyFavorite = favorites.some((favorite) => favorite.id === movie.id);
    const updated = alreadyFavorite ? favorites.filter((favorite) => favorite.id !== movie.id) : [...favorites, movie];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('favoritesUpdated'));
    setIsFavorite(!alreadyFavorite);
  }

  const posterUrl = movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : 'https://placehold.co/300x450/667eea/ffffff?text=No+Poster';
  const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
  const rating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A';
  const currentList = watchlistName || Object.keys(watchlists)[0];
  const savedInCurrentList = currentList ? (watchlists[currentList] || []).some((item) => item.id === movie.id) : false;

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-poster-link" aria-label={`View details for ${movie.title}`}>
        <div className="movie-poster"><img src={posterUrl} alt={movie.title || 'Movie poster'} /></div>
      </Link>
      <div className="movie-info">
        <Link to={`/movie/${movie.id}`} className="movie-title-link"><h3 className="movie-title">{movie.title}</h3></Link>
        <div className="movie-details"><span className="movie-rating">⭐ {rating}</span><span className="movie-year">{year}</span></div>
        <button type="button" className={`favorite-button ${isFavorite ? 'favorited' : ''}`} onClick={toggleFavorite} aria-pressed={isFavorite}>{isFavorite ? '♥ Remove from Favorites' : '♡ Add to Favorites'}</button>
        <button type="button" className={`watchlist-button ${savedInCurrentList ? 'watchlisted' : ''}`} onClick={() => savedInCurrentList ? removeMovie(movie.id, currentList) : addMovie(movie, currentList)}>{savedInCurrentList ? `✓ Remove from ${currentList}` : `+ Add to ${currentList}`}</button>
      </div>
    </div>
  );
}

export default MovieCard;
