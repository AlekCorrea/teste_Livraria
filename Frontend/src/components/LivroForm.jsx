// frontend/src/components/LivroForm.jsx
import React, { useState, useEffect } from 'react';
import './LivroForm.css';

const LivroForm = ({ livro, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    ano: '',
    editora: '',
    numeroPaginas: '',
  });

  // novo estado para arquivo da capa
  const [capaFile, setCapaFile] = useState(null);

  useEffect(() => {
    if (livro) {
      setFormData({
        titulo: livro.titulo || '',
        autor: livro.autor || '',
        ano: livro.ano || '',
        editora: livro.editora || '',
        numeroPaginas: livro.numeroPaginas || '',
      });
    }
  }, [livro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // quando seleciona arquivo
  const handleFileChange = (e) => {
    setCapaFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // agora vamos enviar um FormData
    const data = new FormData();

    // adiciona todos os campos normais
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // adiciona imagem apenas se selecionada
    if (capaFile) {
      data.append("capa", capaFile);
    }

    onSubmit(data); // manda pro Livros.jsx
  };

  return (
    <div className="livro-form-overlay">
      <div className="livro-form-container">
        <h2>{livro ? 'Editar Livro' : 'Novo Livro'}</h2>

        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label htmlFor="titulo">Título *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="autor">Autor *</label>
            <input
              type="text"
              id="autor"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              required
            />
          </div>

          {/* CAMPO NOVO: UPLOAD DE CAPA */}
          <div className="input-group">
            <label htmlFor="capa">Capa do Livro</label>
            <input
              type="file"
              id="capa"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* se estiver editando e já tiver capa, mostra a pré-visualização */}
          {livro && livro.capa && (
            <div className="preview-capa">
              <p>Capa atual:</p>
              <img src={livro.capa} alt="Capa atual" />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="ano">Ano *</label>
            <input
              type="number"
              id="ano"
              name="ano"
              value={formData.ano}
              onChange={handleChange}
              required
              min="1000"
              max="9999"
            />
          </div>

          <div className="input-group">
            <label htmlFor="editora">Editora</label>
            <input
              type="text"
              id="editora"
              name="editora"
              value={formData.editora}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="numeroPaginas">Número de páginas *</label>
            <input
              type="number"
              id="numeroPaginas"
              name="numeroPaginas"
              min={1}
              value={formData.numeroPaginas}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-success">
              {livro ? 'Atualizar' : 'Criar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LivroForm;
