
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { addTrendingMovie } from "@/lib/data";

interface AddTrendingFormProps {
  onSuccess: () => void;
}

const AddTrendingForm = ({ onSuccess }: AddTrendingFormProps) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [embedId, setEmbedId] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !link || !embedId) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addTrendingMovie({
        title,
        link,
        embedId,
        thumbnailUrl: thumbnailUrl || `/mov${Math.floor(Math.random() * 16) + 1}.png`, // Default to a random movie thumbnail
        type: "movie",
        genre: "Action" // Default genre
      });
      
      toast.success("Movie added to trending successfully!");
      setTitle("");
      setLink("");
      setEmbedId("");
      setThumbnailUrl("");
      onSuccess();
    } catch (error) {
      console.error("Error adding trending movie:", error);
      toast.error("Failed to add movie to trending");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="glass-card rounded-lg p-6 mb-8 animate-scale-in">
      <h2 className="text-xl font-bold mb-4 text-center text-black">Add New Trending Movie</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-black font-medium">
            Movie Title: <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            disabled={isSubmitting}
            required
            placeholder="Enter movie title"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="link" className="block text-black font-medium">
            Movie Link: <span className="text-red-500">*</span>
          </label>
          <input
            id="link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="input-field"
            disabled={isSubmitting}
            required
            placeholder="https://example.com/movie-link"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="embedId" className="block text-black font-medium">
            YouTube Video ID: <span className="text-red-500">*</span>
          </label>
          <input
            id="embedId"
            type="text"
            value={embedId}
            onChange={(e) => setEmbedId(e.target.value)}
            className="input-field"
            disabled={isSubmitting}
            required
            placeholder="e.g. dQw4w9WgXcQ (from youtube.com/watch?v=dQw4w9WgXcQ)"
          />
          <p className="text-xs text-gray-500">
            This is the ID that appears after "v=" in a YouTube URL
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="thumbnailUrl" className="block text-black font-medium">
            Thumbnail URL: <span className="text-gray-500">(optional)</span>
          </label>
          <input
            id="thumbnailUrl"
            type="text"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="input-field"
            disabled={isSubmitting}
            placeholder="Leave blank for random thumbnail from our collection"
          />
          <p className="text-xs text-gray-500">
            If left blank, a random thumbnail will be assigned
          </p>
        </div>
        
        <div className="pt-2 flex justify-center">
          <button 
            type="submit" 
            className="btn-primary px-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add to Trending"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTrendingForm;