import { useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';

const FAVORITES_KEY = 'movieshelf_favorites';

function Favorites() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  function loadFavorites() {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
      setFavoriteMovies(savedFavorites);
    } catch {
      setFavoriteMovies([]);
    }
  }

  useEffect(() => {
    loadFavorites();

    function handleStorageChange() {
      loadFavorites();
    }

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, []);

  return (
    <main className="main-content">
      <div className="content-header">
        <h2>My Favorites</h2>
        <p>Your saved movies collection</p>
      </div>
      {favoriteMovies.length > 0 ? (
        <MovieGrid movies={favoriteMovies} />
      ) : (
        <div className="empty-state">
          <p>No favorite movies yet. Start adding some from the home page!</p>
        </div>
      )}
    </main>
  );
}

export default Favorites;
