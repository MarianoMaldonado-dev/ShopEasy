import React, { createContext, useEffect, useState } from 'react';

export const DataContext = createContext();

const COMMENTS_KEY = 'ecom_comments';
const QUESTIONS_KEY = 'ecom_questions';
const USER_PRODUCTS = 'ecom_user_products';

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch { return []; }
}

export function DataProvider({ children }) {
  const [comments, setComments] = useState(load(COMMENTS_KEY));
  const [questions, setQuestions] = useState(load(QUESTIONS_KEY));
  const [userProducts, setUserProducts] = useState(load(USER_PRODUCTS));

  useEffect(() => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(USER_PRODUCTS, JSON.stringify(userProducts));
  }, [userProducts]);

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

  const addUserProduct = (product) => {
    const p = { ...product, id: Date.now().toString(), ownerId: product.ownerId || null, createdAt: new Date().toISOString() };
    setUserProducts(prev => [p, ...prev]);
    return p;
  };

  const deleteUserProduct = (productId, currentUser) => {
    const p = userProducts.find(x => x.id === productId);
    if (!p) return false;
    if (!currentUser) return false;
    if (currentUser.role === 'admin' || currentUser.id === p.ownerId) {
      setUserProducts(prev => prev.filter(x => x.id !== productId));
      return true;
    }
    return false;
  };

  return (
    <DataContext.Provider value={{ comments, questions, userProducts, addComment, deleteComment, addQuestion, answerQuestion, deleteQuestion, addUserProduct, deleteUserProduct }}>
      {children}
    </DataContext.Provider>
  );
}
