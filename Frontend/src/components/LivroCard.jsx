import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';   // 👈 IMPORTANTE
import './LivroCard.css';

const LivroCard = ({
  livro,
  favoritoInicial = false,
  onEdit,
  onDelete,
  onFavoriteChange,
}) => {
  const [favorito, setFavorito] = useState(favoritoInicial);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();                // 👈 HOOK DO ROUTER

  useEffect(() => {
    setFavorito(favoritoInicial);
  }, [favoritoInicial]);

  const capaUrl = livro.capa
    ? (livro.capa.startsWith('http')
        ? livro.capa
        : (() => {
            let caminho = livro.capa;

            caminho = caminho.replace(/^\/+/, '');

            if (caminho.startsWith('uploads')) {
              caminho = '/' + caminho;
            } else if (caminho.startsWith('capa') || caminho.startsWith('capas')) {
              caminho = '/uploads/' + caminho;
            } else {
              caminho = '/uploads/capa/' + caminho;
            }

            return `/api${caminho}`;
          })())
    : null;

  const alternarFavorito = async (e) => {
    e.stopPropagation(); // 👈 NÃO DEIXA CLICAR NO CARD
    try {
      setLoading(true);

      if (!favorito) {
        await axios.post(
          `/api/favorites/${livro.id}`,
          {},
          { withCredentials: true }
        );
        setFavorito(true);
        if (onFavoriteChange) onFavoriteChange(true);
      } else {
        await axios.delete(
          `/api/favorites/${livro.id}`,
          { withCredentials: true }
        );
        setFavorito(false);
        if (onFavoriteChange) onFavoriteChange(false);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // 👈 NÃO NAVEGA AO CLICAR NO LIXO
    onDelete && onDelete(livro.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // 👈 NÃO NAVEGA AO CLICAR NO EDITAR
    onEdit && onEdit(livro);
  };

  const irParaDetalhes = () => {
    navigate(`/livros/${livro.id}`); // 👈 AQUI VAI PRA PÁGINA DE DETALHE
  };

  return (
    <div className="livro-card" onClick={irParaDetalhes}>
      {capaUrl && (
        <div className="livro-card-capa">
          <img src={capaUrl} alt={`Capa de ${livro.titulo}`} />
        </div>
      )}

      <div className="livro-card-content">
        <h3>{livro.titulo}</h3>
        <p><strong>Autor:</strong> {livro.autor}</p>
        <p><strong>Ano:</strong> {livro.ano}</p>
        {livro.editora && <p><strong>Editora:</strong> {livro.editora}</p>}

        {/* ⭐ BOTÃO DE FAVORITO APENAS COM A ESTRELA */}
        <button
          className={`favorito-btn ${favorito ? 'favorito-ativo' : ''}`}
          onClick={alternarFavorito}
          disabled={loading}
          title={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {favorito ? '★' : '☆'}
        </button>

        <div className="card-actions">
          {/* 🗑️ LIXEIRA PRIMEIRO */}
          <button
            onClick={handleDelete}
            className="btn btn-danger btn-trash"
            title="Remover livro"
          >
            🗑️
          </button>

          {/* ✏️ EDITAR DEPOIS */}
          <button
            onClick={handleEdit}
            className="btn btn-primary"
          >
            ✏️ Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivroCard;
