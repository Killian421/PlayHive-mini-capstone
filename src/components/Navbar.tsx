
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, isAuthenticated, logout } from "@/lib/auth";
import { useState, useEffect } from "react";
import { User, LogOut, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [user, setUser] = useState(getCurrentUser());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Update authentication status when it changes
  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setUser(getCurrentUser());
  }, [location]);
  
  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    navigate("/login");
  };
  
  // Navigation links component for reuse in both desktop and mobile views
  const NavLinks = ({ onClick = () => {}, className = "" }) => (
    <div className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-6 ${className}`}>
      <Link 
        to="/trending" 
        className={`text-black text-lg hover:text-playhive-yellow transition-colors ${location.pathname === "/trending" ? "text-playhive-yellow font-bold" : ""}`}
        onClick={onClick}
      >
        Trending
      </Link>
      <Link 
        to="/add" 
        className={`text-black text-lg hover:text-playhive-yellow transition-colors ${location.pathname === "/add" ? "text-playhive-yellow font-bold" : ""}`}
        onClick={onClick}
      >
        Append
      </Link>
      <Link 
        to="/watchlist" 
        className={`text-black text-lg hover:text-playhive-yellow transition-colors ${location.pathname === "/watchlist" ? "text-playhive-yellow font-bold" : ""}`}
        onClick={onClick}
      >
        Watchlist
      </Link>
      <Link 
        to="/about" 
        className={`text-black text-lg hover:text-playhive-yellow transition-colors ${location.pathname === "/about" ? "text-playhive-yellow font-bold" : ""}`}
        onClick={onClick}
      >
        About
      </Link>
    </div>
  );
  
  // Show simple login/register links when not authenticated
  if (!authenticated) {
    return (
      <nav className="fixed top-0 w-full z-20 bg-honey-pattern bg-cover bg-center py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to="/" className="flex items-center gap-1">
            <h1 className="text-3xl font-bold">
              <span className="text-black">Play</span>
              <span className="text-playhive-yellow">Hive</span>
            </h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className={`text-lg text-black hover:text-playhive-yellow transition-colors ${location.pathname === "/login" ? "text-playhive-yellow" : ""}`}
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
    );
  }
  
  // Mobile burger menu
  if (isMobile) {
    return (
      <nav className="fixed top-0 w-full z-20 bg-honey-pattern bg-cover bg-center py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to="/trending" className="flex items-center gap-1">
            <h1 className="text-3xl font-bold">
              <span className="text-black">Play</span>
              <span className="text-playhive-yellow">Hive</span>
            </h1>
          </Link>
          
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <button 
                className="p-2 text-black hover:text-playhive-yellow"
                aria-label="Toggle menu"
              >
                <Menu size={28} />
              </button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh] bg-honey-pattern bg-cover px-4 py-8">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    <span className="text-black">Play</span>
                    <span className="text-playhive-yellow">Hive</span>
                  </h2>
                </div>
                
                <NavLinks className="space-y-6 py-4" />
                
                <div className="mt-auto pt-6 border-t border-black/10">
                  <div className="flex items-center gap-2 text-black mb-4">
                    <User size={20} className="text-playhive-yellow" />
                    <span className="font-medium">{user?.name || 'User'}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 py-3 px-4 bg-black/5 rounded-lg hover:bg-black/10 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>
    );
  }
  
  // Desktop navigation
  return (
    <nav className="fixed top-0 w-full z-20 bg-honey-pattern bg-cover bg-center py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/trending" className="flex items-center gap-1">
          <h1 className="text-3xl font-bold">
            <span className="text-black">Play</span>
            <span className="text-playhive-yellow">Hive</span>
          </h1>
        </Link>
        
        <div className="flex items-center">
          <NavLinks className="mr-8" />
          
          <div className="flex items-center gap-2 text-black">
            <User size={20} className="text-playhive-yellow" />
            <span className="font-medium">{user?.name || 'User'}</span>
            <button 
              onClick={handleLogout}
              className="ml-4 flex items-center gap-1 text-black hover:text-playhive-yellow transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;