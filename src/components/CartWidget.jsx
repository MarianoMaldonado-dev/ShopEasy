import React from 'react'
import { Link } from 'react-router-dom'

export default function CartWidget({count}) {
  return <Link to="/cart" className="button">Carrito ({count})</Link>
}
