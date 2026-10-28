import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieDetails } from '../services/movieService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useMovies } from '../contexts/MovieContext';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function MovieDetails() {
  const { id } = useParams();
  const { watchlists, addMovie, removeMovie } = useMovies();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getMovieDetails(id);
        if (active) setMovie(data);
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [id]);

  if (loading) return <main className="main-content"><LoadingSpinner /></main>;
  if (error) return <main className="main-content"><ErrorMessage message={error} /></main>;
  if (!movie) return null;

  const posterUrl = movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : 'https://placehold.co/500x750/667eea/ffffff?text=No+Poster';

  return (
    <main className="main-content">
      <Link className="back-link" to="/">← Back to movies</Link>
      <section className="details-card">
        <img className="details-poster" src={posterUrl} alt={`${movie.title} poster`} />
        <div className="details-content">
          <h1>{movie.title}</h1>
          <p className="details-meta">{movie.release_date || 'Release date unknown'} · ⭐ {movie.vote_average?.toFixed?.(1) ?? 'N/A'}</p>
          <p className="details-overview">{movie.overview || 'No overview is available for this movie.'}</p>
          {movie.genres?.length > 0 && <p><strong>Genres:</strong> {movie.genres.map((genre) => genre.name).join(', ')}</p>}
          <div className="details-watchlists">
            <h3>Add to a watchlist</h3>
            {Object.entries(watchlists).map(([name, movies]) => {
              const saved = movies.some((item) => item.id === movie.id);
              return <button key={name} type="button" className={`watchlist-action ${saved ? 'saved' : ''}`} onClick={() => saved ? removeMovie(movie.id, name) : addMovie(movie, name)}>{saved ? `✓ Remove from ${name}` : `+ Add to ${name}`}</button>;
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

export default MovieDetails;
