import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default demo presets
  const demoUsers = {
    patient: {
      id: "U001",
      name: "John Doe",
      email: "patient@health.ai",
      role: "patient",
      patient_id: "P001"
    },
    doctor: {
      id: "U002",
      name: "Dr. Sarah Jenkins",
      email: "doctor@health.ai",
      role: "doctor",
      doctor_id: "D001",
      specialization: "Cardiology"
    },
    admin: {
      id: "U003",
      name: "Super Admin",
      email: "admin@health.ai",
      role: "admin"
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('active_healthcare_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        setUser(demoUsers.admin);
      }
    } else {
      setUser(demoUsers.admin);
      localStorage.setItem('active_healthcare_user', JSON.stringify(demoUsers.admin));
    }
    setLoading(false);
  }, []);

  const switchRole = (roleKey) => {
    const selected = demoUsers[roleKey] || demoUsers.admin;
    setUser(selected);
    localStorage.setItem('active_healthcare_user', JSON.stringify(selected));
    localStorage.setItem('token', `mock-jwt-token-${selected.id}`);
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      localStorage.setItem('active_healthcare_user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Authentication failed.' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      setUser(res.data.user);
      localStorage.setItem('active_healthcare_user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Registration failed.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('active_healthcare_user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, switchRole, login, register, logout, demoUsers }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
