const db = require('../database/sqlite');
const User = require('../models/user.model');

class UsersRepository {
  async findById(id) {
    const row = await db.get(
      'SELECT id, username, email, full_name, created_at FROM users WHERE id = ?',
      [id]
    );
    return row ? User.fromDB(row) : null;
  }

  async findByUsername(username) {
    const row = await db.get(
      'SELECT id, username, email, full_name, password_hash, created_at FROM users WHERE username = ?',
      [username]
    );
    // aqui não passo pelo User.fromDB porque geralmente preciso do password_hash para login
    return row || null;
  }

  // 🔹 NOVO: buscar usuário pelo e-mail (usado no register)
  async findByEmail(email) {
    const row = await db.get(
      'SELECT id, username, email, full_name, password_hash, created_at FROM users WHERE email = ?',
      [email]
    );
    return row || null;
  }

  // cria um novo usuário
  async create({ username, email, fullName, password }) {
    const result = await db.run(
      'INSERT INTO users (username, email, full_name, password_hash) VALUES (?, ?, ?, ?)',
      [username, email, fullName, password]
    );

    console.log(result);

    const row = await db.get(
      'SELECT id, username, email, full_name, created_at FROM users WHERE id = ?',
      [result.lastInsertRowid]
    );

    return User.fromDB(row);
  }
}

module.exports = UsersRepository;
