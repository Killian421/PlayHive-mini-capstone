
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { checkDatabaseConnection, enableLocalStorageFallback } from "@/lib/db";
import { enableLocalStorageFallback as enableAuthLocalStorageFallback } from "@/lib/auth";
import { enableLocalStorageFallback as enableDataLocalStorageFallback } from "@/lib/data";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trending from "./pages/Trending";
import Watchlist from "./pages/Watchlist";
import AddContent from "./pages/AddContent";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Main App component
const AppContent = () => {
  useEffect(() => {
    // Check database connection on app startup
    const initApp = async () => {
      try {
        const isConnected = await checkDatabaseConnection();
        
        if (!isConnected) {
          // Enable localStorage fallback if database connection fails
          enableAuthLocalStorageFallback();
          enableDataLocalStorageFallback();
        }
      } catch (error) {
        console.error("Database initialization error:", error);
        // Ensure fallback is enabled on error
        enableLocalStorageFallback();
        enableAuthLocalStorageFallback();
        enableDataLocalStorageFallback();
      }
    };
    
    initApp();
  }, []);
  
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/watchlist/:genre" element={<Watchlist />} />
          <Route path="/add" element={<AddContent />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

// Wrap with QueryClient
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
