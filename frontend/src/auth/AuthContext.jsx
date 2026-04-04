// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getMe, Logout } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const Login = (userData) => {
    setUser(userData);
  } 

  const logout = async () => {
    await Logout();
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await getMe();
        console.log("ME RESPONSE:", me.data);
        

        if (me?.data?.user) {
          setUser(me.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.log("Auth error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, Login, logout, isLoggedIn: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
