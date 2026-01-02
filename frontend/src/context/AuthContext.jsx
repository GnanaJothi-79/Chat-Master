import { createContext, useState, useEffect } from "react";
import { connectSocket,disconnectSocket } from "../socket";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token); // 🔑 IMPORTANT
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    connectSocket();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
