import { toast } from "sonner";
import { query } from "./db";

// Define types
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

// Check if database is available or fall back to local storage
let useLocalStorageFallback = false;

// More robust check for browser environment
const isBrowserEnvironment = typeof window !== 'undefined';
if (isBrowserEnvironment) {
  useLocalStorageFallback = true;
}

export const enableLocalStorageFallback = () => {
  useLocalStorageFallback = true;
  console.warn('Using localStorage fallback for authentication');
};

// Generate a simple UUID for browser environments
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Login function - attempts database first, falls back to localStorage
export const login = async (email: string, password: string): Promise<User> => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  
  // Check for admin credentials
  if (email === "admin@email.com" && password === "admin123") {
    const adminUser: User = {
      id: "admin-id",
      name: "Admin",
      email: "admin@email.com",
      isAdmin: true
    };
    
    // Store admin user in session
    sessionStorage.setItem("user", JSON.stringify(adminUser));
    toast.success("Logged in as Admin!");
    return adminUser;
  }
  
  try {
    if (!useLocalStorageFallback) {
      // Attempt to find user in database
      const users = await query<any[]>(
        'SELECT id, name, email FROM users WHERE email = ? AND password = ?',
        [email, password] // In a real app, password would be hashed
      );
      
      if (users.length === 0) {
        throw new Error("Invalid credentials");
      }
      
      const user = users[0];
      
      // Store user in session
      sessionStorage.setItem("user", JSON.stringify(user));
      
      toast.success("Logged in successfully!");
      return user;
    }
  } catch (error) {
    console.error("Database login error:", error);
    
    // Fall back to localStorage if database failed
    if (!useLocalStorageFallback) {
      console.warn("Falling back to local storage authentication");
      useLocalStorageFallback = true;
    }
  }
  
  // Local storage fallback
  return new Promise((resolve, reject) => {
    try {
      // Simple validation
      if (!email || !password) {
        reject(new Error("Email and password are required"));
        return;
      }
      
      // Check if user exists
      const storedUserJson = localStorage.getItem("user");
      if (!storedUserJson) {
        reject(new Error("Invalid account. Please register first."));
        return;
      }
      
      const storedUser = JSON.parse(storedUserJson);
      if (storedUser.email !== email) {
        reject(new Error("Invalid account. Please register first."));
        return;
      }
      
      // Store in sessionStorage to simulate session
      sessionStorage.setItem("user", storedUserJson);
      
      toast.success("Logged in successfully!");
      setTimeout(() => resolve(storedUser), 500);
    } catch (error) {
      console.error("LocalStorage login error:", error);
      reject(new Error("Login failed. Please try again."));
    }
  });
};

export const register = async (
  email: string, 
  password: string, 
  confirmPassword: string,
  name: string
): Promise<User> => {
  if (!email || !password || !name) {
    throw new Error("Name, email and password are required");
  }
  
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
  
  try {
    if (!useLocalStorageFallback) {
      // Check if email already exists
      const existingUsers = await query<any[]>(
        'SELECT email FROM users WHERE email = ?',
        [email]
      );
      
      if (existingUsers.length > 0) {
        throw new Error("Email already registered");
      }
      
      // Create new user in database
      const userId = generateId();
      await query(
        'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
        [userId, name, email, password] // In a real app, password would be hashed
      );
      
      const user = { id: userId, name, email };
      
      // Store in session
      sessionStorage.setItem("user", JSON.stringify(user));
      
      toast.success("Registered and logged in successfully!");
      return user;
    }
  } catch (error: any) {
    console.error("Database registration error:", error);
    
    if (error.message === "Email already registered") {
      throw error;
    }
    
    // Fall back to localStorage if database failed
    if (!useLocalStorageFallback) {
      console.warn("Falling back to local storage for registration");
      useLocalStorageFallback = true;
    }
  }
  
  // Local storage fallback
  return new Promise((resolve, reject) => {
    try {
      // Simple validation
      if (!email || !password || !name) {
        reject(new Error("Name, email and password are required"));
        return;
      }
      
      if (password !== confirmPassword) {
        reject(new Error("Passwords do not match"));
        return;
      }
      
      // Check if email already exists in localStorage
      const existingUser = localStorage.getItem("user");
      if (existingUser) {
        const user = JSON.parse(existingUser);
        if (user.email === email) {
          reject(new Error("Email already registered"));
          return;
        }
      }
      
      // Create the user
      const user = { id: generateId(), name, email };
      
      // Store user data
      localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("user", JSON.stringify(user));
      
      toast.success("Registered and logged in successfully!");
      setTimeout(() => resolve(user), 500);
    } catch (error) {
      console.error("LocalStorage registration error:", error);
      reject(new Error("Registration failed. Please try again."));
    }
  });
};

export const logout = (): void => {
  sessionStorage.removeItem("user");
  localStorage.removeItem("user");
  toast.success("Logged out successfully!");
};

export const getCurrentUser = (): User | null => {
  try {
    // First check session storage for active session
    const sessionUserJson = sessionStorage.getItem("user");
    if (sessionUserJson) {
      return JSON.parse(sessionUserJson) as User;
    }
    
    // Fall back to localStorage if session not found
    const localUserJson = localStorage.getItem("user");
    if (localUserJson) {
      return JSON.parse(localUserJson) as User;
    }
    
    return null;
  } catch (e) {
    console.error("Error getting current user:", e);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.isAdmin === true;
};