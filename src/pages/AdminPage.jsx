import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://shopeasyapi.onrender.com/api';

export default function AdminPage() {
    const { currentUser } = useContext(AuthContext);
    const { deleteUserProduct } = useContext(DataContext);
    const nav = useNavigate();

    const [allProducts, setAllProducts] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [refresh, setRefresh] = useState(0);

    const [toastMessage, setToastMessage] = useState({ msg: '', type: '' });
    const [confirmModal, setConfirmModal] = useState(null);

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            nav('/404');
        }
    }, [currentUser, nav]);

    // Si no hay usuario válido, no renderizar nada para evitar crash
    if (!currentUser || currentUser.role !== 'admin') return null;

    useEffect(() => {
        fetch(`${API_URL}/products?limit=100`)
            .then(res => res.json())
            .then(data => setAllProducts(data.products || []));

        if (currentUser?.token) {
            fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${currentUser.token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setUsersList(data);
                })
                .catch(err => console.error(err));
        }
    }, [refresh, currentUser]);

    // --- Handlers ---
    const handleAction = (id, type) => {
        const message = type === 'user'
            ? '¿Estás seguro de eliminar este usuario permanentemente?'
            : '¿Confirmas la eliminación de esta publicación?';

        setConfirmModal({
            message,
            id,
            action: type === 'user' ? executeDeleteUser : executeDeleteProduct,
        });
    };

    const executeDeleteUser = async (userId) => {
        setConfirmModal(null);
        try {
            const res = await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${currentUser.token}` }
            });

            if (res.ok) {
                setToastMessage({ msg: 'Usuario eliminado correctamente.', type: 'success' });
                setRefresh(prev => prev + 1);
            } else {
                const errorData = await res.json();
                setToastMessage({ msg: `Error: ${errorData.message}`, type: 'error' });
            }
        } catch (error) {
            setToastMessage({ msg: 'Error de conexión.', type: 'error' });
        }
        setTimeout(() => setToastMessage({ msg: '', type: '' }), 5000);
    };

    const executeDeleteProduct = async (productId) => {
        setConfirmModal(null);
        const success = await deleteUserProduct(productId, currentUser.token);

        if (success) {
            setToastMessage({ msg: 'Producto eliminado correctamente.', type: 'success' });
            setRefresh(prev => prev + 1);
        } else {
            setToastMessage({ msg: 'Error al eliminar producto.', type: 'error' });
        }
        setTimeout(() => setToastMessage({ msg: '', type: '' }), 5000);
    };

    const handleDeleteProduct = (productId) => handleAction(productId, 'product');
    const handleDeleteUser = (userId) => handleAction(userId, 'user');

    return (
        <div className="container">
            <h1>Dashboard de administradores</h1>
            <p>Bienvenido, {currentUser.name}</p>
            <div style={{ marginTop: '2rem' }}>
                <button className="button" onClick={() => nav('/profile')}>Volver al Perfil</button>
            </div>

            <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
                <section className="card" style={{ maxWidth: '100%', textAlign: 'left' }}>
                    <h2>Usuarios Registrados ({usersList.length})</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth:'600px' }}>
                            <thead>
                            <tr style={{ borderBottom: '2px solid #444', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Nombre</th>
                                <th style={{ padding: '10px' }}>Email</th>
                                <th style={{ padding: '10px' }}>Rol</th>
                                <th style={{ padding: '10px' }}>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {usersList.map(u => (
                                <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{u.name}</td>
                                    <td style={{ padding: '10px' }}>{u.email}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{
                                            backgroundColor: u.role === 'admin' ? '#4a9eff' : '#ddd',
                                            color: u.role === 'admin' ? 'white' : 'black',
                                            padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem'
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        {u.role !== 'admin' && (
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                style={{ background: 'transparent', border: '1px solid red', color: 'red', cursor: 'pointer', borderRadius: '4px' }}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="card" style={{ maxWidth: '100%', textAlign: 'left' }}>
                    <h2>Últimos Productos</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth:'600px' }}>
                            <thead>
                            <tr style={{ borderBottom: '2px solid #444', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Imagen</th>
                                <th style={{ padding: '10px' }}>Título</th>
                                <th style={{ padding: '10px' }}>Precio</th>
                                <th style={{ padding: '10px' }}>Vendedor</th>
                                <th style={{ padding: '10px' }}>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {allProducts.map(p => (
                                <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>
                                        <img src={p.image} alt="mini" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    </td>
                                    <td style={{ padding: '10px' }}>{p.title}</td>
                                    <td style={{ padding: '10px' }}>${p.price}</td>
                                    <td style={{ padding: '10px' }}>
                                        {typeof p.owner === 'object' ? p.owner?.name : 'ID: ' + p.owner}
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        <button
                                            onClick={() => handleDeleteProduct(p._id)}
                                            style={{ background: 'transparent', border: '1px solid red', color: 'red', cursor: 'pointer', borderRadius: '4px' }}
                                        >
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {confirmModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2 style={{color: '#dc3545'}}>Confirmar</h2>
                        <p>{confirmModal.message}</p>
                        <div className="modal-actions">
                            <button
                                className="button"
                                style={{backgroundColor: '#dc3545', borderColor: '#dc3545', color: 'white'}}
                                onClick={() => confirmModal.action(confirmModal.id)}
                            >
                                Sí, eliminar
                            </button>
                            <button className="button" type="button" onClick={() => setConfirmModal(null)}>Cancelar</button>
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