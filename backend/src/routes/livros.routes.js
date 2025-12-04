const express = require("express");
const router = express.Router();
const LivrosController = require("../controllers/livros.controller");

const livrosController = new LivrosController();

// ==================== MULTER CORRIGIDO ====================
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "..", "uploads", "capa"));
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato inválido! Envie PNG, JPG ou JPEG."));
  }
};

const upload = multer({
  storage,
  fileFilter
});
// ============================================================


// === SUAS ROTAS ===
router.get("/", livrosController.listarLivros.bind(livrosController));
router.get("/:id", livrosController.buscarLivroPorId.bind(livrosController));

router.post(
  "/",
  upload.single("capa"),
  livrosController.criarLivro.bind(livrosController)
);

router.put(
  "/:id",
  upload.single("capa"),
  livrosController.atualizarLivro.bind(livrosController)
);

router.delete("/:id", livrosController.removerLivro.bind(livrosController));

module.exports = router;
