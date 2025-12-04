// src/routes/index.js
const express = require("express");
const router = express.Router();
// Rotas de livros
const authRoutes= require("./auth.routes")
const livrosRoutes = require("./livros.routes");
const favoritesRoutes = require('./favorites.routes');

router.use('/favorites', favoritesRoutes);
// Rota inicial (explicação do sistema)
router.get("/", (req, res) => {
    res.status(200).json({
        mensagem: "Bem-vindo à API da Livraria! Use /livros para gerenciar os livros.",
    });
});
// Usa as rotas de livros
router.use("/livros", livrosRoutes);
router.use("/auth",authRoutes)
router.use("/fav",favoritesRoutes);
module.exports = router; 
