
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

// Mock authentication state
let authState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null
};

// Get auth state from localStorage on init
const loadAuthState = (): void => {
  const storedAuth = localStorage.getItem('auth');
  if (storedAuth) {
    try {
      authState = JSON.parse(storedAuth);
    } catch (error) {
      console.error('Failed to parse auth state:', error);
    }
  }
};

// Save auth state to localStorage
const saveAuthState = (): void => {
  localStorage.setItem('auth', JSON.stringify(authState));
};

// Load auth state on init
loadAuthState();

// Login function
export const login = async (
  email: string,
  password: string
): Promise<User> => {
  // This would normally be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For demo purposes, accept any password for these emails
      if (email === 'john@example.com') {
        const user: User = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff'
        };
        
        authState = {
          user,
          isAuthenticated: true,
          token: 'mock-jwt-token-for-john'
        };
        
        saveAuthState();
        resolve(user);
      } else if (email === 'jane@example.com') {
        const user: User = {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=0D8ABC&color=fff'
        };
        
        authState = {
          user,
          isAuthenticated: true,
          token: 'mock-jwt-token-for-jane'
        };
        
        saveAuthState();
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800); // Simulate network delay
  });
};

// Signup function
export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  // This would normally be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For demo purposes, create a new user
      if (email === 'john@example.com' || email === 'jane@example.com') {
        reject(new Error('Email already exists'));
        return;
      }
      
      const user: User = {
        id: '3', // In a real app, this would be generated on the server
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`
      };
      
      authState = {
        user,
        isAuthenticated: true,
        token: 'mock-jwt-token-for-new-user'
      };
      
      saveAuthState();
      resolve(user);
    }, 1000); // Simulate network delay
  });
};

// Logout function
export const logout = (): void => {
  authState = {
    user: null,
    isAuthenticated: false,
    token: null
  };
  
  saveAuthState();
  toast.success('Logged out successfully');
};

// Get current user
export const getCurrentUser = (): User | null => {
  return authState.user;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return authState.isAuthenticated && !!authState.token;
};

// Get auth token
export const getToken = (): string | null => {
  return authState.token;
};
