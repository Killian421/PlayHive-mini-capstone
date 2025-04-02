
import { MediaItem, removeFromWatchlist } from "@/lib/data";
import { useState } from "react";
import { toast } from "sonner";

interface MovieCardProps {
  media: MediaItem;
  onRemove?: () => void;
}

const MovieCard = ({ media, onRemove }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleOpenLink = () => {
    window.open(media.link, "_blank");
    toast.success(`Opening ${media.title}`);
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWatchlist(media.id);
    if (onRemove) onRemove();
  };
  
  return (
    <div 
      className="relative glass-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 cursor-pointer"
      style={{ 
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOpenLink}
    >
      <div className="p-4 relative flex flex-col h-full">
        {/* Title */}
        <h3 className="font-bold text-lg mb-1 text-black">{media.title}</h3>
        
        {/* Genre */}
        <div className="bg-secondary/90 inline-block rounded-full px-3 py-1 text-xs text-black mb-2 self-start">
          {media.genre}
        </div>
        
        {/* Season & Episode for series */}
        {media.type === "series" && media.season && media.episode && (
          <p className="text-sm text-black mb-2">
            Season {media.season}, Episode {media.episode}
          </p>
        )}
        
        {/* Call to action */}
        <div className="mt-auto pt-2">
          <p className="text-sm text-black font-bold hover:underline">
            Click to watch
          </p>
        </div>
        
        {/* Remove button (only if onRemove is provided) */}
        {onRemove && (
          <button
            className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-black hover:bg-white transition-colors"
            onClick={handleRemove}
            aria-label="Remove from watchlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
