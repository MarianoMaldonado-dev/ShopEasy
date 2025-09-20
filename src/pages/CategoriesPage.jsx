import React from "react";
import { Link } from "react-router-dom"; 
import Electronica from "../assets/electronica.png";
import Indumentaria from "../assets/indumentaria.png";
import Accesorios from "../assets/accesorios.png";

const categories = [
  { 
    id: "electronica", 
    name: "Electrónica", 
    description: "Teléfonos, computadoras, accesorios electrónicos", 
    image: Electronica
  },
  { 
    id: "indumentaria", 
    name: "Indumentaria", 
    description: "Remeras, camperas, pantalones y más", 
    image: Indumentaria
  },
  { 
    id: "accesorios", 
    name: "Accesorios", 
    description: "Relojes, mochilas, joyas", 
    image: Accesorios
  },
];

export default function CategoriesPage() {
  return (
    <div className="container">
      <h2>Categorías</h2>
      <div className="grid">
        {categories.map((cat) => (
          <Link 
            to={`/categories/${cat.id}`} 
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              style={{width: "100%", height: "200px", objectFit: "contain", marginBottom: "10px"}} 
            />
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
