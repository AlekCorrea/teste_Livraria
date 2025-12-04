// frontend/src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Header from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Livros from './pages/Livros'
import Favoritos from './pages/Favorites'
import DetalheLivro from './pages/DetalheLivro' // 👈 ADICIONADO
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />

              <Route
                path="/livros"
                element={
                  <PrivateRoute>
                    <Livros />
                  </PrivateRoute>
                }
              />

              {/* 👇 NOVA ROTA: DETALHES DO LIVRO */}
              <Route
                path="/livros/:id"
                element={
                  <PrivateRoute>
                    <DetalheLivro />
                  </PrivateRoute>
                }
              />

              <Route
                path="/favoritos"
                element={
                  <PrivateRoute>
                    <Favoritos />
                  </PrivateRoute>
                }
              />

              {/* 👇 CORINGA SEMPRE POR ÚLTIMO */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
