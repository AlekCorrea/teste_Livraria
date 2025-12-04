import { useEffect, useState } from 'react';
import axios from 'axios';
import LivroCard from '../components/LivroCard';
import './Home.css';

const Favoritos = () => {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarFavoritos = async () => {
      try {
        const res = await axios.get('/api/favorites', {
          withCredentials: true,
        });
        setLivros(res.data);
      } catch (err) {
        console.error('Erro ao buscar favoritos:', err);
        setErro('Não foi possível carregar seus favoritos.');
      } finally {
        setCarregando(false);
      }
    };

    buscarFavoritos();
  }, []);

  if (carregando) {
    return <p style={{ padding: '2rem' }}>Carregando seus favoritos...</p>;
  }

  if (erro) {
    return <p style={{ padding: '2rem' }}>{erro}</p>;
  }

  return (
    <div className="home-page">
      <h2>⭐ Meus Livros Favoritos</h2>

      {livros.length === 0 ? (
        <p>Você ainda não favoritou nenhum livro.</p>
      ) : (
        <div className="livros-grid">
          {livros.map((livro) => (
            <LivroCard
              key={livro.id}
              livro={livro}
              favoritoInicial={true}
              // ⭐ se desfavoritar na página de favoritos, some da lista
              onFavoriteChange={(ehFavorito) => {
                if (!ehFavorito) {
                  setLivros((anterior) =>
                    anterior.filter((l) => l.id !== livro.id)
                  );
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;
