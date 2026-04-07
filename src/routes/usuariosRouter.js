const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuariosController');

router.get  ('/', controller.listarUsuarios);
router.get  ('/:id', controller.buscarPorIdUsuarios);
router.post ('/', controller.criarUsuario);
router.put  ('/:id', controller.atualizarUsuario);
router.delete ('/:id', controller.removerUsuario);

module.exports = router;