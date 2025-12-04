// src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const UsersRepository = require('../repositories/users.repository');

class AuthController {
    constructor() {
        this.usersRepo = new UsersRepository();
    }

async register(req, res, next) {
    try {
        const { username, email, password, fullName } = req.body;

        if (!username || !email || !password || !fullName) {
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
        }

        const existingUserByUsername = await this.usersRepo.findByUsername(username);
        if (existingUserByUsername) return res.status(409).json({ erro: 'Usuário já existe.' });

        const existingUserByEmail = await this.usersRepo.findByEmail(email);
        if (existingUserByEmail) return res.status(409).json({ erro: 'Email já cadastrado.' });

        const hash = await bcrypt.hash(password, 10);

        const user = await this.usersRepo.create({ username, email, password: hash, fullName });

        req.session.userId = user.id;

        res.status(201).json({ mensagem: 'Usuário registrado com sucesso!', user: user.toJSON() });
    } catch (err) {
        next(err);
    }
}


    async login(req, res, next) {
        try {
            const { username, password } = req.body;

            const user = await this.usersRepo.findByUsername(username);
            if (!user) {
                return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
            }

            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid) {
                return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
            }

            req.session.userId = user.id;
            res.status(200).json({ mensagem: 'Login realizado com sucesso!', user: user });
        } catch (err) {
            next(err);
        }
    }

    async me(req, res, next) {
        try {
            const user = req.session.user; // ou req.user dependendo do seu código

            if (!user) {
                return res.status(401).json({ erro: "Não autenticado" });
            }

            // Remove a senha, sem usar toJSON
            const { password, senha, ...dadosUsuario } = user;

            return res.json(dadosUsuario);

        } catch (error) {   
            next(error);
        }
    }



    async logout(req, res, next) {
        req.session.destroy(() => {
            res.status(200).json({ mensagem: 'Logout realizado com sucesso.' });
        });
    }

}

module.exports = AuthController;
