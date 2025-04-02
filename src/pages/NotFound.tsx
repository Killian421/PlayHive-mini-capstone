
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const NotFound = () => {
  return (
    <Layout requireAuth={false}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-5xl font-bold mb-4 text-black animate-slide-down">404</h1>
        <p className="text-xl text-black mb-8 animate-fade-in">
          Oops! We couldn't find the page you're looking for.
        </p>
        <Link 
          to="/trending" 
          className="btn-primary animate-scale-in"
        >
          Back to Home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
