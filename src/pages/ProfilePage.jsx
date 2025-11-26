import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://shopeasyapi.onrender.com/api';

export default function ProfilePage() {
    const { currentUser, updateProfile, deleteAccount } = useContext(AuthContext);
    const { deleteUserProduct, updateUserProduct } = useContext(DataContext);
    const nav = useNavigate();

    // Modales de Vistas
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPurchasesModal, setShowPurchasesModal] = useState(false);
    const [showMyProductsModal, setShowMyProductsModal] = useState(false);
    const [showProductEditModal, setShowProductEditModal] = useState(false);
    const [showForcePassModal, setShowForcePassModal] = useState(false);

    // Estados de UX (Notificaciones y Confirmaciones)
    const [toastMessage, setToastMessage] = useState({ msg: '', type: '' });
    const [confirmModal, setConfirmModal] = useState(null); // { title, message, action }

    // Datos
    const [myPurchases, setMyPurchases] = useState([]);
    const [myProducts, setMyProducts] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    // Formularios
    const [editForm, setEditForm] = useState({ name: '', email: '', address: '', password: '' });
    const [productForm, setProductForm] = useState({ id: '', title: '', price: '', category: '', description: '', image: '' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (currentUser?.requirePasswordChange) {
            setShowForcePassModal(true);
        }
    }, [currentUser]);

    const fetchPurchases = async () => {
        setLoadingData(true);
        try {
            const res = await fetch(`${API_URL}/purchases`, {
                headers: { 'Authorization': `Bearer ${currentUser.token}` }
            });
            const data = await res.json();
            if (res.ok) setMyPurchases(data.purchases || []);
        } catch (err) { console.error(err); } finally { setLoadingData(false); }
    };

    const fetchMyProducts = async () => {
        setLoadingData(true);
        try {
            const res = await fetch(`${API_URL}/products?limit=100`);
            const data = await res.json();
            if (res.ok) {
                const all = data.products || [];
                const filtered = all.filter(p => {
                    if (!p.owner) return false;
                    const ownerId = typeof p.owner === 'object' ? p.owner._id : p.owner;
                    return String(ownerId) === String(currentUser.id);
                });
                setMyProducts(filtered);
            }
        } catch (err) { console.error(err); } finally { setLoadingData(false); }
    };

    // --- HANDLERS PRODUCTOS ---

    const handleStartEditProduct = (product) => {
        setProductForm({
            id: product._id || product.id,
            title: product.title,
            price: product.price,
            category: product.category,
            description: product.description,
            image: product.image
        });
        setShowMyProductsModal(false);
        setShowProductEditModal(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const updated = await updateUserProduct(productForm.id, {
            title: productForm.title,
            price: parseFloat(productForm.price),
            category: productForm.category,
            description: productForm.description,
            image: productForm.image
        }, currentUser.token);

        if (updated) {
            setToastMessage({ msg: '✅ Producto actualizado correctamente', type: 'success' });
            setShowProductEditModal(false);
            setShowMyProductsModal(true);
            fetchMyProducts();
        } else {
            setToastMessage({ msg: '❌ Error al actualizar el producto', type: 'error' });
        }
        setTimeout(() => setToastMessage({ msg: '', type: '' }), 4000);
    };

    const requestDeleteProduct = (productId) => {
        setConfirmModal({
            title: 'Eliminar Publicación',
            message: '¿Estás seguro de eliminar esta publicación permanentemente?',
            action: () => executeDeleteProduct(productId)
        });
    };

    const executeDeleteProduct = async (productId) => {
        setConfirmModal(null);
        const success = await deleteUserProduct(productId, currentUser.token);
        if (success) {
            setMyProducts(prev => prev.filter(p => (p._id || p.id) !== productId));
            setToastMessage({ msg: '✅ Producto eliminado', type: 'success' });
        } else {
            setToastMessage({ msg: '❌ Error al eliminar el producto', type: 'error' });
        }
        setTimeout(() => setToastMessage({ msg: '', type: '' }), 4000);
    };

    // --- HANDLERS PERFIL ---

    const handleEditClick = () => {
        setEditForm({
            name: currentUser.name,
            email: currentUser.email,
            address: currentUser.address || '',
            password: ''
        });
        setMsg('');
        setShowEditModal(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const res = await updateProfile(editForm);
        if (res.ok) {
            setMsg('✅ Sus datos se actualizaron correctamente');
            setTimeout(() => {
                setShowEditModal(false);
                setShowForcePassModal(false);
            }, 1500);
        } else {
            setMsg(`❌ Error: ${res.message}`);
        }
    };

    const requestDeleteAccount = () => {
        setConfirmModal({
            title: 'Eliminar Cuenta',
            message: 'ATENCIÓN: ¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.',
            action: executeDeleteAccount
        });
    };

    const executeDeleteAccount = () => {
        setConfirmModal(null);
        deleteAccount(currentUser.id);
        nav('/');
    };

    if (!currentUser) return <div className="container">Por favor, inicia sesión.</div>;

    return (
        <div className="container">
            <h1>Mi Perfil</h1>

            <div className="card" style={{maxWidth: '600px', margin: '0 auto', textAlign:'left'}}>
                <p><strong>Nombre:</strong> {currentUser.name}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Dirección de envío:</strong> {currentUser.address || 'No definida'}</p>
                <p><strong>Rol:</strong> {currentUser.role === 'admin' ? 'Administrador' : 'Usuario'}</p>

                <hr style={{margin:'1rem 0', borderColor:'#eee'}}/>

                <div style={{display:'grid', gap:'10px'}}>
                    <button className="button" onClick={handleEditClick}>Editar mis datos / Cambiar contraseña</button>

                    {currentUser.role === 'admin' ? (
                        <button className="button" style={{borderColor: '#4a9eff'}} onClick={() => nav('/admin')}>
                            Ir al Panel de Administración
                        </button>
                    ) : (
                        <>
                            <button className="button" onClick={() => { setShowPurchasesModal(true); fetchPurchases(); }}>
                                Ver Historial de Compras
                            </button>
                            <button className="button" onClick={() => { setShowMyProductsModal(true); fetchMyProducts(); }}>
                                Gestionar Mis Publicaciones
                            </button>
                        </>
                    )}
                    <button className="button" style={{borderColor:'red', color:'red'}} onClick={requestDeleteAccount}>Eliminar Cuenta</button>
                </div>
            </div>

            {/* Modal Editar Perfil */}
            {(showEditModal || showForcePassModal) && (
                <div className="modal-backdrop">
                    <div className="modal">
                        {showForcePassModal && <h3 style={{color:'red'}}>⚠️ Cambio de contraseña obligatorio</h3>}
                        <h2>{showForcePassModal ? 'Define tu nueva contraseña' : 'Editar Datos'}</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <label>Nombre <input value={editForm.name} onChange={e=>setEditForm({...editForm, name:e.target.value})} required /></label>
                            <label>Email <input type="email" value={editForm.email} onChange={e=>setEditForm({...editForm, email:e.target.value})} required /></label>
                            <label>Dirección <input value={editForm.address} onChange={e=>setEditForm({...editForm, address:e.target.value})} /></label>
                            <label>Nueva Contraseña <input type="password" value={editForm.password} onChange={e=>setEditForm({...editForm, password:e.target.value})} required={showForcePassModal} /></label>
                            {msg && <p className="success">{msg}</p>}
                            <div className="modal-actions">
                                <button className="button" type="submit">Guardar Cambios</button>
                                {!showForcePassModal && <button className="button" type="button" onClick={() => setShowEditModal(false)}>Cancelar</button>}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Compras */}
            {showPurchasesModal && (
                <div className="modal-backdrop">
                    <div className="modal" style={{maxWidth:'600px', maxHeight:'80vh', overflowY:'auto'}}>
                        <h2>Mis Compras</h2>
                        {loadingData ? <p>Cargando...</p> : (
                            myPurchases.length === 0 ? <p>No has realizado compras aún.</p> : (
                                <ul style={{listStyle:'none', padding:0}}>
                                    {myPurchases.map(purchase => (
                                        <li key={purchase._id} style={{borderBottom:'1px solid #444', padding:'10px 0'}}>
                                            <strong>Fecha:</strong> {new Date(purchase.createdAt).toLocaleDateString()} <br/>
                                            <strong>Total:</strong> ${purchase.totalAmount.toFixed(2)} <br/>
                                            <strong>Envío a:</strong> {purchase.shippingAddress}
                                        </li>
                                    ))}
                                </ul>
                            )
                        )}
                        <div className="modal-actions"><button className="button" onClick={() => setShowPurchasesModal(false)}>Cerrar</button></div>
                    </div>
                </div>
            )}

            {/* Modal Mis Publicaciones */}
            {showMyProductsModal && (
                <div className="modal-backdrop">
                    <div className="modal" style={{maxWidth:'700px', maxHeight:'80vh', overflowY:'auto'}}>
                        <h2>Mis Publicaciones</h2>
                        {loadingData ? <p>Cargando...</p> : (
                            myProducts.length === 0 ? <p>No tienes productos en venta.</p> : (
                                <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'10px'}}>
                                    {myProducts.map(p => (
                                        <div key={p._id || p.id} style={{border:'1px solid #444', padding:10, borderRadius:8, textAlign:'center'}}>
                                            <img src={p.image} alt="" style={{width:'100%', height:'120px', objectFit:'cover', borderRadius:'4px'}}/>
                                            <h4 style={{fontSize:'0.9rem', margin:'5px 0'}}>{p.title}</h4>
                                            <p style={{fontSize:'0.9rem', fontWeight:'bold'}}>${p.price}</p>

                                            <div style={{display:'flex', gap:'5px', marginTop:'10px'}}>
                                                <button
                                                    className="button"
                                                    style={{flex:1, fontSize:'0.8rem', padding:'5px', borderColor:'#4a9eff', color:'white'}}
                                                    onClick={() => handleStartEditProduct(p)}
                                                >
                                                    Modificar
                                                </button>

                                                <button
                                                    className="button"
                                                    style={{flex:1, fontSize:'0.8rem', padding:'5px', backgroundColor:'#d32f2f', borderColor:'#d32f2f', color:'white'}}
                                                    onClick={() => requestDeleteProduct(p._id || p.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                        <div className="modal-actions">
                            <button className="button" onClick={() => setShowMyProductsModal(false)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Editar Producto */}
            {showProductEditModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2>Editar Producto</h2>
                        <form onSubmit={handleSaveProduct}>
                            <label>Título
                                <input value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} required />
                            </label>
                            <label>Precio
                                <input type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required />
                            </label>
                            <label>Categoría
                                <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} required>
                                    <option value="electronica">Electrónica</option>
                                    <option value="indumentaria">Indumentaria</option>
                                    <option value="accesorios">Accesorios</option>
                                    <option value="misc">Otros</option>
                                </select>
                            </label>
                            <label>Descripción
                                <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                            </label>
                            <label>Imagen URL
                                <input value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} />
                            </label>

                            <div className="modal-actions">
                                <button className="button" type="submit">Guardar Cambios</button>
                                <button className="button" type="button" onClick={() => {
                                    setShowProductEditModal(false);
                                    setShowMyProductsModal(true);
                                }}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN GENÉRICO */}
            {confirmModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2 style={{color: '#dc3545'}}>{confirmModal.title}</h2>
                        <p>{confirmModal.message}</p>
                        <div className="modal-actions">
                            <button
                                className="button"
                                style={{backgroundColor: '#dc3545', borderColor: '#dc3545', color: 'white'}}
                                onClick={confirmModal.action}
                            >
                                Confirmar
                            </button>
                            <button
                                className="button"
                                type="button"
                                onClick={() => setConfirmModal(null)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toastMessage.msg && (
                <div className={`toast ${toastMessage.type === 'error' ? 'error' : 'success'}`}>
                    {toastMessage.msg}
                </div>
            )}
        </div>
    );
}