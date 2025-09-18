import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage(){
  const { login } = useContext(AuthContext)
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = e => {
    e.preventDefault()
    const res = login(form)
    if (!res.ok) setError(res.message || 'Email o contraseña Inválidos')
    else nav('/')
  }

  return (
    <div>
      <h1>Iniciar sesión</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit} className="form">
        <input required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input required type="password" placeholder="Contraseña" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        <button className="button">Iniciar sesión</button>
      </form>
    </div>
  )
}
