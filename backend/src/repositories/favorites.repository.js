// backend/src/repositories/favorites.repository.js
const db = require('../database/sqlite'); // mesmo módulo usado nos outros repositories

class FavoritesRepository {
  async addFavorite(userId, bookId) {
    const sql = `INSERT OR IGNORE INTO favorites (user_id, book_id) VALUES (?, ?)`;
    // o db.run DO SEU PROJETO já devolve uma Promise
    await db.run(sql, [userId, bookId]);
  }

  async removeFavorite(userId, bookId) {
    const sql = `DELETE FROM favorites WHERE user_id = ? AND book_id = ?`;
    await db.run(sql, [userId, bookId]);
  }

  async listFavoritesByUser(userId) {
    const sql = `
      SELECT l.*
      FROM favorites f
      JOIN livros l ON l.id = f.book_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `;
    const rows = await db.all(sql, [userId]);
    return rows;
  }

  async isFavorite(userId, bookId) {
    const sql = `SELECT 1 FROM favorites WHERE user_id = ? AND book_id = ? LIMIT 1`;
    const row = await db.get(sql, [userId, bookId]);
    return !!row;
  }
}

module.exports = FavoritesRepository;
