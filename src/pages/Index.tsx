import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Auto-redirect to login or trending based on authentication status
    if (isAuthenticated()) {
      navigate("/trending");
    } else {
      navigate("/login");
    }
  }, [navigate]);
  
  // This component doesn't render anything as it's just a redirect
  return null;
};

export default Index;
