const express = require('express');
const router = express.Router();

const favoritesController = require('../controllers/favorites.controller');
// const authMiddleware = require('../middleware/auth'); // pode deixar comentado por enquanto

// Lista TODOS os favoritos do usuário (ainda fixo em 1)
router.get(
  '/',
  // authMiddleware,
  favoritesController.listarMeus
);

// Adiciona / alterna favorito
router.post(
  '/:livroId',
  // authMiddleware,
  favoritesController.adicionar
);

// Remove favorito explicitamente
router.delete(
  '/:livroId',
  // authMiddleware,
  favoritesController.remover
);

module.exports = router;
