import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function NavBar({ theme, setTheme }) {
  const { currentUser, logout } = useContext(AuthContext)
  const nav = useNavigate()
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('ecom_theme', next)
    document.documentElement.setAttribute('data-theme', next === 'dark' ? 'dark' : 'light')
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
        {currentUser && <Link to="/cart">Carrito de compras</Link>}
        {currentUser ? <>
          <Link to="/profile">Hola, {currentUser.name}</Link>
          <button onClick={() => { logout(); nav('/') }}>Cerrar sesión</button>
          {currentUser.role === 'admin' && <Link to="/admin">Admin</Link>}
        </> : <>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Registro</Link>
        </>}
          <Link to="/contact">Contacto</Link>
        <button onClick={toggle} title="Toggle theme">{theme==='dark' ? 'Modo oscuro 🌙' : 'Modo claro 🌞'}</button>
        <Link to="/developers">Desarrolladores</Link>
      </nav>
    </header>
  )
}
