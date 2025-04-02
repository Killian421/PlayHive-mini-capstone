
import Layout from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="content-container max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-black animate-slide-down">
          About PlayHive
        </h1>
        
        <div className="glass-card rounded-lg p-8 animate-scale-in">
          <p className="text-black text-lg leading-relaxed mb-6">
            Welcome to PlayHive – your ultimate destination for organizing and discovering movies and series! With PlayHive, you can store and manage links to your favorite films and TV shows, creating a personalized watchlist that's always at your fingertips.
          </p>
          
          <p className="text-black text-lg leading-relaxed mb-6">
            Stay updated with the latest trends by exploring this year's hottest and most popular movies, all in one place. Whether you're planning your next movie night or binge-watching a new series, PlayHive makes it easy to track, save, and access the content you love.
          </p>
          
          <p className="text-black text-lg leading-relaxed mb-6">
            Start building your perfect watchlist today and never miss out on the best entertainment!
          </p>
          
          <div className="mt-10 pt-6 border-t border-black/10">
            <h2 className="text-xl font-bold mb-4 text-black">Features:</h2>
            <ul className="space-y-2 text-black">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Create and manage your personal watchlist</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Browse trending movies and series</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Organize content by genre</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Save links to external streaming sources</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Track seasons and episodes for series</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
