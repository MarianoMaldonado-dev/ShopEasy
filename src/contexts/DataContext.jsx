import React, { createContext, useEffect, useState } from 'react';

export const DataContext = createContext();

const API_URL = 'https://shopeasyapi.onrender.com/api';

const COMMENTS_KEY = 'ecom_comments';
const QUESTIONS_KEY = 'ecom_questions';
const CART_KEY = 'ecom_cart';

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch { return []; }
}

export function DataProvider({ children }) {
  const [comments, setComments] = useState(load(COMMENTS_KEY));
  const [questions, setQuestions] = useState(load(QUESTIONS_KEY));
  const [cartProducts, setCartProducts] = useState(load(CART_KEY));

  useEffect(() => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartProducts));
  }, [cartProducts]);

  const addToCart = (product) => {
    setCartProducts(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p =>
            p.id === product.id
                ? { ...p, qty: (p.qty || 1) + 1 }
                : p
        )
      } else {
        return [...prev, { ...product, qty: 1 }]
      }
    })
  }

  const removeFromCart = (id) => {
    setCartProducts(prev => prev.filter(p => p.id !== id));
  };

  const emptyCart = () => {
    setCartProducts([]);
  };

  const addComment = (productId, userId, userName, text) => {
    const c = { id: Date.now().toString(), productId, userId, userName, text, createdAt: new Date().toISOString() };
    setComments(prev => [...prev, c]);
    return c;
  };

  const deleteComment = (commentId, currentUser) => {
    const c = comments.find(x => x.id === commentId);
    if (!c) return false;
    if (!currentUser) return false;
    if (currentUser.role === 'admin' || currentUser.id === c.userId) {
      setComments(prev => prev.filter(x => x.id !== commentId));
      return true;
    }
    return false;
  };

  const addQuestion = (productId, userId, userName, text) => {
    const q = { id: Date.now().toString(), productId, userId, userName, text, answers: [], createdAt: new Date().toISOString() };
    setQuestions(prev => [...prev, q]);
    return q;
  };

  const answerQuestion = (questionId, userId, userName, text) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, answers: [...q.answers, { id: Date.now().toString(), userId, userName, text, createdAt: new Date().toISOString() }] } : q));
  };

  const deleteQuestion = (questionId, currentUser) => {
    const q = questions.find(x => x.id === questionId);
    if (!q) return false;
    if (!currentUser) return false;
    if (currentUser.role === 'admin' || currentUser.id === q.userId) {
      setQuestions(prev => prev.filter(x => x.id !== questionId));
      return true;
    }
    return false;
  };

  // ====================================================================
  // CREAR PRODUCTO (POST /api/products)
  // ====================================================================
  const addUserProduct = async (product, token) => {
    try {
      const productData = {
        title: product.title,
        description: product.description || 'Sin descripción',
        price: product.price,
        image: product.image,
        category: product.category || 'misc'
      };

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error al crear producto:', data.message || data.errors?.[0]?.msg || 'Error desconocido');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error en la API al crear producto:', error);
      return null;
    }
  };

  // ====================================================================
  // ACTUALIZAR PRODUCTO (PUT /api/products/)
  // ====================================================================
  const updateUserProduct = async (productId, productData, token) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error al actualizar:', data.message);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return null;
    }
  };

  // ====================================================================
  // ELIMINAR PRODUCTO (DELETE /api/products/:id)
  // ====================================================================
  const deleteUserProduct = async (productId, token) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Usamos el token
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al eliminar producto:', errorData.message || 'Error desconocido');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      return false;
    }
  };


  return (
      <DataContext.Provider value={{
        comments,
        questions,
        cartProducts,
        setCartProducts,
        addToCart,
        removeFromCart,
        emptyCart,
        addComment,
        deleteComment,
        addQuestion,
        answerQuestion,
        deleteQuestion,
        addUserProduct,
        updateUserProduct,
        deleteUserProduct
      }}>
        {children}
      </DataContext.Provider>
  );
}