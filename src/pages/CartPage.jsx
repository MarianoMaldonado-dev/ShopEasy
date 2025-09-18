import React, { useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const CART_KEY = 'ecom_cart'

function load() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') } catch { return [] }
}
function save(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)) }

export default function CartPage(){
  const { currentUser } = useContext(AuthContext)
  const nav = useNavigate()
  const [cart, setCart] = useState(load())

  useEffect(() => {
    if (!currentUser) nav("/login")
  }, [currentUser, nav])

  useEffect(()=> save(cart), [cart])

  const remove = (id) => setCart(prev => prev.filter(x => x.id !== id))
  const empty = () => setCart([])

  const total = cart.reduce((s,i)=> s + (i.price||0)*i.qty, 0)

  return (
    <div>
      <h1>Mi carrito de compras</h1>
      {cart.length===0 ? <p>¡Aún no has agregado nada!</p> : (
        <>
          <ul>
            {cart.map(i=>(
              <li key={i.id}>
                {i.title} - ${i.price} x {i.qty}
                <button className="button" onClick={()=> remove(i.id)}>Eliminar del carrito</button>
              </li>
            ))}
          </ul>
          <p>Total: ${total.toFixed(2)}</p>
          <button className="button" onClick={empty}>Vaciar mi carrito</button>
        </>
      )}
      <p>Nota: Esta demostración almacena el carrito únicamente en localStorage. Éste mensaje se visualiza por modo desarrollo.</p>
    </div>
  )
}
