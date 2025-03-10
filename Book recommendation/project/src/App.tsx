import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, SearchFilters } from './types';
import { BookCard } from './components/BookCard';
import { SearchBar } from './components/SearchBar';
import { Library, Heart, Loader2 } from 'lucide-react';
import { cn } from './utils/cn';

// In a real app, this would be in an environment variable
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

function App() {
  const [filters, setFilters] = useState<SearchFilters>({ query: '', language: '' });
  const [books, setBooks] = useState<Book[]>([]);
  const [favorites, setFavorites] = useState<Book[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const searchBooks = async (newFilters: SearchFilters) => {
    setFilters(newFilters);
    
    if (!newFilters.query) {
      setBooks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        q: newFilters.query,
        maxResults: '20',
      });
      
      if (newFilters.language) {
        params.append('langRestrict', newFilters.language);
      }

      const response = await axios.get(`${GOOGLE_BOOKS_API}?${params}`);
      setBooks(response.data.items || []);
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (book: Book) => {
    setFavorites(prev => {
      const isFavorite = prev.some(b => b.id === book.id);
      if (isFavorite) {
        return prev.filter(b => b.id !== book.id);
      }
      return [...prev, book];
    });
  };

  const displayedBooks = showFavorites ? favorites : books;
  const isFavorite = (book: Book) => favorites.some(f => f.id === book.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Library className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">BookVerse</h1>
            </div>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "transition-colors",
                showFavorites
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <Heart className={cn("w-5 h-5", showFavorites && "fill-current")} />
              <span>Favorites ({favorites.length})</span>
            </button>
          </div>
          {!showFavorites && <SearchBar filters={filters} onSearch={searchBooks} />}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="text-red-600 text-center mb-8">{error}</div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : displayedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isFavorite={isFavorite(book)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {showFavorites
              ? "No favorite books yet. Start adding some!"
              : "Search for books to get started!"}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;