import { useCallback, useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getPopularMovies } from '../services/movieService';

function Home({ searchResults }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPopularMovies = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getPopularMovies();
      setMovies(data.results || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchResults === null) {
      loadPopularMovies();
    }
  }, [searchResults, loadPopularMovies]);

  const displayedMovies = searchResults !== null ? searchResults : movies;
  const isSearch = searchResults !== null;

  return (
    <main className="main-content">
      <div className="content-header">
        <h2>{isSearch ? 'Search Results' : 'Popular Movies'}</h2>
        <p>{isSearch ? `Found ${displayedMovies.length} movie${displayedMovies.length === 1 ? '' : 's'}` : 'Discover and save your favorite films'}</p>
      </div>

      {loading && !isSearch ? (
        <LoadingSpinner />
      ) : error && !isSearch ? (
        <ErrorMessage message={error} onRetry={loadPopularMovies} />
      ) : displayedMovies.length > 0 ? (
        <MovieGrid movies={displayedMovies} />
      ) : (
        <div className="empty-state">
          <p>No movies found. Try another search.</p>
        </div>
      )}
    </main>
  );
}

export default Home;
