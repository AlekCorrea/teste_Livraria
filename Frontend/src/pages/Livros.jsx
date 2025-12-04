// frontend/src/pages/Livros.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { livrosService } from '../services/livrosService';
import LivroCard from '../components/LivroCard';
import LivroForm from '../components/LivroForm';
import './Livros.css';

const Livros = () => {
  const [livros, setLivros] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLivro, setEditingLivro] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    carregarLivrosEFavoritos();
  }, []);

  const carregarLivrosEFavoritos = async () => {
    try {
      setLoading(true);
      setError('');

      // 🔹 Busca livros e favoritos ao mesmo tempo
      const [livrosData, favoritosRes] = await Promise.all([
        livrosService.listar(),
        axios.get('/api/favorites', { withCredentials: true }),
      ]);

      setLivros(livrosData);

      // monta um Set com os IDs dos livros favoritos
      const ids = new Set(favoritosRes.data.map((livro) => livro.id));
      setFavoritosIds(ids);
    } catch (err) {
      setError('Erro ao carregar livros.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLivro(null);
    setShowForm(true);
  };

  const handleEdit = (livro) => {
    setEditingLivro(livro);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este livro?')) {
      return;
    }

    try {
      await livrosService.remover(id);
      showSuccess('Livro removido com sucesso!');
      // recarrega livros + favoritos
      carregarLivrosEFavoritos();
    } catch (err) {
      setError('Erro ao remover livro.');
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setError('');

      if (editingLivro) {
        await livrosService.atualizar(editingLivro.id, formData);
        showSuccess('Livro atualizado com sucesso!');
      } else {
        await livrosService.criar(formData);
        showSuccess('Livro criado com sucesso!');
      }

      setShowForm(false);
      setEditingLivro(null);
      // recarrega livros + favoritos
      carregarLivrosEFavoritos();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.erro || 'Erro ao salvar livro.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLivro(null);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return <div className="loading">Carregando livros...</div>;
  }

  return (
    <div className="container">
      <div className="livros-header">
        <h1>Meus Livros</h1>
        <button onClick={handleCreate} className="btn btn-primary">
          ➕ Adicionar Livro
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {livros.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum livro cadastrado ainda.</p>
          <button onClick={handleCreate} className="btn btn-primary">
            Adicionar seu primeiro livro
          </button>
        </div>
      ) : (
        <div className="livros-grid">
          {livros.map((livro) => (
            <LivroCard
              key={livro.id}
              livro={livro}
              onEdit={handleEdit}
              onDelete={handleDelete}
              // ⭐ aqui dizemos se esse livro JÁ é favorito
              favoritoInicial={favoritosIds.has(livro.id)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <LivroForm
          livro={editingLivro}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Livros;
