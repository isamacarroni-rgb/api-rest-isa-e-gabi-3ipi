const express = require('express');
const { listarFilmes, buscarFilmePorId, criarFilme, atualizarFilme, deletarFilme } = require('../controllers/filmes.controller');

const router = express.Router();

router.get('/', listarFilmes);
router.get('/:id', buscarFilmePorId);
router.post('/', criarFilme);
router.put('/:id', atualizarFilme);
router.delete('/:id', deletarFilme);

module.exports = router;
