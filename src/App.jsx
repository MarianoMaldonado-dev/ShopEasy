import React, { useEffect, useState, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import ContactForm from './components/ContactForm'
import NavBar from './components/NavBar'
import './styles.css'
import githubIcon from './assets/github-mark-white.png'
import { FaLinkedin } from 'react-icons/fa'

export default function App(){
  const [theme, setTheme] = useState(()=> localStorage.getItem('ecom_theme') || 'light')

  useEffect(()=> {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
  },[theme])

  return (
    <div className="app">
      <NavBar theme={theme} setTheme={setTheme}/>
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/products/:id" element={<ProductPage/>}/>
          <Route path="/cart" element={<CartPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/admin" element={<AdminPage/>}/>
          <Route path="/contact" element={<ContactForm/>}/>
        </Routes>
      </main>
      <footer className="site-footer">
        <p className="copyright">&copy; Copyright &#124; ShopEasy &#124; {new Date().getFullYear()}</p>
        <p className="developBy">Desarrollado por &#123; 🔥PHOENIX&#60;🐦‍🔥&#62;CODE🔥 &#125; Soluciones
          Informáticas &#124; Mariano Maldonado</p>
        <div className="social">

          <div className="boxSocial">
            <div className="githubIcon">
              <section className="bckgrKatze">
                <a className="perfil" href="https://github.com/MarianoMaldonado-dev"><img className="katze" src={githubIcon} alt="GitHub"/></a>
              </section>
            </div>
          </div>

          <a
              className="social-link linkedin"
              href="https://www.linkedin.com/in/mariano-maldonado-810847288"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
          >
            <FaLinkedin className="social-icon" />
          </a>
        </div>
      </footer>
    </div>
)}

