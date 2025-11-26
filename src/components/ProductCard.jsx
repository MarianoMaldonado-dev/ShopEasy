import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { DataContext } from '../contexts/DataContext'

export default function ProductCard({ p, currentUser, onDelete }) {
    const { addToCart, cartProducts } = useContext(DataContext)
    const productId = p._id || p.id;
    const inCart = cartProducts.find(prod => prod.id === productId)

    const isAdmin = currentUser?.role === 'admin';
    // Verificación de autor del artículo publicado.
    const isOwner = currentUser && (
        (p.owner?._id === currentUser.id) ||
        (p.owner === currentUser.id)
    );
    // Si es Admin o si es el autor de la publicación puede borrar el artículo publicado.
    const canDelete = isAdmin || isOwner;

    return (
        <article className="card">
            {p.ownerId && <div style={{fontSize:12,fontWeight:700,color:'#444'}}>Artículos recientes</div>}
            <img src={p.image} alt={p.title}/>
            <h3>{p.title}</h3>
            <p className="price">${(p.price||0).toFixed(2)}</p>
            <p>{p.description?.slice(0,100)}</p>
            <div className="card-actions">
                <Link to={`/products/${productId}`} className="button">Ver</Link>
                {!isAdmin && (
                    <button
                        className="button"
                        onClick={() => addToCart(p)}
                    >
                        {inCart ? `Agregar otro (${inCart.qty})` : 'Agregar al carrito'}
                    </button>
                )}
                {canDelete && (
                    <button
                        className="button delete-btn-inline"
                        onClick={onDelete}
                    >
                        Eliminar publicación
                    </button>
                )}
            </div>
        </article>
    )
}