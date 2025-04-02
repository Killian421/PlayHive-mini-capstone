import { toast } from "sonner";
import { query } from "./db";
import { getCurrentUser } from "./auth";

// Define types
export interface MediaItem {
  id: string;
  title: string;
  link: string;
  type: "movie" | "series";
  genre: string;
  season?: number;
  episode?: number;
  addedAt: string;
  isTrending?: boolean;
  thumbnailUrl?: string;
  embedId?: string;
}

// Storage keys
const WATCHLIST_KEY = "playHive_watchlist";
const TRENDING_KEY = "playHive_trending";

// Flag to determine if we should use localStorage fallback
let useLocalStorageFallback = false;

// Sample trending data
let trendingMovies: MediaItem[] = [
  {
    id: "movie-1",
    title: "Captain America: Brave New World",
    link: "https://example.com/captain-america",
    type: "movie",
    genre: "Action",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov1.png",
    embedId: "1pHDWnXmK7Y"
  },
  {
    id: "movie-2",
    title: "Moana 2",
    link: "https://example.com/moana-2",
    type: "movie",
    genre: "Animation",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov2.png",
    embedId: "hDZ7y8RP5HE"
  },
  {
    id: "movie-3",
    title: "Flight Risk",
    link: "https://example.com/flight-risk",
    type: "movie",
    genre: "Thriller",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov3.png",
    embedId: "ojC9JBuccJA"
  },
  {
    id: "movie-4",
    title: "Kraven",
    link: "https://example.com/kraven",
    type: "movie",
    genre: "Action",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov4.png",
    embedId: "rze8QYwWGMs"
  },
  {
    id: "movie-5",
    title: "Flow",
    link: "https://example.com/flow",
    type: "movie",
    genre: "Animation",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov5.png",
    embedId: "ZgZccxuj2RY"
  },
  {
    id: "movie-6",
    title: "Sonic 3",
    link: "https://example.com/sonic-3",
    type: "movie",
    genre: "Adventure",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov6.png",
    embedId: "qSu6i2iFMO0"
  },
  {
    id: "movie-7",
    title: "The Gorge",
    link: "https://example.com/the-gorge",
    type: "movie",
    genre: "Horror",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov7.png",
    embedId: "rUSdnuOLebE"
  },
  {
    id: "movie-8",
    title: "Mufasa",
    link: "https://example.com/mufasa",
    type: "movie",
    genre: "Animation",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov8.png",
    embedId: "o17MF9vnabg"
  },
  {
    id: "movie-9",
    title: "Snow White",
    link: "https://example.com/snow-white",
    type: "movie",
    genre: "Fantasy",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov9.png",
    embedId: "iV46TJKL8cU"
  },
  {
    id: "movie-10",
    title: "The Electric State",
    link: "https://example.com/electric-state",
    type: "movie",
    genre: "Science Fiction",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov10.png",
    embedId: "KpN98z8Kf5E"
  },
  {
    id: "movie-11",
    title: "Batman Ninja vs Yakuza League",
    link: "https://example.com/batman-ninja",
    type: "movie",
    genre: "Animation",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov11.png",
    embedId: "QleeDtH_WWE"
  },
  {
    id: "movie-12",
    title: "Demon City",
    link: "https://example.com/demon-city",
    type: "movie",
    genre: "Horror",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov12.png",
    embedId: "q-djvN7i5us"
  },
  {
    id: "movie-13",
    title: "Venom The Last Dance",
    link: "https://example.com/venom-last-dance",
    type: "movie",
    genre: "Action",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov13.png",
    embedId: "__2bjWbetsA"
  },
  {
    id: "movie-14",
    title: "Cleaner",
    link: "https://example.com/cleaner",
    type: "movie",
    genre: "Thriller",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov14.png",
    embedId: "y_EG0MxwAO4"
  },
  {
    id: "movie-15",
    title: "Popye The Slayer Man",
    link: "https://example.com/popeye-slayer",
    type: "movie",
    genre: "Comedy",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov15.png",
    embedId: "CGO32Zmh2YI"
  },
  {
    id: "movie-16",
    title: "Counter Strike",
    link: "https://example.com/counter-strike",
    type: "movie",
    genre: "Action",
    addedAt: new Date().toISOString(),
    isTrending: true,
    thumbnailUrl: "/mov16.png",
    embedId: "pEO34SeTsY0"
  }
];

// Auto-detect browser environment
const isBrowserEnvironment = typeof window !== 'undefined';
if (isBrowserEnvironment) {
  useLocalStorageFallback = true;
  
  // Load any saved trending movies from localStorage
  const savedTrending = localStorage.getItem(TRENDING_KEY);
  if (savedTrending) {
    try {
      const parsedTrending = JSON.parse(savedTrending);
      if (Array.isArray(parsedTrending) && parsedTrending.length > 0) {
        trendingMovies = parsedTrending;
      }
    } catch (error) {
      console.error("Error parsing saved trending movies:", error);
    }
  }
}

export const enableLocalStorageFallback = () => {
  useLocalStorageFallback = true;
  console.warn('Using localStorage fallback for watchlist data');
};

// Get user-specific watchlist key
const getUserWatchlistKey = (userId: string) => `${WATCHLIST_KEY}_${userId}`;

