import React, { useEffect, useState, useContext } from 'react'
import ProductCard from '../components/ProductCard'
import { DataContext } from '../contexts/DataContext'
import { AuthContext } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function HomePage(){
  const [products, setProducts] = useState([])
  const { userProducts, addUserProduct, deleteUserProduct } = useContext(DataContext)
  const { currentUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)

  useEffect(()=> {
    fetch('https://fakestoreapi.com/products')
      .then(r=>r.json())
      .then(data=>{
        setProducts(data)
        setLoading(false)
      })
      .catch(()=> setLoading(false))
  }, [])

  const createSample = () => {
    if (!currentUser) { alert('Debes identificarte antes de publicar un artículo'); return }
    const title = prompt('Título del producto')
    if (!title) return
    const priceStr = prompt('Precio', '9.99')
    const price = parseFloat(priceStr||'9.99') || 9.99
    const description = prompt('Descripción','¡Vender en ShopEasy es genial!')
    const image = prompt('Imagen URL (optional)','https://via.placeholder.com/300')
    const p = { title, price, description, image, ownerId: currentUser.id }
    addUserProduct(p)
  }

  const all = [...userProducts, ...products]

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>Productos</h1>
        <div>
          {currentUser && <button className="button" onClick={createSample}>Publicar un artículo</button>}
        </div>
      </div>
      {loading ? <p>Cargando...</p> : (
        <div className="grid">
          {all.map(p=>(
            <div key={p.id} style={{position:'relative'}}>
              <ProductCard p={p}/>
              {p.ownerId && currentUser && (currentUser.role === 'admin' || currentUser.id === p.ownerId) && (
                <div style={{position:'absolute', top:8, right:8}}>
                  <button className="button" onClick={()=> { if (confirm('¿Desea borrar la publicación?')) deleteUserProduct(p.id, currentUser) }}>Eliminar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
