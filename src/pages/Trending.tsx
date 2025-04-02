import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { PlayCircle } from "lucide-react";
import { getTrendingMovies } from "@/lib/data";
import { isAdmin } from "@/lib/auth";
import AddTrendingForm from "@/components/AddTrendingForm";
import type { MediaItem } from "@/lib/data";
import { toast } from "sonner";

// Define a type for our YouTube video items
interface MovieItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  embedId: string; // YouTube video ID
}

const Trending = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const userIsAdmin = isAdmin();
  
  useEffect(() => {
    const fetchTrendingMovies = () => {
      setIsLoading(true);
      try {
        const trendingMovies = getTrendingMovies();
        // Map MediaItems to MovieItems with default values for required properties
        const mappedMovies = trendingMovies.map(movie => ({
          id: movie.id,
          title: movie.title,
          thumbnailUrl: movie.thumbnailUrl || `/mov${Math.floor(Math.random() * 16) + 1}.png`,
          embedId: movie.embedId || ""
        }));
        setMovies(mappedMovies);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrendingMovies();
  }, []);
  
  // Function to handle clicking on a movie to play its video
  const handlePlayVideo = (embedId: string) => {
    if (!embedId) {
      toast.error("No video available for this movie");
      return;
    }
    setSelectedVideo(embedId);
  };
  
  // Function to close the video
  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };
  
  // Refresh trending movies after adding a new one
  const refreshMovies = () => {
    const trendingMovies = getTrendingMovies();
    // Map MediaItems to MovieItems with default values for required properties
    const mappedMovies = trendingMovies.map(movie => ({
      id: movie.id,
      title: movie.title,
      thumbnailUrl: movie.thumbnailUrl || `/mov${Math.floor(Math.random() * 16) + 1}.png`,
      embedId: movie.embedId || ""
    }));
    setMovies(mappedMovies);
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse text-xl font-medium">Loading trending content...</div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="content-container">
        <h1 className="text-3xl font-bold mb-8 text-center text-black animate-slide-down">Trending</h1>
        
        {/* Admin-only section for adding new trending movies */}
        {userIsAdmin && (
          <AddTrendingForm onSuccess={refreshMovies} />
        )}
        
        {/* Selected video modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-lg w-full max-w-4xl">
              <button 
                onClick={handleCloseVideo}
                className="absolute top-2 right-2 bg-white rounded-full p-1 text-black hover:bg-gray-200 z-10"
                aria-label="Close video"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="aspect-video w-full">
                {/* YouTube Embed Video */}
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
        
        {/* MOVIE GRID LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movies.map(movie => (
            <div 
              key={movie.id} 
              className="glass-card rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:translate-y-[-5px]"
              onClick={() => movie.embedId ? handlePlayVideo(movie.embedId) : null}
            >
              {/* Thumbnail image */}
              <div className="relative">
                <img 
                  src={movie.thumbnailUrl} 
                  alt={movie.title} 
                  className="w-full aspect-[16/10] object-cover"
                />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle size={40} className="text-white" />
                </div>
              </div>
              
              {/* Movie info section */}
              <div className="p-3">
                <h3 className="font-bold text-sm mb-1 text-black truncate">{movie.title}</h3>
                <div className="bg-secondary/90 inline-block rounded-full px-2 py-0.5 text-xs text-black">
                  New
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty state message if no movies */}
        {movies.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-700 mb-4">No trending content available yet</p>
            {userIsAdmin && (
              <p className="text-sm text-gray-600">Add your first trending movie using the form above</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Trending;
