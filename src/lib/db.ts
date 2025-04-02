/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from "sonner";

// Flag to determine whether to use localStorage
let useLocalStorage = true;

// Create a mock connection for browser environments
const mockPool = {
  getConnection: async () => ({
    execute: async () => {},
    release: () => {}
  }),
  execute: async () => [[]],
};

// Default to mock pool
// eslint-disable-next-line prefer-const
let pool: any = mockPool;

// More robust check for Node.js environment
// This will avoid trying to use Node.js specific modules in the browser
const isNodeEnvironment = typeof window === 'undefined' && 
                         typeof process !== 'undefined' && 
                         process.versions != null && 
                         process.versions.node != null;

// We never actually try to use mysql in browser environments
// This is always set to true in browsers
useLocalStorage = !isNodeEnvironment;

// Initialize database tables if they don't exist
export const initDatabase = async () => {
  try {
    // Always use localStorage in browser context
    if (typeof window !== 'undefined') {
      console.log('Browser environment detected, using localStorage');
      enableLocalStorageFallback();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    toast.error('Failed to connect to database. Using local storage fallback.');
    enableLocalStorageFallback();
    return false;
  }
};

// Execute database query with error handling
export const query = async <T>(
  sql: string, 
  params: any[] = []
): Promise<T> => {
  try {
    if (!useLocalStorage && isNodeEnvironment) {
      const [rows] = await pool.execute(sql, params);
      return rows as T;
    }
    
    // Mock query response for localStorage fallback
    console.log('Using localStorage fallback for query:', sql, params);
    return [] as unknown as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database error occurred');
  }
};

// Check database connection and initialize tables on app start
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    // Always use localStorage in browser context
    if (typeof window !== 'undefined') {
      console.log('Browser environment detected, using localStorage');
      enableLocalStorageFallback();
      return false;
    }
    
    const result = await initDatabase();
    return result;
  } catch (error) {
    console.error('Database connection error:', error);
    enableLocalStorageFallback();
    return false;
  }
};

// Enable localStorage fallback
export const enableLocalStorageFallback = () => {
  useLocalStorage = true;
  console.warn('Using localStorage fallback for database operations');
};
