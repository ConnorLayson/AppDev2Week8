import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import { useMovies } from '../contexts/MovieContext';

function Watchlist() {
  const { watchlists, createWatchlist, deleteWatchlist } = useMovies();
  const names = Object.keys(watchlists);
  const [activeList, setActiveList] = useState(names[0] || 'Want to Watch');
  const [newListName, setNewListName] = useState('');

  function handleCreate(event) {
    event.preventDefault();
    const name = newListName.trim();
    if (!name) return;
    createWatchlist(name);
    setActiveList(name);
    setNewListName('');
  }

  const movies = watchlists[activeList] || [];

  return (
    <main className="main-content">
      <div className="content-header">
        <h2>My Watchlists</h2>
        <p>Organize movies into lists that persist across every page.</p>
      </div>

      <div className="watchlist-toolbar">
        <div className="watchlist-tabs">
          {names.map((name) => (
            <button key={name} type="button" className={`watchlist-tab ${activeList === name ? 'active' : ''}`} onClick={() => setActiveList(name)}>
              {name} <span>{watchlists[name].length}</span>
            </button>
          ))}
        </div>
        <form className="new-list-form" onSubmit={handleCreate}>
          <input value={newListName} onChange={(e) => setNewListName(e.target.value)} placeholder="New watchlist name" aria-label="New watchlist name" />
          <button type="submit">Create</button>
        </form>
      </div>

      {names.length > 1 && (
        <button className="delete-list-button" type="button" onClick={() => { deleteWatchlist(activeList); setActiveList(names.find((n) => n !== activeList) || names[0]); }}>
          Delete “{activeList}”
        </button>
      )}

      {movies.length ? (
        <div className="movie-grid">
          {movies.map((movie) => <MovieCard key={`${activeList}-${movie.id}`} movie={movie} watchlistName={activeList} />)}
        </div>
      ) : (
        <div className="empty-state"><p>This watchlist is empty. Add movies from the Home page or a movie details page.</p></div>
      )}
    </main>
  );
}

export default Watchlist;
