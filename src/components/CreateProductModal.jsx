import React, { useState } from 'react';

export default function CreateProductModal({ currentUser, addUserProduct, onClose }) {
    //Validación de Logueo. Si no hay usuario, muestra mensaje de acceso denegado
    if (!currentUser) {
        return (
            <div className="modal-backdrop">
                <div className="modal">
                    <h2>No tienes acceso</h2>
                    <p>Debes identificarte antes de publicar un artículo.</p>
                    <button className="button" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        );
    }

    // Estados locales para el formulario
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('9.99');
    const [description, setDescription] = useState('¡Vender en ShopEasy es genial!');
    const [image, setImage] = useState('https://via.placeholder.com/300');
    const [error, setError] = useState('');

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        const priceNum = parseFloat(price);
        if (!title.trim()) {
            setError('El título es obligatorio');
            return;
        }
        if (isNaN(priceNum) || priceNum < 0) {
            setError('El precio no puede ser negativo');
            return;
        }
        const product = {
            title,
            price: priceNum,
            description,
            image,
            ownerId: currentUser.id
        };
        addUserProduct(product);
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Publicar nuevo producto</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Título:
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </label>
                    <label>
                        Precio:
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Descripción:
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </label>
                    <label>
                        Imagen URL:
                        <input
                            value={image}
                            onChange={e => setImage(e.target.value)}
                        />
                    </label>
                    {error && <div className="error">{error}</div>}
                    <div className="modal-actions">
                        <button className="button" type="submit">Crear producto</button>
                        <button className="button" type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}