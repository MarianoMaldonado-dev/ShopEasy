import React, { useState } from 'react'

export default function ContactForm(){
  const [form, setForm] = useState({name:'', email:'', subject:'', message:''})
  const [sent, setSent] = useState(false)
  const submit = e => {
    e.preventDefault()
    setTimeout(()=> setSent(true), 600)
  }
  if (sent) return <div className="toast">¡Mensaje Enviado! Le responderemos a la brevedad.</div>
  return (
      <div className="formContainer">
    <form onSubmit={submit} className="form">
      <input required placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input required placeholder="Asunto" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/>
        <textarea
            required
            placeholder="Mensaje"
            value={form.message}
            onChange={e=>{
                setForm({...form,message:e.target.value});
                e.target.style.height = "auto";        // resetea la altura
                e.target.style.height = e.target.scrollHeight + "px"; // ajusta al contenido
            }}
        />
      <button className="button">Enviar</button>
    </form>
      </div>
  )
}
