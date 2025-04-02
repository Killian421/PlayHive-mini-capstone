
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "@/lib/auth";
import { toast } from "sonner";
import Layout from "@/components/Layout";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill out all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate("/trending");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout requireAuth={false}>
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="glass-card rounded-lg p-8 max-w-md w-full mx-4 animate-scale-in">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Enter your PlayHive Account
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-black font-medium">
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                disabled={isLoading}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-black font-medium">
                Password:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                disabled={isLoading}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <div className="pt-4 flex justify-center">
              <button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-black">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-playhive-yellow hover:underline font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;