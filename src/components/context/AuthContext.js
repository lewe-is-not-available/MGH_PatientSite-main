import React, { createContext, useState, useEffect } from 'react';
import supabase from '../config/Supabase';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if there is a user session in local storage
    const session = JSON.parse(localStorage.getItem('supabaseSession'));
    if (session) {
      setUser(session.user);
    }
  }, []);

  const login = async (email, password) => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      throw error;
    }
    setUser(user);
    localStorage.setItem('supabaseSession', JSON.stringify(user));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('supabaseSession');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
