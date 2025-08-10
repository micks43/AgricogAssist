import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [farmName, setFarmName] = useState(null);

  const login = (token, user, farmName) => {
    setToken(token);
    setUser(user);
    setFarmName(farmName);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setFarmName(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, farmName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

