import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MovieCard } from '@/components/MovieCard';
import { MovieModal } from '@/components/MovieModal';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import type { Filme } from '@/constants/types';
import { useFilmes } from '@/hooks/use-filmes';
import { useAuth } from '@/context/AuthContext';

export default function ExplorarScreen() {
  const { filmes, carregando, atualizarFilme, deletarFilme } = useFilmes();
  const { usuario } = useAuth();

  const [busca, setBusca] = useState('');
  const [filmeSelecionado, setFilmeSelecionado] = useState<Filme | null>(null);
  const [modoModal, setModoModal] = useState<'ver' | 'editar' | 'criar'>('ver');
  const [modalVisivel, setModalVisivel] = useState(false);

  const filmesFiltrados = useMemo(() => {
    const q = busca.toLowerCase().trim();

    return filmes.filter((f) => {
      return (
        !q ||
        f.nome.toLowerCase().includes(q) ||
        f.diretor.toLowerCase().includes(q)
      );
    });
  }, [filmes, busca]);

  function abrirDetalhes(filme: Filme) {
    setFilmeSelecionado(filme);
    setModoModal('ver');
    setModalVisivel(true);
  }

  function fecharModal() {
    setModalVisivel(false);
    setFilmeSelecionado(null);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Explorar</Text>
      </View>

      {/* BUSCA */}
      <View style={styles.buscaWrapper}>
        <TextInput
          style={styles.busca}
          placeholder="Buscar por título ou diretor..."
          placeholderTextColor={Colors.textMuted}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* CONTAGEM */}
      <Text style={styles.contagem}>
        {filmesFiltrados.length}{' '}
        {filmesFiltrados.length === 1 ? 'filme' : 'filmes'}
      </Text>

      {/* FILMES */}
      {carregando ? (
        <ActivityIndicator
          color={Colors.red}
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={filmesFiltrados}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <MovieCard
              filme={item}
              onPress={abrirDetalhes}
            />
          )}
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Text style={styles.vazioEmoji}>🔍</Text>
              <Text style={styles.vazioText}>
                Nenhum resultado.
              </Text>
            </View>
          }
        />
      )}

      {/* MODAL DO FILME */}
      <MovieModal
        visivel={modalVisivel}
        filme={filmeSelecionado}
        modo={modoModal}
        usuarioId={usuario?.id ?? null}
        onFechar={fecharModal}
        onSalvar={async (dados) => {
          if (filmeSelecionado) {
            await atualizarFilme(filmeSelecionado.id, dados);
          }

          fecharModal();
        }}
        onEditar={() => setModoModal('editar')}
        onDeletar={async () => {
          if (filmeSelecionado) {
            await deletarFilme(filmeSelecionado.id);
            fecharModal();
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.bgHeader,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },

  titulo: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
  },

  buscaWrapper: {
    margin: Spacing.md,
    marginBottom: Spacing.xs,
  },

  busca: {
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: FontSize.base,
    borderWidth: 1,
    borderColor: '#333',
  },

  contagem: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },

  lista: {
    paddingBottom: Spacing.xxl,
  },

  vazio: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: Spacing.sm,
  },

  vazioEmoji: {
    fontSize: 40,
  },

  vazioText: {
    color: Colors.textSub,
    fontSize: FontSize.md,
  },
});