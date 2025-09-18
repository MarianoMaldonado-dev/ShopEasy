import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({p}) {
  return (
    <article className="card">
      {p.ownerId && <div style={{fontSize:12,fontWeight:700,color:'#444'}}>Artículos recientes</div>}
      <img src={p.image} alt={p.title}/>
      <h3>{p.title}</h3>
      <p className="price">${(p.price||0).toFixed(2)}</p>
      <p>{p.description?.slice(0,100)}</p>
      <Link to={`/products/${p.id}`} className="button">Ver</Link>
    </article>
  )
}
