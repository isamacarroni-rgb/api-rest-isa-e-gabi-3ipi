🎬 Gabiisaflix
Plataforma de filmes favoritos de Isabela Leticia M. Barros e Gabriela Beatriz Oliveira. API REEST

📁 Estrutura do projeto
gabiisaflix/
├── gabiisaflix-backend/   → API REST (Node.js + Express + MySQL)
└── gabiisaflix-app/       → App mobile (Expo / React Native)
🗄️ 1. Banco de Dados (MySQL)
Abra o MySQL Workbench ou o terminal MySQL e execute o arquivo:

gabiisaflix-backend/gabiisaflix.sql
Ou via terminal:

mysql -u root -p < gabiisaflix-backend/gabiisaflix.sql
Usuários de teste criados:

isabela@gabiisaflix.com / senha123
gabriela@gabiisaflix.com / senha123
🚀 2. Backend (Node.js)
Instalar e rodar
cd gabiisaflix-backend
npm install
npm run dev      # desenvolvimento (nodemon)
# ou
npm start        # produção
Configurar .env
Edite o arquivo gabiisaflix-backend/.env:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_AQUI   # deixe vazio se não tiver senha
DB_NAME=gabiisaflix
PORT=3000
A API vai rodar em: http://localhost:3000

Endpoints disponíveis
Método	Rota	Descrição
GET	/api/filmes	Listar todos os filmes
GET	/api/filmes/:id	Buscar filme por ID
POST	/api/filmes	Criar novo filme
PUT	/api/filmes/:id	Atualizar filme
DELETE	/api/filmes/:id	Deletar filme
POST	/api/usuarios/login	Login
POST	/api/usuarios	Cadastro
GET	/api/usuarios	Listar usuários
📱 3. App Expo
Configurar o IP do backend
Abra gabiisaflix-app/src/constants/api.ts e troque o IP:

export const API_BASE_URL = 'http://SEU_IP_LOCAL:3000/api';
Como descobrir seu IP:

Windows: ipconfig → "Endereço IPv4"
Mac/Linux: ifconfig ou ip addr
Ex: http://192.168.1.105:3000/api
⚠️ Não use localhost no celular físico — use o IP da sua máquina na rede local.

Instalar e rodar
cd gabiisaflix-app
npm install
npx expo install expo-image-picke (Esse é o pacote do Expo que vocês usam para selecionar imagens da galeria do celular)
npx expo start
Opções após iniciar:

Escaneie o QR code com o Expo Go no celular
✨ Funcionalidades do App
Login e cadastro com validação
Tela Início com destaque do último filme e grade
Tela Explorar com busca por título/diretor e filtros por plataforma
Tela Perfil com dados da conta e opção de logout
CRUD completo: adicionar, visualizar, editar e excluir filmes
Visual dark inspirado no Netflix
🎨 Paleta de cores
Cor	Hex
Fundo	#141414
Card	#1f1f1f
Vermelho	#E50914
Texto	#ffffff
Subtexto	#b3b3b3
Estrela	#f5c518
