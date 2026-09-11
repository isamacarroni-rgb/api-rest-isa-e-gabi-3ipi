import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { MovieCard } from '@/components/MovieCard';
import { MovieModal } from '@/components/MovieModal';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import type { Filme } from '@/constants/types';
import { useFilmes } from '@/hooks/use-filmes';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const {
    filmes,
    carregando,
    erro,
    recarregar,
    criarFilme,
    atualizarFilme,
    deletarFilme,
  } = useFilmes();

  const { usuario } = useAuth();

  const [filmeSelecionado, setFilmeSelecionado] =
    useState<Filme | null>(null);

  const [modoModal, setModoModal] = useState<
    'ver' | 'editar' | 'criar'
  >('ver');

  const [modalVisivel, setModalVisivel] = useState(false);

  function abrirCriar() {
    setFilmeSelecionado(null);
    setModoModal('criar');
    setModalVisivel(true);
  }

  function abrirDetalhes(filme: Filme) {
    setFilmeSelecionado(filme);
    setModoModal('ver');
    setModalVisivel(true);
  }

  function fecharModal() {
    setModalVisivel(false);
    setFilmeSelecionado(null);
  }

  const destaque = filmes[0];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          GABIISA<Text style={styles.logoRed}>FLIX</Text>
        </Text>

        <Pressable
          style={styles.btnAdicionar}
          onPress={abrirCriar}
        >
          <Text style={styles.btnAdicionarText}>
            + Filme
          </Text>
        </Pressable>
      </View>

      {erro && (
        <View style={styles.erroBox}>
          <Text style={styles.erroText}>
            ⚠️ {erro}
          </Text>

          <Pressable onPress={recarregar}>
            <Text style={styles.erroLink}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      )}

      {carregando && filmes.length === 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color={Colors.red}
          />

          <Text style={styles.loadingText}>
            Carregando filmes...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filmes}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.lista}
          refreshing={carregando}
          onRefresh={recarregar}
          ListHeaderComponent={
            destaque ? (
              <Pressable
                onPress={() => abrirDetalhes(destaque)}
              >
                <DestaqueHero filme={destaque} />
              </Pressable>
            ) : null
          }
          ListHeaderComponentStyle={styles.heroWrapper}
          renderItem={({ item }) => (
            <MovieCard
              filme={item}
              onPress={abrirDetalhes}
            />
          )}
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Text style={styles.vazioEmoji}>
                🎬
              </Text>

              <Text style={styles.vazioText}>
                Nenhum filme ainda.
              </Text>

              <Text style={styles.vazioDica}>
                Adicione o primeiro!
              </Text>
            </View>
          }
        />
      )}

      <MovieModal
        visivel={modalVisivel}
        filme={filmeSelecionado}
        modo={modoModal}
        usuarioId={usuario?.id ?? null}
        onFechar={fecharModal}
        onSalvar={async (dados) => {
          if (modoModal === 'criar') {
            await criarFilme({
              ...dados,
              usuario_id: usuario?.id,
            });
          } else if (filmeSelecionado) {
            await atualizarFilme(
              filmeSelecionado.id,
              dados
            );
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

function getPosterImage(poster: string | null) {
  switch (poster) {
    case 'img/tbm.jpg':
      return require('../../../img/tbm.jpg');

    case 'img/cincopassos.jpg':
      return require('../../../img/cincopassos.jpg');

    case 'img/hotel.webp':
      return require('../../../img/hotel.webp');

    case 'img/curella.webp':
      return require('../../../img/curella.webp');

    default:
      return undefined;
  }
}

function DestaqueHero({ filme }: { filme: Filme }) {
  return (
    <View style={heroStyles.container}>
      <Image
        source={getPosterImage(filme.poster_url)}
        style={heroStyles.image}
        contentFit="cover"
      />

      <View style={heroStyles.gradient}>
        <Text style={heroStyles.tag}>
          EM DESTAQUE
        </Text>

        <Text
          style={heroStyles.nome}
          numberOfLines={2}
        >
          {filme.nome}
        </Text>

        <Text style={heroStyles.info}>
          {filme.plataforma} · dir. {filme.diretor}
        </Text>

        {filme.nota !== null &&
          filme.nota !== undefined && (
            <Text style={heroStyles.nota}>
              ★ {Number(filme.nota).toFixed(1)}
            </Text>
          )}
      </View>
    </View>
  );
}

const heroStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    position: 'relative',
  },

  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
    padding: Spacing.lg,
  },

  tag: {
    color: Colors.red,
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
  },

  nome: {
    color: '#fff',
    fontSize: FontSize.xxl,
    fontWeight: '900',
    lineHeight: 36,
  },

  info: {
    color: Colors.textSub,
    fontSize: FontSize.sm,
    marginTop: 4,
  },

  nota: {
    color: Colors.star,
    fontSize: FontSize.md,
    fontWeight: '700',
    marginTop: 6,
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.bgHeader,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },

  logo: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 3,
  },

  logoRed: {
    color: Colors.red,
  },

  btnAdicionar: {
    backgroundColor: Colors.red,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: 6,
  },

  btnAdicionarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FontSize.sm,
  },

  heroWrapper: {
    marginBottom: 0,
  },

  lista: {
    paddingBottom: Spacing.xxl,
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },

  loadingText: {
    color: Colors.textSub,
    fontSize: FontSize.base,
  },

  erroBox: {
    margin: Spacing.md,
    backgroundColor: '#2a1010',
    borderRadius: 8,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  erroText: {
    color: Colors.danger,
    fontSize: FontSize.sm,
    flex: 1,
  },

  erroLink: {
    color: Colors.red,
    fontWeight: '700',
    fontSize: FontSize.sm,
    marginLeft: Spacing.sm,
  },

  vazio: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: Spacing.sm,
  },

  vazioEmoji: {
    fontSize: 48,
  },

  vazioText: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },

  vazioDica: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
  },
});