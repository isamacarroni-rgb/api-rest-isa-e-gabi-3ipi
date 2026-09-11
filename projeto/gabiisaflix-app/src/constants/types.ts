export interface Usuario {
  id: number;
  nome: string;
  email: string;
  data_cadastro: string;
}

export interface Filme {
  id: number;
  nome: string;
  plataforma: string;
  diretor: string;
  descricao: string | null;
  poster_url: string | null;
  nota: number | null;
  usuario_id: number | null;
  data_cadastro: string;
}

export interface NovoFilme {
  nome: string;
  plataforma: string;
  diretor: string;
  descricao?: string;
  poster_url?: string;
  nota?: number | null;
  usuario_id?: number | null;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface CadastroPayload {
  nome: string;
  email: string;
  senha: string;
}
