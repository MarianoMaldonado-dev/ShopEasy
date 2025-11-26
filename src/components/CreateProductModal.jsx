import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function CreateProductModal({ currentUser, addUserProduct, onClose }) {

    const { currentUser: userWithToken } = useContext(AuthContext);
    const token = userWithToken?.token;

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

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('9.99');
    const [description, setDescription] = useState('¡Vender en ShopEasy es genial!');
    const [image, setImage] = useState('https://camo.githubusercontent.com/c8ad63a83bd6c5535bfaeba2157f5ad20e2e02ec2d0149972dd053ff53199bab/68747470733a2f2f692e706f7374696d672e63632f7a474373664662582f73686f70656173792d6c6f676f2e6a7067');
    const [category, setCategory] = useState('Otros');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
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
        // Verificacion del token antes de enviar
        if (!token) {
            setError('Error en la sesión: Token no encontrado. Intenta iniciar sesión de nuevo.');
            return;
        }

        const product = {
            title,
            price: priceNum,
            description,
            image,
            category: category
        };

        const newProduct = await addUserProduct(product, token);

        if (newProduct) {
            onClose();
        } else {
            setError('Error al publicar. Revisa si todos los campos son válidos.');
        }
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
                        Categoría:
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            required
                        >
                            <option value="electronica">Electrónica</option>
                            <option value="indumentaria">Indumentaria</option>
                            <option value="accesorios">Accesorios</option>
                            <option value="misc">Otros</option>
                        </select>
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