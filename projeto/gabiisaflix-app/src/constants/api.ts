import type { CadastroPayload, Filme, LoginPayload, NovoFilme, Usuario } from '@/constants/types';


export const API_BASE_URL = 'http://192.168.15.9:3000/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ mensagem: response.statusText }));
    throw new Error(errorBody.mensagem || `Erro ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

export const filmesService = {
  listar: () => request<Filme[]>('/filmes'),

  buscarPorId: (id: number) => request<Filme>(`/filmes/${id}`),

  criar: (dados: NovoFilme) =>
    request<Filme>('/filmes', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizar: (id: number, dados: Partial<NovoFilme>) =>
    request<Filme>(`/filmes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  deletar: (id: number) =>
    request<void>(`/filmes/${id}`, {
      method: 'DELETE',
    }),
};

export const usuariosService = {
  login: (dados: LoginPayload) =>
    request<{ usuario: Usuario }>('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  cadastrar: (dados: CadastroPayload) =>
    request<Usuario>('/usuarios', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  listar: () => request<Usuario[]>('/usuarios'),
};
