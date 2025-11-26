import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = 'https://shopeasyapi.onrender.com/api';
const PRODUCTS_PER_PAGE = 50;

export default function CategoryDetailPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                const url = `${API_URL}/products?limit=${PRODUCTS_PER_PAGE}&search=${categoryId}`;
                const response = await fetch(url);
                if (!response.ok) throw new Error('Error al cargar productos de la categoría');
                const data = await response.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error('Error al cargar productos por categoría:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, [categoryId]);

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="container">
            <h2>Productos en {categoryId}</h2>
            <div className="grid">
                {products.map(p => (
                    <div key={p._id || p.id} className="card">
                        <img src={p.image} alt={p.title} />
                        <h3>{p.title}</h3>
                        <p className="price">${(p.price || 0).toFixed(2)}</p>
                        <Link to={`/products/${p._id || p.id}`} className="button">Ver</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
