
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "@/lib/auth";
import { toast } from "sonner";
import Layout from "@/components/Layout";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill out all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(email, password, confirmPassword, name);
      // User is now automatically logged in after registration
      navigate("/trending");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout requireAuth={false}>
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="glass-card rounded-lg p-8 max-w-md w-full mx-4 animate-scale-in">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Register your account in PlayHive
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="register-name" className="block text-black font-medium">
                Full Name:
              </label>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                disabled={isLoading}
                required
                placeholder="Enter your name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="register-email" className="block text-black font-medium">
                Email:
              </label>
              <input
                id="register-email"
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
              <label htmlFor="register-password" className="block text-black font-medium">
                Password:
              </label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                disabled={isLoading}
                required
                placeholder="Create a password"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-black font-medium">
                Confirm Password:
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                disabled={isLoading}
                required
                placeholder="Confirm your password"
              />
            </div>
            
            <div className="pt-4 flex justify-center">
              <button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-black">
            <p>
              Already have an Account?{" "}
              <Link to="/login" className="text-playhive-yellow hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
