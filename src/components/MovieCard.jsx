import { useEffect, useState } from 'react';

const FAVORITES_KEY = 'movieshelf_favorites';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

function MovieCard({ movie }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(getFavorites().some((favorite) => favorite.id === movie.id));
  }, [movie.id]);

  function toggleFavorite() {
    const favorites = getFavorites();
    const alreadyFavorite = favorites.some((favorite) => favorite.id === movie.id);
    const updatedFavorites = alreadyFavorite
      ? favorites.filter((favorite) => favorite.id !== movie.id)
      : [...favorites, movie];

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event('favoritesUpdated'));
    setIsFavorite(!alreadyFavorite);
  }

  const posterUrl = movie.poster_path
    ? `${POSTER_BASE_URL}${movie.poster_path}`
    : 'https://placehold.co/300x450/667eea/ffffff?text=No+Poster';

  const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
  const rating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={posterUrl} alt={movie.title || 'Movie poster'} />
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-details">
          <span className="movie-rating">⭐ {rating}</span>
          <span className="movie-year">{year}</span>
        </div>
        <button
          type="button"
          className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
          onClick={toggleFavorite}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '♥ Remove from Favorites' : '♡ Add to Favorites'}
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
