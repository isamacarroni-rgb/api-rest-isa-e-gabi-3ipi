import { useCallback, useEffect, useState } from 'react';
import { filmesService } from '@/constants/api';
import type { Filme, NovoFilme } from '@/constants/types';

export function useFilmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarFilmes = useCallback(async () => {
    try {
      setErro(null);
      setCarregando(true);
      const dados = await filmesService.listar();
      setFilmes(dados);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar filmes');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarFilmes();
  }, [carregarFilmes]);

  async function criarFilme(dados: NovoFilme): Promise<Filme> {
    const novo = await filmesService.criar(dados);
    setFilmes((prev) => [novo, ...prev]);
    return novo;
  }

  async function atualizarFilme(id: number, dados: Partial<NovoFilme>): Promise<Filme> {
    const atualizado = await filmesService.atualizar(id, dados);
    setFilmes((prev) => prev.map((f) => (f.id === id ? atualizado : f)));
    return atualizado;
  }

  async function deletarFilme(id: number): Promise<void> {
    await filmesService.deletar(id);
    setFilmes((prev) => prev.filter((f) => f.id !== id));
  }

  return {
    filmes,
    carregando,
    erro,
    recarregar: carregarFilmes,
    criarFilme,
    atualizarFilme,
    deletarFilme,
  };
}
