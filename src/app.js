const express = require('express');
const app = express();

const emprestimosRoutes = require('./routes/emprestimosRouter');
const livrosRoutes = require('./routes/livrosRoutes');
const usuariosRoutes = require('./routes/usuariosRouter');

app.use(express.json());

app.use('/emprestimos', emprestimosRoutes);
app.use('/livros', livrosRoutes);
app.use('/usuarios', usuariosRoutes);

module.exports = app;