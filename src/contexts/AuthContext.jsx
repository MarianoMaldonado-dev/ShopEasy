import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const API_URL = 'https://shopeasyapi.onrender.com/api';

const CURRENT_KEY = 'ecom_current_user';
const TOKEN_KEY = 'ecom_token';

// Helpers para manejo de Token
function saveToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function loadToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }) {
  // Estado del token
  const [token, setToken] = useState(loadToken());

  // Estado del usuario actual (Sesión)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem(CURRENT_KEY));
      // Si hay usuario guardado, le adjuntamos el token actual por seguridad
      return user ? { ...user, token: loadToken() } : null;
    } catch { return null; }
  });

  //Persistir Sesión
  useEffect(() => {
    saveToken(token);

    if (currentUser) {
      const userToSave = {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        address: currentUser.address,
        requirePasswordChange: currentUser.requirePasswordChange
      };
      localStorage.setItem(CURRENT_KEY, JSON.stringify(userToSave));
    } else {
      localStorage.removeItem(CURRENT_KEY);
    }
  }, [currentUser, token]);

  // ====================================================================
  // Metodo Register
  // ====================================================================
  const register = async ({ name, email, password }) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          message: data.message || data.errors?.[0]?.msg || 'Error al registrar usuario.'
        };
      }

      setToken(data.token);
      const newUser = { ...data.user, token: data.token };
      setCurrentUser(newUser);

      return { ok: true };

    } catch (error) {
      console.error("Error de red durante el registro:", error);
      return { ok: false, message: 'Error de conexión con el servidor.' };
    }
  };

  // ====================================================================
  // Metodo Login
  // ====================================================================
  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          message: data.message || 'Email o contraseña inválidos.'
        };
      }

      setToken(data.token);
      const loggedInUser = { ...data.user, token: data.token };
      setCurrentUser(loggedInUser);

      return { ok: true, role: loggedInUser.role };

    } catch (error) {
      console.error("Error de red durante el inicio de sesión:", error);
      return { ok: false, message: 'Error de conexión con el servidor.' };
    }
  };

  // ====================================================================
  // Metodo Update Profile
  // ====================================================================
  const updateProfile = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { ok: false, message: data.message || 'Error al actualizar los datos' };
      }

      const updatedUser = { ...data, token: token };
      setCurrentUser(updatedUser);
      return { ok: true };

    } catch (error) {
      console.error("Error de update:", error);
      return { ok: false, message: 'Error de conexión' };
    }
  };

  // ====================================================================
  // Metodo Logout
  // ====================================================================
  const logout = () => {
    localStorage.removeItem(CURRENT_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
    setToken(null);
  };

  // ====================================================================
  // Metodo Delete Account
  // ====================================================================
  const deleteAccount = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        logout();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error de red al eliminar cuenta:", error);
      return false;
    }
  };

  return (
      <AuthContext.Provider value={{
        currentUser,
        token,
        register,
        login,
        updateProfile,
        logout,
        deleteAccount
      }}>
        {children}
      </AuthContext.Provider>
  );
}