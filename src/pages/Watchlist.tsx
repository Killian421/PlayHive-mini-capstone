
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import MovieCard from "@/components/MovieCard";
import GenreSelector from "@/components/GenreSelector";
import { getWatchlist, getWatchlistByGenre, MediaItem } from "@/lib/data";

const Watchlist = () => {
  const { genre } = useParams<{ genre?: string }>();
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(genre);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // Update selected genre when route param changes
    if (genre) {
      setSelectedGenre(genre);
    }
  }, [genre]);
  
  useEffect(() => {
    const loadWatchlist = async () => {
      setIsLoading(true);
      try {
        // Get watchlist based on selected genre
        if (selectedGenre) {
          const items = await getWatchlistByGenre(selectedGenre);
          setWatchlist(items);
        } else {
          const items = await getWatchlist();
          setWatchlist(items);
        }
      } catch (error) {
        console.error("Error loading watchlist:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWatchlist();
  }, [selectedGenre]);
  
  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
  };
  
  const handleRemoveMedia = async () => {
    // Refresh the watchlist after removing an item
    setIsLoading(true);
    try {
      if (selectedGenre) {
        const items = await getWatchlistByGenre(selectedGenre);
        setWatchlist(items);
      } else {
        const items = await getWatchlist();
        setWatchlist(items);
      }
    } catch (error) {
      console.error("Error refreshing watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="content-container">
        <h1 className="text-3xl font-bold mb-8 text-center text-black animate-slide-down">
          Your Watchlist
        </h1>
        
        {!selectedGenre && <GenreSelector onSelectGenre={handleGenreSelect} />}
        
        {selectedGenre && (
          <div className="mb-8 animate-slide-up">
            <h2 className="text-2xl font-bold mb-4 text-center text-black capitalize">
              {selectedGenre}
            </h2>
            <button
              onClick={() => setSelectedGenre(undefined)}
              className="btn-primary mx-auto block"
            >
              Back to Genres
            </button>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-black text-lg">Loading your watchlist...</p>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="text-center py-8 glass-card rounded-lg animate-fade-in">
            <p className="text-xl text-black mb-4">
              {selectedGenre
                ? `No ${selectedGenre} content in your watchlist yet.`
                : "Your watchlist is empty."}
            </p>
            <p className="text-black">
              Add some content to your watchlist to see it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
            {watchlist.map((media) => (
              <MovieCard
                key={media.id}
                media={media}
                onRemove={handleRemoveMedia}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Watchlist;