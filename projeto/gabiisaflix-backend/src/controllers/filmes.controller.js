const pool = require('../db/pool');

async function listarFilmes(req, res) {
  try {
    const [linhas] = await pool.query('SELECT * FROM filmes ORDER BY data_cadastro DESC');
    res.json(linhas);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao listar filmes', erro: erro.message });
  }
}

async function buscarFilmePorId(req, res) {
  try {
    const [linhas] = await pool.query('SELECT * FROM filmes WHERE id = ?', [req.params.id]);
    if (linhas.length === 0) return res.status(404).json({ mensagem: 'Filme não encontrado' });
    res.json(linhas[0]);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar filme', erro: erro.message });
  }
}

async function criarFilme(req, res) {
  try {
    const { nome, plataforma, diretor, descricao, poster_url, nota, usuario_id } = req.body;
    if (!nome || !plataforma || !diretor)
      return res.status(400).json({ mensagem: 'nome, plataforma e diretor são obrigatórios' });

    const notaNum = nota !== undefined && nota !== null && nota !== '' ? parseFloat(nota) : null;
    if (notaNum !== null && (notaNum < 0 || notaNum > 10))
      return res.status(400).json({ mensagem: 'Nota deve ser entre 0 e 10' });

    const [resultado] = await pool.query(
      `INSERT INTO filmes (nome, plataforma, diretor, descricao, poster_url, nota, usuario_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, plataforma, diretor, descricao || null, poster_url || null, notaNum, usuario_id ?? null]
    );
    const [linhas] = await pool.query('SELECT * FROM filmes WHERE id = ?', [resultado.insertId]);
    res.status(201).json(linhas[0]);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar filme', erro: erro.message });
  }
}

async function atualizarFilme(req, res) {
  try {
    const { id } = req.params;
    const [existentes] = await pool.query('SELECT * FROM filmes WHERE id = ?', [id]);
    if (existentes.length === 0) return res.status(404).json({ mensagem: 'Filme não encontrado' });
    const atual = existentes[0];

    const { nome, plataforma, diretor, descricao, poster_url, nota, usuario_id } = req.body;

    const notaFinal = nota !== undefined
      ? (nota !== null && nota !== '' ? parseFloat(nota) : null)
      : atual.nota;

    await pool.query(
      `UPDATE filmes SET nome=?, plataforma=?, diretor=?, descricao=?, poster_url=?, nota=?, usuario_id=? WHERE id=?`,
      [
        nome ?? atual.nome,
        plataforma ?? atual.plataforma,
        diretor ?? atual.diretor,
        descricao !== undefined ? (descricao || null) : atual.descricao,
        poster_url !== undefined ? (poster_url || null) : atual.poster_url,
        notaFinal,
        usuario_id !== undefined ? usuario_id : atual.usuario_id,
        id,
      ]
    );
    const [linhas] = await pool.query('SELECT * FROM filmes WHERE id = ?', [id]);
    res.json(linhas[0]);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar filme', erro: erro.message });
  }
}

async function deletarFilme(req, res) {
  try {
    const [resultado] = await pool.query('DELETE FROM filmes WHERE id = ?', [req.params.id]);
    if (resultado.affectedRows === 0) return res.status(404).json({ mensagem: 'Filme não encontrado' });
    res.status(204).send();
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao deletar filme', erro: erro.message });
  }
}

module.exports = { listarFilmes, buscarFilmePorId, criarFilme, atualizarFilme, deletarFilme };
