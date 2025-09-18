import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const USERS_KEY = 'ecom_users';
const CURRENT_KEY = 'ecom_current_user';

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers());
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_KEY));
    } catch { return null; }
  });

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    if (currentUser) localStorage.setItem(CURRENT_KEY, JSON.stringify(currentUser));
    else localStorage.removeItem(CURRENT_KEY);
  }, [currentUser]);

  const register = ({ name, email, password }) => {
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { ok: false, message: 'Error. El email ya se encuentra registrado.' };
    const role = email.trim().toLowerCase().endsWith('@admin.com') ? 'admin' : 'user';
    const newUser = { id: Date.now().toString(), name, email, password, role };
    const next = [...users, newUser];
    setUsers(next);
    setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
    return { ok: true };
  };

  const login = ({ email, password }) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { ok: false, message: 'Error. El usuario o la contraseña es incorrecta, intente nuevamente.' };
    setCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role });
    return { ok: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const deleteAccount = (userId) => {
    const next = users.filter(u => u.id !== userId);
    setUsers(next);
    if (currentUser && currentUser.id === userId) setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ users, currentUser, register, login, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}
