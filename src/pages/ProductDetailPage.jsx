import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DataContext } from '../contexts/DataContext'
import { AuthContext } from '../contexts/AuthContext'

const CART_KEY = 'ecom_cart'
function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') } catch { return [] } }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)) }

export default function ProductDetailPage(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { comments, questions, addComment, addQuestion, answerQuestion, deleteComment, deleteQuestion } = useContext(DataContext)
  const { currentUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [questionText, setQuestionText] = useState('')

  useEffect(()=>{
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(r=>{
        if (!r.ok) throw new Error('Producto no encontrado')
        return r.json()
      })
      .then(data=>{
        setProduct(data)
        setLoading(false)
      })
      .catch(()=> {
        const up = JSON.parse(localStorage.getItem('ecom_user_products')||'[]')
        const p = up.find(x=> x.id === id)
        if (p) setProduct(p)
        setLoading(false)
      })
  },[id])

  const onAddComment = () => {
    if (!currentUser) { alert('Para realizar un comentario primero inicia sesión'); return }
    addComment(id, currentUser.id, currentUser.name, commentText)
    setCommentText('')
  }

  const onAddQuestion = () => {
    if (!currentUser) { alert('Inicia sesión en tu cuenta para realizar una pregunta'); return }
    addQuestion(id, currentUser.id, currentUser.name, questionText)
    setQuestionText('')
  }

  const productComments = comments.filter(c=> c.productId === id)
  const productQuestions = questions.filter(q=> q.productId === id)

  if (loading) return <div>Cargando...</div>
  if (!product) return <div>Producto no encontrado</div>

  const addToCart = () => {
    const cart = loadCart()
    const existing = cart.find(i=> i.id === product.id)
    if (existing) {
      existing.qty = (existing.qty || 1) + 1
    } else {
      cart.push({ id: product.id, title: product.title, price: product.price || 0, qty: 1, image: product.image})
    }
    saveCart(cart)
    alert('¡Añadido al carrito!')
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <div style={{display:'flex',gap:'2rem',flexWrap:'wrap'}}>
        <img src={product.image} alt={product.title} style={{width:300}}/>
        <div style={{flex:1}}>
          <p className="price">Precio: ${(product.price||0).toFixed(2)}</p>
          <p>{product.description}</p>
          <button className="button" onClick={addToCart}>Añadir al carrito</button>
        </div>
      </div>

      <section style={{marginTop:20}}>
        <h3>Preguntas al vendedor</h3>
        {productQuestions.map(q=>(
            <div key={q.id} style={{border:'1px solid rgba(0,0,0,0.08)',padding:8,marginBottom:6}}>
              <strong>{q.userName}</strong> <small>{new Date(q.createdAt).toLocaleString()}</small>
              <p>{q.text}</p>
              <div>
                {q.answers && q.answers.map(a=>(
                    <div key={a.id} style={{marginLeft:12,borderLeft:'2px solid #ddd',paddingLeft:8}}>
                      <strong>{a.userName}</strong> <small>{new Date(a.createdAt).toLocaleString()}</small>
                      <p>{a.text}</p>
                    </div>
                ))}
              </div>
              {(currentUser && (currentUser.role==='admin' || currentUser.id===q.userId)) && <button className="button" onClick={()=> deleteQuestion(q.id, currentUser)}>Eliminar mi pregunta</button>}
              {currentUser && <button className="button" onClick={()=> {
                const ans = prompt('Respuesta:')
                if (ans) answerQuestion(q.id, currentUser.id, currentUser.name, ans)
              }}>Responder</button>}
            </div>
        ))}
        <div>
          <textarea className="textarea" value={questionText} onChange={e=>setQuestionText(e.target.value)} placeholder="Realizar una pregunta al vendedor"></textarea>
          <br/>
          <button className="button" onClick={onAddQuestion}>Preguntar</button>
        </div>
      </section>

      <section style={{marginTop:20}}>
        <h3>Comentarios</h3>
        {productComments.map(c=>(
          <div key={c.id} style={{border:'1px solid rgba(0,0,0,0.08)',padding:8,marginBottom:6}}>
            <strong>{c.userName}</strong> <small>{new Date(c.createdAt).toLocaleString()}</small>
            <p>{c.text}</p>
            {(currentUser && (currentUser.role==='admin' || currentUser.id===c.userId)) && <button className="button" onClick={()=> deleteComment(c.id, currentUser)}>Eliminar comentario</button>}
          </div>
        ))}
        <div>
          <textarea className="textarea" value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Escribir un comentario"></textarea>
          <br/>
          <button className="button" onClick={onAddComment}>Añadir comentario</button>
        </div>
      </section>

    </div>
  )
}
