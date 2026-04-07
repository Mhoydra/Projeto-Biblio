const express = require('express');
const router = express.Router();
const controller = require('../controllers/livrosController');

router.get  ('/', controller.listarLivros);
router.get  ('/:id', controller.buscarPorIdLivros);
router.post ('/', controller.criarLivro);
router.put  ('/:id', controller.atualizarLivro);
router.delete ('/:id', controller.removerLivro);

module.exports = router;