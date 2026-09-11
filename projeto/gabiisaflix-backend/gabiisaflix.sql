CREATE DATABASE IF NOT EXISTS gabiisaflix
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE gabiisaflix;

DROP TABLE IF EXISTS filmes;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE filmes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  plataforma VARCHAR(100) NOT NULL,
  diretor VARCHAR(150) NOT NULL,
  descricao VARCHAR(500),
  poster_url VARCHAR(500),
  nota DECIMAL(3,1) DEFAULT NULL,
  usuario_id INT,
  data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

INSERT INTO usuarios (nome, email, senha) VALUES
('Isabela', 'isabela@gabiisaflix.com', 'senha123'),
('Gabriela', 'gabriela@gabiisaflix.com', 'senha123');

INSERT INTO filmes
(nome, plataforma, diretor, descricao, poster_url, nota, usuario_id)
VALUES
(
  'Teen Beach Movie',
  'Disney+',
  'Jeffrey Hornaday',
  'Dois adolescentes surfistas são transportados para dentro de um filme de praia dos anos 60.',
  'img/tbm.jpg',
  7.0,
  1
),
(
  'A 5 Passos de Você',
  'Netflix',
  'Justin Baldoni',
  'Dois jovens com fibrose cística se apaixonam, mas precisam manter distância física por causa da doença.',
  'img/cincopassos.jpg',
  7.5,
  1
),
(
  'Hotel Transilvânia',
  'Amazon Prime Video',
  'Genndy Tartakovsky',
  'O Conde Drácula administra um hotel só para monstros e vê sua rotina virar de cabeça para baixo com a chegada de um humano.',
  'img/hotel.webp',
  7.7,
  2
),
(
  'Cruella',
  'Disney+',
  'Craig Gillespie',
  'A história de origem de Cruella de Vil, mostrando sua transformação de uma jovem talentosa em vilã.',
  'img/curella.webp',
  7.4,
  2
);