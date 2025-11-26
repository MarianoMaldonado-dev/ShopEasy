import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const nav = useNavigate();

return (
    <div className="container">
        <h1>Ooops! Error 404</h1>
        <p>Parece que este pasillo es un callejón sin salida.

            La página que estás buscando se perdió en nuestro almacén digital.

            ¿Quizás quiera regresar al Inicio?</p>
        <img src="src/assets/404NotFound.jpg" alt="Error 404!" className="error404" />
        <div style={{ marginTop: '2rem' }}>
            <button className="button" onClick={() => nav('/')}>Volver al Inicio</button>
        </div>

    </div>
);
}