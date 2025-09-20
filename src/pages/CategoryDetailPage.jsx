import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function CategoryDetailPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryMap = {
    "electronics": "electronica",
    "jewelery": "accesorios",
    "men's clothing": "indumentaria",
    "women's clothing": "indumentaria"
  };

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(p => ({
          ...p,
          category: categoryMap[p.category] || p.category
        }));

        setProducts(mapped.filter(p => p.category === categoryId));
        setLoading(false);
      });
  }, [categoryId]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="container">
      <h2>Productos en {categoryId}</h2>
      <div className="grid">
        {products.map(p => (
          <div key={p.id} className="card">
            <img src={p.image} alt={p.title} />
            <h3>{p.title}</h3>
            <p className="price">${p.price}</p>
            <Link to={`/products/${p.id}`} className="button">Ver</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
