import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage(){
  const { register } = useContext(AuthContext)
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    const res = register(form)
    if (!res.ok) setError(res.message || 'Error')
    else nav('/')
  }

  return (
    <div>
      <h1>Registro</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit} className="form">
        <input required placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input required type="password" placeholder="Contraseña" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        <button className="button">Registrarse</button>
      </form>
      <p>Importante: Si usted es administrador, porfavor, registre con el email finalizado en <code>@admin.com</code> proporcionado por el equipo de desarrollo.</p>
    </div>
  )
}
