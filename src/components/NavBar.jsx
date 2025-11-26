import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function NavBar({ theme, setTheme, cartCount, onShowCart }) {
  const { currentUser, logout } = useContext(AuthContext)
  const nav = useNavigate()

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('ecom_theme', next)
    document.documentElement.setAttribute('data-theme', next === 'dark' ? 'dark' : 'light')
  }

  const handleLogout = () => {
    logout();
    nav('/');
  }

  return (
      <header className="app-header">
        <div className="logo">
          <img src="src/assets/shopeasy_logo.jpg" alt="Logo ShopEasy" className="logo-img" />
          <Link to="/">ShopEasy</Link>
        </div>
        <nav className="nav">
          <Link to="/">Inicio</Link>
          <Link to="/categories">Categorias</Link>

          {/* Botón de carrito */}
            {currentUser && currentUser?.role !== 'admin' && (
                <button className="button" onClick={onShowCart}>
                    Ver 🛒 {cartCount > 0 ? `(${cartCount})` : ""}
                </button>
            )}

          {/* Menú de Usuario */}
          {currentUser ? (
              <>
                <Link to="/profile">Hola, {currentUser?.name}</Link>
                <button onClick={handleLogout}>Cerrar sesión</button>
              </>
          ) : (
              <>
                <Link to="/login">Iniciar sesión</Link>
                <Link to="/register">Registro</Link>
              </>
          )}

          <Link to="/contact">Contacto</Link>
          <button onClick={toggle} title="Toggle theme">{theme==='dark' ? 'Modo oscuro 🌙' : 'Modo claro 🌞'}</button>
        </nav>
      </header>
  )
}