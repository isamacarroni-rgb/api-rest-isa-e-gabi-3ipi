require('dotenv').config();
const express = require('express');
const cors = require('cors');

const filmesRoutes = require('./routes/filmes.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({
  mensagem: 'API Gabiisaflix no ar 🎬',
  versao: '1.0.0',
  rotas: {
    filmes: '/api/filmes',
    usuarios: '/api/usuarios',
  },
}));

app.use('/api/filmes', filmesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// 404
app.use((req, res) => res.status(404).json({ mensagem: 'Rota não encontrada' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensagem: 'Erro interno do servidor', erro: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API Gabiisaflix rodando em http://localhost:${PORT}`);
  console.log(`📡 Aceita conexões de qualquer IP na porta ${PORT}`);
});
