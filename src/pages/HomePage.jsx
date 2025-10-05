import React, { useEffect, useState, useContext } from 'react'
import ProductCard from '../components/ProductCard'
import { DataContext } from '../contexts/DataContext'
import { AuthContext } from '../contexts/AuthContext'
//import { Link } from 'react-router-dom'
import CreateProductModal from '../components/CreateProductModal'
import CartModal from '../components/CartModal'

export default function HomePage(){
  const [products, setProducts] = useState([])
  const { userProducts, addUserProduct, deleteUserProduct, cartProducts, removeFromCart, emptyCart } = useContext(DataContext)
  const { currentUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)
  const [search, setSearch] = useState('');

  useEffect(()=> {
    fetch('https://fakestoreapi.com/products')
      .then(r=>r.json())
      .then(data=>{
        setProducts(data)
        setLoading(false)
      })
      .catch(()=> setLoading(false))
  }, [])

const all = [...userProducts, ...products]
const filteredProducts = all.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );
return (
 <div>
     <form className="searchForm" onSubmit={e => e.preventDefault()}>
         <input
             className="search"
             type="text"
             placeholder="Búsqueda"
             value={search}
             onChange={e => setSearch(e.target.value)}
         />
         <button className="seek" type="submit">🔍</button>
     </form>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
     <h1>Productos</h1>
     <div>
       {currentUser && (
           <>
             <button className="button" onClick={()=>setShowModal(true)}>Publicar un artículo</button>
           </>
       )}
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
   {showModal && (
       <CreateProductModal
           currentUser={currentUser}
           addUserProduct={addUserProduct}
           onClose={()=>setShowModal(false)}
       />
   )}
     {showCartModal && (
         <CartModal
             currentUser={currentUser}
             cartProducts={cartProducts}
             removeFromCart={removeFromCart}
             emptyCart={emptyCart}
             onClose={() => setShowCartModal(false)}
         />
     )}
 </div>
)
}