
import { useState } from "react";
import { addToWatchlist, getAllGenres } from "@/lib/data";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ContentFormProps {
  type: "movie" | "series";
}

const ContentForm = ({ type }: ContentFormProps) => {
  const navigate = useNavigate();
  const genres = getAllGenres();
  
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [genre, setGenre] = useState(genres[0]);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !link || !genre) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    try {
      const mediaData = {
        title,
        link,
        genre,
        type,
        ...(type === "series" ? { season, episode } : {})
      };
      
      addToWatchlist(mediaData);
      navigate("/watchlist");
    } catch (error) {
      console.error("Error adding content:", error);
    }
  };
  
  return (
    <div className="glass-card rounded-lg p-6 max-w-lg mx-auto animate-slide-up">
      <h2 className="text-xl font-bold mb-6 text-center text-black">
        {type === "movie" ? "Add Movie" : "Add Series"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-black font-medium">
            Title of the {type}:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            required
          />
        </div>
        
        {/* Link */}
        <div className="space-y-2">
          <label htmlFor="link" className="block text-black font-medium">
            Link of the {type}:
          </label>
          <input
            id="link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="input-field"
            required
          />
        </div>
        
        {/* Series-specific fields */}
        {type === "series" && (
          <>
            {/* Season */}
            <div className="space-y-2">
              <label htmlFor="season" className="block text-black font-medium">
                Season:
              </label>
              <select
                id="season"
                value={season}
                onChange={(e) => setSeason(Number(e.target.value))}
                className="select-field"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Episode */}
            <div className="space-y-2">
              <label htmlFor="episode" className="block text-black font-medium">
                Episode:
              </label>
              <select
                id="episode"
                value={episode}
                onChange={(e) => setEpisode(Number(e.target.value))}
                className="select-field"
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        
        {/* Genre */}
        <div className="space-y-2">
          <label htmlFor="genre" className="block text-black font-medium">
            Genre:
          </label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="select-field"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        
        {/* Submit button */}
        <div className="pt-2 flex justify-center">
          <button type="submit" className="btn-primary px-8">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentForm;
