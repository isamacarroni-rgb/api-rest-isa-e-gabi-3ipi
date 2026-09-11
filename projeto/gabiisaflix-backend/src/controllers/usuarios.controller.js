const pool = require('../db/pool');

async function cadastrarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha)
      return res.status(400).json({ mensagem: 'nome, email e senha são obrigatórios' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ mensagem: 'E-mail inválido' });

    if (senha.length < 6)
      return res.status(400).json({ mensagem: 'A senha deve ter pelo menos 6 caracteres' });

    const [existentes] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existentes.length > 0)
      return res.status(409).json({ mensagem: 'Já existe um usuário com esse e-mail' });

    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senha]
    );
    const [linhas] = await pool.query(
      'SELECT id, nome, email, data_cadastro FROM usuarios WHERE id = ?',
      [resultado.insertId]
    );
    res.status(201).json(linhas[0]);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar', erro: erro.message });
  }
}

async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha)
      return res.status(400).json({ mensagem: 'email e senha são obrigatórios' });

    const [linhas] = await pool.query(
      'SELECT id, nome, email, senha, data_cadastro FROM usuarios WHERE email = ?',
      [email]
    );
    if (linhas.length === 0 || linhas[0].senha !== senha)
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos' });

    const { senha: _, ...usuario } = linhas[0];
    res.json({ usuario });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao fazer login', erro: erro.message });
  }
}

async function listarUsuarios(req, res) {
  try {
    const [linhas] = await pool.query('SELECT id, nome, email, data_cadastro FROM usuarios ORDER BY id');
    res.json(linhas);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao listar usuários', erro: erro.message });
  }
}

module.exports = { cadastrarUsuario, loginUsuario, listarUsuarios };
