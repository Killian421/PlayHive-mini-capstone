
import { getAllGenres } from "@/lib/data";
import { useNavigate } from "react-router-dom";

interface GenreSelectorProps {
  onSelectGenre?: (genre: string) => void;
}

const GenreSelector = ({ onSelectGenre }: GenreSelectorProps) => {
  const navigate = useNavigate();
  const genres = getAllGenres();
  
  const handleSelectGenre = (genre: string) => {
    if (onSelectGenre) {
      onSelectGenre(genre);
    } else {
      navigate(`/watchlist/${genre.toLowerCase()}`);
    }
  };
  
  return (
    <div className="glass-card rounded-lg p-6 mb-8 animate-slide-up">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Select a Genre</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleSelectGenre(genre)}
            className="bg-secondary text-black font-bold py-3 px-4 rounded-full transition-all duration-300 hover:bg-secondary/90 hover:shadow-md hover:translate-y-[-2px] text-center"
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreSelector;
