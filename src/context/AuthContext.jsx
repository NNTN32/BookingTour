import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkTokenExpiration = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    // Check if user is logged in on page load/refresh
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (checkTokenExpiration(token)) {
          setUser({
            username: decodedToken.username,
            userType: decodedToken.userType
          });
          setIsLoggedIn(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, []);

  useEffect(() => {
    // Set up interval to check token expiration every minute
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && !checkTokenExpiration(token)) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const login = (token) => {
    if (!checkTokenExpiration(token)) {
      throw new Error("Token is expired");
    }
    localStorage.setItem("token", token);
    const decodedToken = jwtDecode(token);
    setUser({
      username: decodedToken.username,
      userType: decodedToken.userType
    });
    setIsLoggedIn(true);
    return decodedToken;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 