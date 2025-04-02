import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { isAuthenticated } from "@/lib/auth";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = true }: LayoutProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication if required
    if (requireAuth && !isAuthenticated()) {
      toast.error("Please login to continue");
      navigate("/login");
    }
  }, [requireAuth, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-honey-bg bg-cover bg-center">
      {/* Navbar with honey background */}
      <Navbar />
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 pt-24 pb-8 z-10 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;