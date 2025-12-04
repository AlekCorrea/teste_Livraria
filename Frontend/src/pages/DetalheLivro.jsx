// frontend/src/pages/DetalheLivro.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function DetalheLivro() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [livro, setLivro] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function carregarLivro() {
      try {
        setLoading(true)
        setErro(null)

        const resp = await fetch(`/api/livros/${id}`, {
          credentials: 'include',
        })

        if (!resp.ok) {
          throw new Error('Livro não encontrado')
        }

        const data = await resp.json()
        setLivro(data)
      } catch (err) {
        console.error(err)
        setErro(err.message || 'Erro ao carregar o livro')
      } finally {
        setLoading(false)
      }
    }

    carregarLivro()
  }, [id])

  if (loading) {
    return <p>Carregando detalhes do livro...</p>
  }

  if (erro || !livro) {
    return (
      <div className="detalhe-livro-erro">
        <p>{erro || 'Livro não encontrado.'}</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    )
  }

  // mesma lógica de capa do card, simplificada
  let capaUrl = null
  if (livro.capa) {
    if (livro.capa.startsWith('http')) {
      capaUrl = livro.capa
    } else {
      let caminho = livro.capa.replace(/^\/+/, '')
      if (caminho.startsWith('uploads')) {
        caminho = '/' + caminho
      } else if (caminho.startsWith('capa') || caminho.startsWith('capas')) {
        caminho = '/uploads/' + caminho
      } else {
        caminho = '/uploads/capa/' + caminho
      }
      capaUrl = `/api${caminho}`
    }
  }

  return (
    <div className="pagina-detalhe-livro">
      <button className="btn-voltar" onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      <div className="detalhe-livro-conteudo">
        {capaUrl && (
          <img
            src={capaUrl}
            alt={livro.titulo}
            className="detalhe-livro-capa"
          />
        )}

        <div className="detalhe-livro-infos">
          <h1>{livro.titulo}</h1>
          {livro.autor && <h3>{livro.autor}</h3>}

          {livro.ano && (
            <p>
              <strong>Ano:</strong> {livro.ano}
            </p>
          )}

          {livro.editora && (
            <p>
              <strong>Editora:</strong> {livro.editora}
            </p>
          )}

          {livro.genero && (
            <p>
              <strong>Gênero:</strong> {livro.genero}
            </p>
          )}

          {livro.preco && (
            <p>
              <strong>Preço:</strong> R$ {Number(livro.preco).toFixed(2)}
            </p>
          )}

          {livro.descricao && (
            <>
              <p>
                <strong>Descrição:</strong>
              </p>
              <p>{livro.descricao}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetalheLivro
