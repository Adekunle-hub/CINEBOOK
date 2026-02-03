"use client";

import api, { setAccessToken } from "@/utils/api";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;
  signup: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;
  logout: () => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Initialize state from localStorage BEFORE first render
const getInitialAuthState = () => {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false };
  }
  
  try {
    const savedUser = localStorage.getItem("auth_user");
    const accessToken = localStorage.getItem("accessToken");
    
    if (savedUser && accessToken) {
      const userData = JSON.parse(savedUser);
      // Also set the access token immediately
      setAccessToken(accessToken);
      return { user: userData, isAuthenticated: true };
    }
  } catch (error) {
    console.error("Failed to initialize auth state:", error);
  }
  
  return { user: null, isAuthenticated: false };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const initialState = getInitialAuthState();
  const [user, setUser] = useState<User | null>(initialState.user);
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false); // Start with false since we have initial state

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    const savedUser = localStorage.getItem("auth_user");
    const accessToken = localStorage.getItem("accessToken");
    
    // If we already have both, just verify in background
    if (accessToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setAccessToken(accessToken);
        
        console.log("✅ User restored from cache (optimistic)");

        // Verify token in background (don't await)
        verifyTokenInBackground(accessToken);
        return;
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("accessToken");
      }
    }

    // Only set loading if we need to make a network request
    setIsLoading(true);

    if (accessToken) {
      console.log("✅ Access token found, fetching profile...");
      setAccessToken(accessToken);
      await fetchUserProfile();
    } else if (savedUser) {
      console.log("No access token, attempting refresh");
      try {
        const { data } = await api.post("/auth/refresh");
        const userData = JSON.parse(savedUser);
        
        setUser(userData);
        setIsAuthenticated(true);
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        
        await fetchUserProfile();
      } catch (error) {
        console.error("Failed to restore session:", error);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("accessToken");
        setUser(null);
        setIsAuthenticated(false);
      }
    }

    setIsLoading(false);
  };

  const verifyTokenInBackground = async (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        console.log("⚠️ Token expired, refreshing...");
        try {
          const { data } = await api.post("/auth/refresh");
          setAccessToken(data.accessToken);
          localStorage.setItem("accessToken", data.accessToken);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Silent logout
          localStorage.removeItem("auth_user");
          localStorage.removeItem("accessToken");
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // Token valid, optionally fetch fresh profile data
        fetchUserProfile().catch((err) => {
          console.error("Background profile fetch failed:", err);
        });
      }
    } catch (error) {
      console.error("Token verification error:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      const user = response.data.user;

      if (!user) {
        console.error("No User found");
        return {
          success: false,
          message: "No user found",
        };
      }

      const userData = {
        id: user.id,
        email: user.email,
        name: user.fullName,
      };

      setUser(userData);
      setIsAuthenticated(true); // ✅ Set authenticated when profile is fetched
      localStorage.setItem("auth_user", JSON.stringify(userData));
      
      console.log("✅ User profile fetched:", userData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Failed to fetch user profile", message);
      
      const savedUser = localStorage.getItem("auth_user");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (parseError) {
          localStorage.removeItem("auth_user");
          localStorage.removeItem("accessToken");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    }
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const { accessToken } = data;
      
      console.log("LOGIN RESPONSE:", accessToken);
      
      // Store access token
      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);

      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.fullName,
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("auth_user", JSON.stringify(userData)); // ✅ Save to localStorage

      // Fetch fresh profile in background
      fetchUserProfile().catch(console.error);

      return { success: true };
    } catch (error: any) {
      console.error("Unable to login", error);
      setIsAuthenticated(false);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }
    try {
      const { data } = await api.post("/auth/signup", {
        email,
        password,
        fullName: name,
      });
      console.log("SIGNUP RESPONSE:", data);

      // Store access token
      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
      
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.fullName,
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("auth_user", JSON.stringify(userData)); // ✅ Save to localStorage
      
      // Fetch fresh profile in background
      fetchUserProfile().catch(console.error);
      
      return { success: true };
    } catch (error: any) {
      console.error("Signup error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("auth_user");
      localStorage.removeItem("accessToken"); // ✅ Remove access token
      setAccessToken("");
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        selectedGenre,
        setSelectedGenre,
        setIsAuthenticated,
        isAuthenticated,
        login,
        signup,
        logout,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};