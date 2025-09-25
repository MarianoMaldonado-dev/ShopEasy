import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { DataContext } from '../contexts/DataContext'

export default function ProductCard({p}) {
    const { addToCart, cartProducts } = useContext(DataContext)
    const inCart = cartProducts.find(prod => prod.id === p.id)
    return (
        <article className="card">
            {p.ownerId && <div style={{fontSize:12,fontWeight:700,color:'#444'}}>Artículos recientes</div>}
            <img src={p.image} alt={p.title}/>
            <h3>{p.title}</h3>
            <p className="price">${(p.price||0).toFixed(2)}</p>
            <p>{p.description?.slice(0,100)}</p>
            <Link to={`/products/${p.id}`} className="button">Ver</Link>
            <button
                className="button"
                style={{marginLeft: '0.5rem'}}
                onClick={() => addToCart(p)}
            >
                {inCart ? `Agregar otro (${inCart.qty})` : 'Agregar al carrito'}
            </button>
        </article>
    )
}