import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Local storage se user load karo
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  
  // Login function - tera existing Google auth
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
};


/*



State	    Meaning
user	    Logged in user data
token	    JWT token
loading	  Auth check ho raha hai ya nahi


Page reload hone par user ko automatically login rakhna
Step by Step Summary

Ye code kya karta hai:

App start hoti hai
localStorage check karta hai
Agar user aur token mil jaye
To state me wapas set karta hai
Matlab user logged in hi rehta hai
Fir loading false karta hai

useAuth() call hone ka matlab kya hota hai

Jab tum likhte ho:

const { user, login } = useAuth();

Iska matlab:

Component render
→ useAuth() run
→ useState create
→ useEffect run
→ user/token check
→ functions return
→ component use karega

Matlab hook poora run hota hai, sirf function nahi milta.

*/