// src/context/AuthContext.jsx
import React, { createContext, useReducer, useEffect, useContext } from 'react';
import api from '../api';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
};

const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS': // Registration will also use this
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const loadUser = async () => {
    if (state.token) {
      try {
        const res = await api.get('/auth/user');
        dispatch({ type: 'LOAD_USER_SUCCESS', payload: res.data });
      } catch (err) {
        dispatch({ type: 'AUTH_ERROR' });
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
      throw new Error(err.response?.data?.message || 'Login Failed');
    }
  };

  // --- NEW FUNCTION TO ADD ---
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      // Log the user in immediately after registering
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data }); 
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
      throw new Error(err.response?.data?.message || 'Registration Failed');
    }
  };
  // --- END OF NEW FUNCTION ---

  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register, // <-- Add register to the context value
        logout,
        loadUser,
      }}
    >
      {!state.isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};