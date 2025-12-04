const LivrosRepository = require("../repositories/livros.repository");

class LivrosController {
  constructor() {
    this.repository = new LivrosRepository();
  }

  async listarLivros(req, res, next) {
    const livros = await this.repository.findAll();
    res.status(200).json(livros);
  }

  async buscarLivroPorId(req, res, next) {
    const id = parseInt(req.params.id);
    const livro = await this.repository.findById(id);
    if (!livro) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }
    res.status(200).json(livro);
  }

  async criarLivro(req, res, next) {
    try {
      const { titulo, autor, categoria, ano, editora, numeroPaginas } = req.body;

      // ✅ caminho correto da capa (SEM S)
      const capa = req.file
        ? `/uploads/capa/${req.file.filename}`
        : null;

      const novoLivro = await this.repository.create({
        titulo,
        autor,
        categoria,
        ano: parseInt(ano),
        editora,
        numeroPaginas: parseInt(numeroPaginas),
        capa,
      });

      res.status(201).json({
        mensagem: "Livro criado com sucesso",
        data: novoLivro,
      });
    } catch (error) {
      next(error);
    }
  }

  async atualizarLivro(req, res, next) {
    try {
      const id = parseInt(req.params.id);

      // 1. Buscar livro existente
      const livroExistente = await this.repository.findById(id);
      if (!livroExistente) {
        return res.status(404).json({ erro: "Livro não encontrado" });
      }

      // 2. Dados enviados no body
      const { titulo, autor, categoria, ano, editora, numeroPaginas } = req.body;

      // 3. Começa com a capa antiga
      let capa = livroExistente.capa;

      // 4. Se veio nova capa via upload, substitui
      if (req.file) {
        // ✅ mantém o mesmo padrão de criarLivro
        capa = `/uploads/capa/${req.file.filename}`;
      }

      // 5. Monta objeto final, preservando campos antigos se não forem enviados
      const dadosAtualizados = {
        titulo: titulo ?? livroExistente.titulo,
        autor: autor ?? livroExistente.autor,
        categoria: categoria ?? livroExistente.categoria,
        ano: ano ? parseInt(ano) : livroExistente.ano,
        editora: editora ?? livroExistente.editora,
        numeroPaginas: numeroPaginas
          ? parseInt(numeroPaginas)
          : livroExistente.numeroPaginas,
        capa, // sempre envia a capa (nova ou antiga)
      };

      // 6. Atualiza no banco
      const livroAtualizado = await this.repository.update(id, dadosAtualizados);

      // 7. Resposta
      res.status(200).json({
        mensagem: "Livro atualizado com sucesso",
        data: livroAtualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  async removerLivro(req, res, next) {
    const id = parseInt(req.params.id);
    const livroRemovido = await this.repository.delete(id);
    res.status(200).json({
      mensagem: "Livro removido com sucesso",
      data: livroRemovido,
    });
  }
}

module.exports = LivrosController;
