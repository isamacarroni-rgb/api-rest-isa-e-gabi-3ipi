const express = require('express');
const { cadastrarUsuario, loginUsuario, listarUsuarios } = require('../controllers/usuarios.controller');

const router = express.Router();

router.get('/', listarUsuarios);
router.post('/', cadastrarUsuario);
router.post('/login', loginUsuario);

module.exports = router;
