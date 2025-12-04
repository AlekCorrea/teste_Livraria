// frontend/src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estado do tema
  const [darkMode, setDarkMode] = useState(false);

  // Aplica o tema no body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container header-content">
        
        <Link to="/" className="logo">
          <h1>📚 Livraria</h1>
        </Link>

        <nav className="nav">

          {/* BOTÃO DE TEMA */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="theme-toggle-button"
          >
            {darkMode ? "☀️ Claro" : "🌙 Escuro"}
          </button>

          {user ? (
            <>
              <Link to="/" className="nav-link">Início</Link>
              <Link to="/livros" className="nav-link">Livros</Link>

              {/* NOVO LINK: MEUS FAVORITOS */}
              <Link to="/favoritos" className="nav-link">
                ⭐ Meus Favoritos
              </Link>

              <div className="user-info">
                <span>Olá, {user.username || user.email}!</span>

                <button onClick={handleLogout} className="btn btn-secondary">
                  Sair
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Registrar</Link>
            </>
          )}

        </nav>

      </div>
    </header>
  );
};

export default Header;
