/*
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";*/

import React from "react";
import "./developers.css";

const developers = [
    {
        nombre: "Mariano Maldonado",
        rol: "Team Leader/Desarrollador Fullstack",
        github: "https://github.com/MarianoMaldonado-dev",
        linkedin: "https://www.linkedin.com/in/mariano-maldonado-810847288",
        avatar: "https://avatars.githubusercontent.com/u/124847965?v=4",
    },
    {
        nombre: "?",
        rol: "?",
        github: "https://github.com/",
        linkedin: "https://www.linkedin.com/",
        avatar: "",
    },
    {
        nombre: "?",
        rol: "?",
        github: "https://github.com/",
        linkedin: "https://www.linkedin.com/",
        avatar: "",
    },
    {
        nombre: "?",
        rol: "?",
        github: "https://github.com/",
        linkedin: "https://www.linkedin.com/",
        avatar: "",
    },
    {
        nombre: "?",
        rol: "?",
        github: "https://github.com/",
        linkedin: "https://www.linkedin.com/",
        avatar: "",
    },
];

export default function Developers() {
    return (
        <div className="developers">
            <h2>Equipo de Desarrollo</h2>
            <div className="dev-grid">
                {developers.map((dev, i) => (
                    <div className="dev-card" key={i}>
                        <img src={dev.avatar} alt={dev.nombre} className="dev-avatar" />
                        <h3>{dev.nombre}</h3>
                        <p className="dev-role">{dev.rol}</p>
                        <div className="dev-links">
                            {dev.github && (
                                <a href={dev.github} target="_blank" rel="noreferrer">
                                    GitHub
                                </a>
                            )}
                            {dev.linkedin && (
                                <a href={dev.linkedin} target="_blank" rel="noreferrer">
                                    LinkedIn
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
