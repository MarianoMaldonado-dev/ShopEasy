import React, { useState } from "react";
import "../developers.css";
import githubIcon from '../assets/github-mark-white.png'
import { FaLinkedin } from 'react-icons/fa'

const developers = [
    {
        nombre: "Mariano Maldonado",
        rol: "Diseño y desarrollo Fullstack | Team Leader",
        github: "https://github.com/MarianoMaldonado-dev",
        linkedin: "https://www.linkedin.com/in/mariano-maldonado-810847288",
        avatar: "https://avatars.githubusercontent.com/u/124847965?v=4",
        presentacion: "Soy Analista de Sistemas y Desarrollador web Jr, con formación en Java, Spring framework y bases de datos MySQL. Actualmente curso la Licenciatura en Sistemas en la Universidad Nacional de La Plata. Me apasiona la tecnología y el aprendizaje continuo. Poseo habilidades en diseño web, organización digital, liderazgo y trabajo en equipo."
    },
    {
        nombre: "Yanina Osuna",
        rol: "Diseño y desarrollo Fullstack",
        github: "https://github.com/YaninaOsuna",
        linkedin: "https://www.linkedin.com/",
        avatar: "https://avatars.githubusercontent.com/u/206969685?v=4",
        presentacion: "Hola"
    },
    {
        nombre: "Leila Arévalo",
        rol: "Desarrollo Fullstack",
        github: "https://github.com/Leilaare09",
        linkedin: "https://www.linkedin.com/",
        avatar: "https://avatars.githubusercontent.com/u/137370243?v=4",
        presentacion: "Hola"
    },
    {
        nombre: "Griselda Chaparro",
        rol: "Desarrollo Fullstack",
        github: "https://github.com/chaparrogriselda09-wq",
        linkedin: "https://www.linkedin.com/",
        avatar: "https://avatars.githubusercontent.com/u/227479594?v=4",
        presentacion: "Hola"
    },
];

export default function Developers() {
    const [modalDev, setModalDev] = useState(null);

    return (
        <div className="developers">
            <h2>Equipo de Desarrollo</h2>
            <div className="dev-grid">
                {developers.map((dev, i) => (
                    <div className="dev-card" key={i}>
                        <img
                            src={dev.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(dev.nombre)}
                            alt={dev.nombre}
                            className="dev-avatar"
                        />
                        <h3>{dev.nombre}</h3>
                        <p className="dev-role">{dev.rol}</p>

                        {dev.presentacion && (
                            <p className="dev-presentacion">
                                {dev.presentacion.slice(0, 80)}...
                                <button className="dev-vermas" onClick={() => setModalDev(dev)}>
                                    Ver más
                                </button>
                            </p>
                        )}
                        <div className="dev-links">
                            <a
                                href={dev.github}
                                target="_blank"
                                rel="noreferrer"
                                className="dev-btn"
                            >
                                <img className="katze" src={githubIcon} alt="GitHub"/>
                            </a>
                            <a
                                href={dev.linkedin && dev.linkedin.trim() !== "" ? dev.linkedin : "https://www.linkedin.com/"}
                                target="_blank"
                                rel="noreferrer"
                                className="dev-btn"
                            >
                                <FaLinkedin className="social-icon" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            {/* Modal presentación */}
            {modalDev && (
                <div className="dev-modal-backdrop" onClick={() => setModalDev(null)}>
                    <div className="dev-modal" onClick={e => e.stopPropagation()}>
                        <img
                            src={modalDev.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(modalDev.nombre)}
                            alt={modalDev.nombre}
                            className="dev-avatar"
                        />
                        <h3>{modalDev.nombre}</h3>
                        <p className="dev-role">{modalDev.rol}</p>
                        <p style={{marginBottom: "1rem"}}>{modalDev.presentacion}</p>
                        <div className="dev-links">
                            <a href={modalDev.github} target="_blank" rel="noreferrer" className="dev-btn">
                                Visita mi GitHub
                            </a>
                            <a href={modalDev.linkedin && modalDev.linkedin.trim() !== "" ? modalDev.linkedin : "https://www.linkedin.com/"} target="_blank" rel="noreferrer" className="dev-btn">
                                Visita mi LinkedIn
                            </a>
                        </div>
                        <button onClick={() => setModalDev(null)} className="dev-btn" style={{marginTop: "1rem"}}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}