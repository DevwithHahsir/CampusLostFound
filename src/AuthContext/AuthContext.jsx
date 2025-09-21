/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig/firebaseCore";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

// ✅ Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    let isMounted = true;

    // Initialize Firebase Auth lazily with error handling
    const initAuth = async () => {
      try {
        if (!isMounted) return;

        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (!isMounted) return;

          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // helper logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);

      // Clear Remember Me data on logout
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
      localStorage.removeItem("rememberMe");

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  };

  // Check if user email is verified
  const isEmailVerified = user?.emailVerified || false;

  const value = {
    user,
    isAuthenticated,
    isEmailVerified,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ Custom Hook to use Auth anywhere
export const useAuth = () => useContext(AuthContext);
