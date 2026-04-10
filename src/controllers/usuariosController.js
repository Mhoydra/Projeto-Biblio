const db = require('../config/db') // ou '../db' dependendo do teu caminho
const bcrypt = require('bcrypt')

/* =========================
   LISTAR USUÁRIOS
========================= */
async function listarUsuarios(req, res) {
    try {
        const [rows] = await db.execute(
            'SELECT idUsuario, nomeUsuario, email, telefone, ativo, created_at FROM usuarios WHERE ativo = true'
        )

        res.json(rows)

    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao buscar usuários' })
    }
}

/* =========================
   BUSCAR POR ID
========================= */
async function buscarPorIdUsuarios(req, res) {
    try {
        const id = parseInt(req.params.id)

        const [rows] = await db.execute(
            'SELECT idUsuario, nomeUsuario, email, telefone, ativo, created_at FROM usuarios WHERE idUsuario = ? AND ativo = true',
            [id]
        )

        if (rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' })
        }

        res.json(rows[0])

    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao buscar usuário' })
    }
}

/* =========================
   CRIAR USUÁRIO (CADASTRO)
========================= */
async function criarUsuario(req, res) {
    try {
        const { nome, email, senha, telefone } = req.body

        // validação básica
        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Preencha os campos obrigatórios' })
        }

        // verificar duplicados
        const [existe] = await db.execute(
            'SELECT idUsuario FROM usuarios WHERE email = ? OR nomeUsuario = ? OR telefone = ?',
            [email, nome, telefone]
        )

        if (existe.length > 0) {
            return res.json({ sucesso: false, erro: 'Usuário já cadastrado' })
        }

        // hash da senha
        const hash = await bcrypt.hash(senha, 10)

        // insert
        const [result] = await db.execute(
            `INSERT INTO usuarios (nomeUsuario, email, senha, telefone)
             VALUES (?, ?, ?, ?)`,
            [nome, email, hash, telefone]
        )

        res.status(201).json({
            sucesso: true,
            id: result.insertId
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ sucesso: false, erro: err.message })
    }
}

/* =========================
   ATUALIZAR USUÁRIO
========================= */
async function atualizarUsuario(req, res) {
    try {
        const id = parseInt(req.params.id)
        const { nome, email, telefone, ativo } = req.body

        const [rows] = await db.execute(
            'SELECT * FROM usuarios WHERE idUsuario = ?',
            [id]
        )

        if (rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' })
        }

        const usuarioAtual = rows[0]

        const novoNome = nome ?? usuarioAtual.nomeUsuario
        const novoEmail = email ?? usuarioAtual.email
        const novoTelefone = telefone ?? usuarioAtual.telefone
        const novoAtivo = ativo ?? usuarioAtual.ativo

        await db.execute(
            `UPDATE usuarios 
             SET nomeUsuario = ?, email = ?, telefone = ?, ativo = ?
             WHERE idUsuario = ?`,
            [novoNome, novoEmail, novoTelefone, novoAtivo, id]
        )

        res.json({
            id,
            nome: novoNome,
            email: novoEmail,
            telefone: novoTelefone,
            ativo: novoAtivo
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao atualizar usuário' })
    }
}

/* =========================
   REMOVER (SOFT DELETE)
========================= */
async function removerUsuario(req, res) {
    try {
        const id = parseInt(req.params.id)

        const [result] = await db.execute(
            'UPDATE usuarios SET ativo = false WHERE idUsuario = ? AND ativo = true',
            [id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado ou já removido' })
        }

        res.json({ mensagem: 'Usuário removido com sucesso' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao remover usuário' })
    }
}

module.exports = {
    listarUsuarios,
    buscarPorIdUsuarios,
    criarUsuario,
    atualizarUsuario,
    removerUsuario
}