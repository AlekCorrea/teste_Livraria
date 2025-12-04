// backend/src/controllers/favorites.controller.js
const FavoritesRepository = require('../repositories/favorites.repository');
const repo = new FavoritesRepository();

module.exports = {
  // GET /api/favorites
  async listarMeus(req, res) {
    try {
      const usuarioId = req.user?.id || req.session?.user?.id || 1;
      console.log('Buscando favoritos do usuário:', usuarioId);
      const livros = await repo.listFavoritesByUser(usuarioId);
      return res.json(livros);
    } catch (err) {
      console.error('Erro ao listar favoritos:', err);
      return res.status(500).json({ mensagem: 'Erro ao listar favoritos' });
    }
  },

  // POST /api/favorites/:livroId
  async adicionar(req, res) {
    try {
      const usuarioId = req.user?.id || req.session?.user?.id || 1;
      const livroId = parseInt(req.params.livroId || req.params.id, 10);

      if (isNaN(livroId)) {
        return res.status(400).json({ erro: 'ID do livro inválido' });
      }

      await repo.addFavorite(usuarioId, livroId);
      const favorito = await repo.isFavorite(usuarioId, livroId);

      return res.status(201).json({
        mensagem: 'Livro adicionado aos favoritos',
        livroId,
        favorito,
      });
    } catch (err) {
      console.error('Erro ao adicionar favorito:', err);
      return res.status(500).json({ mensagem: 'Erro ao atualizar favoritos' });
    }
  },

  // DELETE /api/favorites/:livroId
  async remover(req, res) {
    try {
      const usuarioId = req.user?.id || req.session?.user?.id || 1;
      const livroId = parseInt(req.params.livroId || req.params.id, 10);

      if (isNaN(livroId)) {
        return res.status(400).json({ erro: 'ID do livro inválido' });
      }

      await repo.removeFavorite(usuarioId, livroId);

      return res.json({
        mensagem: 'Livro removido dos favoritos',
        livroId,
        favorito: false,
      });
    } catch (err) {
      console.error('Erro ao remover favorito:', err);
      return res.status(500).json({ mensagem: 'Erro ao atualizar favoritos' });
    }
  },
};
