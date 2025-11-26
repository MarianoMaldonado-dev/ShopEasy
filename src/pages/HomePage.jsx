import React, { useEffect, useState, useContext } from 'react'
import ProductCard from '../components/ProductCard'
import { DataContext } from '../contexts/DataContext'
import { AuthContext } from '../contexts/AuthContext'
import CreateProductModal from '../components/CreateProductModal'
import CartModal from '../components/CartModal'

const API_URL = 'https://shopeasyapi.onrender.com/api';
const PRODUCTS_PER_PAGE = 6;

export default function HomePage(){
    const [products, setProducts] = useState([])
    const { addUserProduct, deleteUserProduct, cartProducts, removeFromCart, emptyCart } = useContext(DataContext)
    const { currentUser } = useContext(AuthContext)

    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showCartModal, setShowCartModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(null) // Guarda ID para borrar

    const [searchTerm, setSearchTerm] = useState('');
    const [executedSearch, setExecutedSearch] = useState('');

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [toastMessage, setToastMessage] = useState({ msg: '', type: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/products?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`;
            if (executedSearch) url += `&search=${encodeURIComponent(executedSearch)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar');
            const data = await response.json();
            setProducts(data.products || []);
            setTotalPages(data.pages);
        } catch (error) {
            console.error(error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=> { fetchProducts(); }, [refreshTrigger, currentPage, executedSearch])

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        setExecutedSearch(searchTerm);
    };

    // Abre el modal
    const requestDelete = (productId) => {
        setConfirmModal(productId);
    }

    // Ejecuta el borrado real
    const executeDelete = async () => {
        const productId = confirmModal;
        setConfirmModal(null);

        if (!currentUser?.token) {
            setToastMessage({ msg: '❌ Error: No hay sesión activa.', type: 'error' });
            return;
        }

        const success = await deleteUserProduct(productId, currentUser.token);

        if (success) {
            setToastMessage({ msg: '✅ Producto eliminado.', type: 'success' });
            setRefreshTrigger(prev => prev + 1);
        } else {
            setToastMessage({ msg: '❌ Error al eliminar.', type: 'error' });
        }
        setTimeout(() => setToastMessage({ msg: '', type: '' }), 4000);
    }

    return (
        <div>
            <form className="searchForm" onSubmit={handleSearchSubmit}>
                <input className="search" type="text" placeholder="Búsqueda" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <button className="seek" type="submit">🔍</button>
            </form>

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h1>Productos</h1>
                {currentUser && <button className="button" onClick={()=>setShowModal(true)}>Publicar un artículo</button>}
            </div>

            {loading ? <p>Cargando...</p> : (
                <div className="grid">
                    {products.map(p=>(
                        <div key={p._id || p.id} style={{position:'relative'}}>
                            <ProductCard
                                p={p}
                                currentUser={currentUser}
                                onDelete={() => requestDelete(p._id || p.id)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination-controls" style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem'}}>
                    <button className="button" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button className="button" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Siguiente</button>
                </div>
            )}

            {showModal && <CreateProductModal currentUser={currentUser} addUserProduct={addUserProduct} onClose={() => { setShowModal(false); setRefreshTrigger(p=>p+1); }} />}
            {showCartModal && <CartModal currentUser={currentUser} cartProducts={cartProducts} removeFromCart={removeFromCart} emptyCart={emptyCart} onClose={() => setShowCartModal(false)} />}

            {/* Modal Confirmación Borrado */}
            {confirmModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2 style={{color: '#dc3545'}}>Eliminar Publicación</h2>
                        <p>¿Estás seguro de que deseas eliminar esta publicación permanentemente?</p>
                        <div className="modal-actions">
                            <button className="button" style={{backgroundColor: '#dc3545', borderColor: '#dc3545', color: 'white'}} onClick={executeDelete}>Sí, eliminar</button>
                            <button className="button" type="button" onClick={() => setConfirmModal(null)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {toastMessage.msg && <div className={`toast ${toastMessage.type === 'error' ? 'error' : 'success'}`}>{toastMessage.msg}</div>}
        </div>
    )
}