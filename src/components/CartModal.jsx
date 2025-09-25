import React, { useState } from 'react';

export default function CartModal({ currentUser, cartProducts, onClose, removeFromCart, emptyCart }) {
    if (!currentUser) {
        console.log("PROPS EN CARTMODAL", { emptyCart, typeofEmptyCart: typeof emptyCart });
        return (
            <div className="modal-backdrop">
                <div className="modal cart-modal">
                    <h2>No tienes acceso</h2>
                    <p>Debes identificarte antes de ver tu carrito.</p>
                    <button className="button" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        );
    }

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [card, setCard] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [checkoutError, setCheckoutError] = useState('');
    const [success, setSuccess] = useState(false);

    const total = cartProducts.reduce((acc, p) => acc + p.price * (p.qty || 1), 0);

    const handleCheckout = (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !address.trim() || !card.trim() || !expiry.trim() || !cvv.trim()) {
            setCheckoutError('Completa todos los campos');
            return;
        }
        setSuccess(true);
        setCheckoutError('');
    };

    return (
        <div className="modal-backdrop">
            <div className="modal cart-modal" style={{position: 'relative'}}>
                {/* Botón Vaciar el carrito arriba a la derecha */}
                {cartProducts.length > 0 && !success && (
                    <button
                        className="button empty-cart-btn"
                        onClick={() => {
                            emptyCart();
                        }}
                        style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            background: 'var(--accent)',
                            color: 'white',
                            fontSize: '1rem',
                            padding: '0.5rem 1rem'
                        }}
                    >
                        Vaciar el carrito
                    </button>
                )}
                <h2>Tu Carrito</h2>
                {cartProducts.length === 0 ? (
                    <>
                        <p>Tu carrito está vacío.</p>
                        <button className="button" onClick={onClose}>Cerrar</button>
                    </>
                ) : (
                    <>
                        <div className="cart-list">
                            {cartProducts.map((p, idx) => (
                                <div className="cart-item" key={p.id || idx}>
                                    <img src={p.image} alt={p.title} className="cart-img"/>
                                    <div className="cart-details">
                                        <strong>{p.title}</strong>
                                        <span>Precio unitario: ${p.price.toFixed(2)}</span>
                                        <span>Cantidad: {p.qty || 1}</span>
                                        <span>Total: ${(p.price * (p.qty || 1)).toFixed(2)}</span>
                                    </div>
                                    <button className="button" onClick={() => removeFromCart(p.id)}>Eliminar</button>
                                </div>
                            ))}
                        </div>
                        <div style={{margin: '1rem 0', borderTop: '1px solid #2b3143', paddingTop: '1rem'}}>
                            <strong>Total del carrito: ${total.toFixed(2)}</strong>
                        </div>
                    </>
                )}
                {/* Finalizar compra */}
                {cartProducts.length > 0 && !success && (
                    <>
                        <h3>Información de pago</h3>
                        <form className="cart-payment-form" onSubmit={handleCheckout}>
                            <label>
                                Nombre completo:
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    autoComplete="name"
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </label>
                            <label>
                                Dirección:
                                <input
                                    type="text"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    required
                                    autoComplete="shipping address-line1"
                                />
                            </label>
                            <label>
                                Número de tarjeta:
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{16}"
                                    value={card}
                                    onChange={e => setCard(e.target.value)}
                                    maxLength={16}
                                    required
                                    autoComplete="cc-number"
                                    placeholder="1234 5678 9012 3456"
                                />
                            </label>
                            <label>
                                Vencimiento:
                                <input
                                    type="text"
                                    value={expiry}
                                    onChange={e => setExpiry(e.target.value)}
                                    maxLength={5}
                                    required
                                    autoComplete="cc-exp"
                                    placeholder="MM/AA"
                                />
                            </label>
                            <label>
                                CVV:
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{3,4}"
                                    value={cvv}
                                    onChange={e => setCvv(e.target.value)}
                                    maxLength={4}
                                    required
                                    autoComplete="cc-csc"
                                    placeholder="123"
                                />
                            </label>
                            <div className="modal-actions">
                                <button className="button" type="submit">Finalizar compra</button>
                                <button className="button" type="button" onClick={onClose}>Cancelar</button>
                            </div>
                            {checkoutError && <div className="error">{checkoutError}</div>}
                        </form>
                    </>
                )}
                {success && (
                    <div className="success">
                        <h3>¡Compra realizada con éxito!</h3>
                        <p>Gracias por tu compra.</p>
                        <div className="modal-actions">
                            <button className="button" onClick={onClose}>Cerrar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}