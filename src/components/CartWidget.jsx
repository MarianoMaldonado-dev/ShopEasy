import React from 'react'

export default function CartWidget({ count, onClick }) {
  return (
      <button className="button" onClick={onClick}>
        Carrito ({count})
      </button>
  );
}