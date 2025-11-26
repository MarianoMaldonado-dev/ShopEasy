import React, { useEffect, useState, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import ContactForm from './components/ContactForm'
import NotFoundPage from './pages/NotFoundPage'
import Developers from './pages/Developers';
import NavBar from './components/NavBar'
import './styles.css'
import CategoriesPage from './pages/CategoriesPage'
import CategoryDetailPage from './pages/CategoryDetailPage'
import CartModal from './components/CartModal'
import { DataContext } from './contexts/DataContext'
import { AuthContext } from './contexts/AuthContext'

export default function App(){
  const [theme, setTheme] = useState(()=> localStorage.getItem('ecom_theme') || 'light')
  const [showCartModal, setShowCartModal] = useState(false)
  const { cartProducts, removeFromCart, emptyCart } = useContext(DataContext)
  const { currentUser } = useContext(AuthContext)

  useEffect(()=> {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
  },[theme])

  return (
    <div className="app">
      <NavBar
      theme={theme}
      setTheme={setTheme}
      cartCount={cartProducts.length}
      onShowCart={() => setShowCartModal(true)}
      />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/products/:id" element={<ProductPage/>}/>
          <Route path="/categories" element={<CategoriesPage/>}/>
          <Route path="/categories/:categoryId" element={<CategoryDetailPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/admin" element={<AdminPage/>}/>
          <Route path="/contact" element={<ContactForm/>}/>
          <Route path="/developers" element={<Developers />} />
          <Route path="/404" element={<NotFoundPage/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
      </main>
      {showCartModal && (
          <CartModal
              currentUser={currentUser}
              cartProducts={cartProducts}
              removeFromCart={removeFromCart}
              emptyCart={emptyCart}
              onClose={() => setShowCartModal(false)}
          />
      )}
      <footer className="site-footer">
        <p className="copyright">&copy; Copyright &#124; ShopEasy &#124; {new Date().getFullYear()}</p>
        <p className="developBy">Desarrollado por &#123; 🔥PHOENIX&#60;🐦‍🔥&#62;CODE🔥 &#125; Soluciones
          Informáticas &#124; Mariano Maldonado</p>
        <div className="footer-link">
          <a
              className="developers-btn"
              href="/developers"
              aria-label="Desarrolladores"
          >
            Conozca al equipo de desarrollo
          </a>
        </div>
      </footer>
    </div>
)}

