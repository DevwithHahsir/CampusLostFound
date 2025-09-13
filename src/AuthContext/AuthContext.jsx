/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "../firebaseConfig/firebaseCore";

const AuthContext = createContext();

// ✅ Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};

    // Initialize Firebase Auth lazily
    const initAuth = async () => {
      try {
        const [authInstance, { onAuthStateChanged }] = await Promise.all([
          getAuth(),
          import("firebase/auth"),
        ]);

        unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
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
        setLoading(false);
      }
    };

    initAuth();
    return () => unsubscribe();
  }, []);

  // helper logout function
  const logout = async () => {
    try {
      const [authInstance, { signOut }] = await Promise.all([
        getAuth(),
        import("firebase/auth"),
      ]);

      await signOut(authInstance);
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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook to use Auth anywhere
export const useAuth = () => useContext(AuthContext);
