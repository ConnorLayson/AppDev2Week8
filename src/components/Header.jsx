import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchMovies } from '../services/movieService';
import LoadingSpinner from './LoadingSpinner';

function Header({ setSearchResults }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  async function handleSearch(event) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSearchResults(null);
      setSearchError('');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      const data = await searchMovies(trimmedQuery);
      setSearchResults(data.results || []);
    } catch (error) {
      setSearchResults([]);
      setSearchError(error.message);
    } finally {
      setIsSearching(false);
    }
  }

  function handleHomeClick() {
    setSearchResults(null);
    setQuery('');
    setSearchError('');
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="app-title" onClick={handleHomeClick}>MovieShelf</Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link" onClick={handleHomeClick}>Home</Link>
          <Link to="/favorites" className="nav-link">Favorites</Link>
        </nav>
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search movies..."
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search movies"
          />
          <button type="submit" className="search-button" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
      {searchError && <p className="header-error">{searchError}</p>}
      {isSearching && <div className="header-loading"><LoadingSpinner /></div>}
    </header>
  );
}

export default Header;
