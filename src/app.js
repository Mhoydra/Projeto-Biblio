const express = require('express');
const db = require('./config/db');
const bcrypt = require("bcrypt");

const app = express();

const emprestimosRoutes = require('./routes/emprestimosRouter');
const livrosRoutes = require('./routes/livrosRoutes');
const usuariosRoutes = require('./routes/usuariosRouter');

app.use(express.json());

app.use('/emprestimos', emprestimosRoutes);
app.use('/livros', livrosRoutes);
app.use('/usuarios', usuariosRoutes);

// =========================
// LOGIN
// =========================

app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.json({ sucesso: false });
    }

    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.json({ sucesso: false });
    }

    const user = rows[0];

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.json({ sucesso: false });
    }

    return res.json({ sucesso: true, user });

  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ sucesso: false });
  }
});

module.exports = app;