// Generate a simple ID for browser environments
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Functions to manage watchlist
export const getWatchlist = async (): Promise<MediaItem[]> => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  
  try {
    if (!useLocalStorageFallback) {
      // Get watchlist from database
      const watchlist = await query<MediaItem[]>(
        `SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC`,
        [currentUser.id]
      );
      
      return watchlist;
    }
  } catch (error) {
    console.error("Error getting watchlist from database:", error);
    
    if (!useLocalStorageFallback) {
      console.warn("Falling back to local storage for watchlist");
      useLocalStorageFallback = true;
    }
  }
  
  // Fallback to localStorage
  try {
    const userKey = getUserWatchlistKey(currentUser.id);
    const watchlistJson = localStorage.getItem(userKey);
    return watchlistJson ? JSON.parse(watchlistJson) : [];
  } catch (error) {
    console.error("Error getting watchlist from localStorage:", error);
    return [];
  }
};

export const addToWatchlist = async (mediaItem: Omit<MediaItem, "id" | "addedAt">): Promise<MediaItem> => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("User not authenticated");
  
  try {
    if (!useLocalStorageFallback) {
      const itemId = generateId();
      const now = new Date();
      
      // Insert into database
      await query(
        `INSERT INTO watchlist 
         (id, user_id, title, link, type, genre, season, episode, added_at, is_trending) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          itemId,
          currentUser.id,
          mediaItem.title,
          mediaItem.link,
          mediaItem.type,
          mediaItem.genre,
          mediaItem.season || null,
          mediaItem.episode || null,
          now.toISOString(),
          mediaItem.isTrending || false
        ]
      );
      
      const newItem: MediaItem = {
        ...mediaItem,
        id: itemId,
        addedAt: now.toISOString(),
      };
      
      toast.success(`Added ${mediaItem.title} to watchlist`);
      return newItem;
    }
  } catch (error) {
    console.error("Error adding to watchlist in database:", error);
    
    if (!useLocalStorageFallback) {
      console.warn("Falling back to local storage for adding to watchlist");
      useLocalStorageFallback = true;
    }
  }
  
  // Fallback to localStorage
  try {
    const watchlist = await getWatchlist();
    
    const newItem: MediaItem = {
      ...mediaItem,
      id: `${mediaItem.type}-${Date.now()}`,
      addedAt: new Date().toISOString(),
    };
    
    const updatedWatchlist = [...watchlist, newItem];
    const userKey = getUserWatchlistKey(currentUser.id);
    localStorage.setItem(userKey, JSON.stringify(updatedWatchlist));
    
    toast.success(`Added ${mediaItem.title} to watchlist`);
    return newItem;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    toast.error("Failed to add to watchlist");
    throw error;
  }
};

export const removeFromWatchlist = async (id: string): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("User not authenticated");
  
  try {
    if (!useLocalStorageFallback) {
      // Remove from database
      await query(
        `DELETE FROM watchlist WHERE id = ? AND user_id = ?`,
        [id, currentUser.id]
      );
      
      toast.success("Removed from watchlist");
      return;
    }
  } catch (error) {
    console.error("Error removing from watchlist in database:", error);
    
    if (!useLocalStorageFallback) {
      console.warn("Falling back to local storage for removing from watchlist");
      useLocalStorageFallback = true;
    }
  }
  
  // Fallback to localStorage
  try {
    const watchlist = await getWatchlist();
    const updatedWatchlist = watchlist.filter(item => item.id !== id);
    const userKey = getUserWatchlistKey(currentUser.id);
    localStorage.setItem(userKey, JSON.stringify(updatedWatchlist));
    
    toast.success("Removed from watchlist");
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    toast.error("Failed to remove from watchlist");
    throw error;
  }
};

export const getWatchlistByGenre = async (genre: string): Promise<MediaItem[]> => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  
  try {
    if (!useLocalStorageFallback) {
      // Get watchlist from database filtered by genre
      const watchlist = await query<MediaItem[]>(
        `SELECT * FROM watchlist WHERE user_id = ? AND genre = ? ORDER BY added_at DESC`,
        [currentUser.id, genre]
      );
      
      return watchlist;
    }
  } catch (error) {
    console.error("Error getting watchlist by genre from database:", error);
    
    if (!useLocalStorageFallback) {
      console.warn("Falling back to local storage for watchlist by genre");
      useLocalStorageFallback = true;
    }
  }
  
  // Fallback to localStorage
  const watchlist = await getWatchlist();
  return watchlist.filter(item => item.genre === genre);
};

export const getTrendingMovies = (): MediaItem[] => {
  return trendingMovies;
};

export const addTrendingMovie = async (movieData: Omit<MediaItem, "id" | "addedAt" | "isTrending">): Promise<MediaItem> => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.isAdmin) {
    throw new Error("Only admin can add trending movies");
  }
  
  try {
    const movieId = `movie-${Date.now()}`;
    const now = new Date();
    
    const newMovie: MediaItem = {
      ...movieData,
      id: movieId,
      addedAt: now.toISOString(),
      isTrending: true
    };
    
    // Add to trendingMovies array (in memory)
    trendingMovies = [newMovie, ...trendingMovies];
    
    // Save to localStorage for persistence in browser
    if (typeof window !== 'undefined') {
      localStorage.setItem(TRENDING_KEY, JSON.stringify(trendingMovies));
    }
    
    toast.success(`Added ${movieData.title} to trending movies`);
    return newMovie;
  } catch (error) {
    console.error("Error adding trending movie:", error);
    toast.error("Failed to add trending movie");
    throw error;
  }
};

export const getAllGenres = (): string[] => {
  return ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Science Fiction", "Thriller"];
};
