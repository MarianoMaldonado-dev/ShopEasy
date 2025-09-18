import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage(){
  const { currentUser, deleteAccount } = useContext(AuthContext)
  const nav = useNavigate()
  if (!currentUser) return <div>Porfavor, inicia sesión</div>

  const remove = () => {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Ésta acción es irreversible.')) {
      deleteAccount(currentUser.id)
      nav('/')
    }
  }

  return (
    <div>
      <h1>Mi perfil</h1>
      <p><strong>Nombre:</strong> {currentUser.name}</p>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <p><strong>Rol:</strong> {currentUser.role}</p>
      <button className="button" onClick={remove}>Eliminar mi cuenta</button>
    </div>
  )
}
