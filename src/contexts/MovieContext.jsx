import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const MovieContext = createContext(null);
const STORAGE_KEY = 'movieshelf_watchlists';
const DEFAULT_WATCHLISTS = {
  'Want to Watch': [],
  'Currently Watching': [],
  Watched: [],
};

function loadWatchlists() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      return { ...DEFAULT_WATCHLISTS, ...saved };
    }
  } catch {
    // Fall through to defaults.
  }
  return DEFAULT_WATCHLISTS;
}

export function MovieProvider({ children }) {
  const [watchlists, setWatchlists] = useState(loadWatchlists);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlists));
  }, [watchlists]);

  const addMovie = (movie, listName = 'Want to Watch') => {
    setWatchlists((current) => {
      const list = current[listName] || [];
      if (list.some((item) => item.id === movie.id)) return current;
      return { ...current, [listName]: [...list, movie] };
    });
  };

  const removeMovie = (movieId, listName = 'Want to Watch') => {
    setWatchlists((current) => ({
      ...current,
      [listName]: (current[listName] || []).filter((movie) => movie.id !== movieId),
    }));
  };

  const moveMovie = (movie, fromList, toList) => {
    if (fromList === toList) return;
    setWatchlists((current) => {
      const destination = current[toList] || [];
      const source = current[fromList] || [];
      if (destination.some((item) => item.id === movie.id)) {
        return { ...current, [fromList]: source.filter((item) => item.id !== movie.id) };
      }
      return {
        ...current,
        [fromList]: source.filter((item) => item.id !== movie.id),
        [toList]: [...destination, movie],
      };
    });
  };

  const createWatchlist = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    setWatchlists((current) => (current[trimmed] ? current : { ...current, [trimmed]: [] }));
    return true;
  };

  const deleteWatchlist = (name) => {
    if (Object.keys(watchlists).length <= 1) return;
    setWatchlists((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const value = useMemo(() => ({
    watchlists,
    addMovie,
    removeMovie,
    moveMovie,
    createWatchlist,
    deleteWatchlist,
  }), [watchlists]);

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovies must be used inside MovieProvider');
  return context;
}
