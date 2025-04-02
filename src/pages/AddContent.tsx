
import { useState } from "react";
import Layout from "@/components/Layout";
import ContentForm from "@/components/ContentForm";

const AddContent = () => {
  const [contentType, setContentType] = useState<"movie" | "series" | null>(null);
  
  return (
    <Layout>
      <div className="content-container">
        <h1 className="text-3xl font-bold mb-8 text-center text-black animate-slide-down">
          Add to Your Watchlist
        </h1>
        
        {contentType === null ? (
          <div className="glass-card rounded-lg p-8 max-w-md mx-auto animate-scale-in">
            <h2 className="text-2xl font-bold mb-6 text-center text-black">
              What would you like to add?
            </h2>
            
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setContentType("movie")}
                className="btn-primary"
              >
                Movie?
              </button>
              
              <span className="text-black text-lg font-medium self-center">or</span>
              
              <button
                onClick={() => setContentType("series")}
                className="btn-primary"
              >
                Series?
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-center">
              <button
                onClick={() => setContentType(null)}
                className="btn-primary"
              >
                Back to Selection
              </button>
            </div>
            
            <ContentForm type={contentType} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default AddContent;
