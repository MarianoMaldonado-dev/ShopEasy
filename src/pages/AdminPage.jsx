import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { DataContext } from '../contexts/DataContext'
export default function AdminPage(){
  const { currentUser, users } = useContext(AuthContext)
  const { userProducts } = useContext(DataContext)
  if (!currentUser || currentUser.role !== 'admin') return <div>Access denied</div>
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Usuarios registrados</h2>
      <ul>
        {users.map(u=> <li key={u.id}>{u.name} ({u.email}) - {u.role}</li>)}
      </ul>
      <h2>El usuario Administrador no puede realizar publicaciones de productos.</h2>
      <ul>
        {userProducts.map(p=> <li key={p.id}>{p.title} - owner: {p.ownerId}</li>)}
      </ul>
    </div>
  )
}
