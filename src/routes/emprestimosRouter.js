const express = require('express');
const router = express.Router();
const controller = require('../controllers/emprestimosController');

router.get  ('/', controller.listarEmprestimos);
router.get ('/atrasados', controller.listarEmprestimoAtrasado);
router.get  ('/:id', controller.buscarPorIdEmprestimos);
router.post ('/', controller.criarEmprestimo);
router.put  ('/:id', controller.registrarDevolucao);


module.exports = router;