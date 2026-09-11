import { Image } from 'expo-image';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import type { Filme, NovoFilme } from '@/constants/types';

const PLATAFORMAS = [
  'Netflix',
  'Disney+',
  'Amazon Prime Video',
  'HBO Max',
  'Apple TV+',
  'Globoplay',
  'Paramount+',
  'Outra',
];

type Props = {
  visivel: boolean;
  filme: Filme | null;
  modo: 'ver' | 'editar' | 'criar';
  usuarioId: number | null;
  onFechar: () => void;
  onSalvar: (dados: NovoFilme) => Promise<void>;
  onEditar: () => void;
  onDeletar: () => Promise<void>;
};

function getPlatformColor(p: string): string {
  const map: Record<string, string> = {
    Netflix: Colors.red,
    'Disney+': '#113CCF',
    'Amazon Prime Video': '#00A8E1',
    'HBO Max': '#8E2DE2',
    'Apple TV+': '#555',
    Globoplay: '#E55E00',
    'Paramount+': '#0064FF',
  };

  return map[p] ?? '#444';
}

/* =========================================================
   IMAGENS ANTIGAS DO PROJETO

   Continuam funcionando para os filmes que já estão
   cadastrados no banco.
   ========================================================= */

function getPosterImage(poster: string | null) {
  switch (poster) {
    case 'img/tbm.jpg':
      return require('../../img/tbm.jpg');

    case 'img/cincopassos.jpg':
      return require('../../img/cincopassos.jpg');

    case 'img/hotel.webp':
      return require('../../img/hotel.webp');

    case 'img/curella.webp':
      return require('../../img/curella.webp');

    default:
      return poster || undefined;
  }
}

export function MovieModal({
  visivel,
  filme,
  modo,
  usuarioId,
  onFechar,
  onSalvar,
  onEditar,
  onDeletar,
}: Props) {
  const [form, setForm] = useState<NovoFilme>({
    nome: '',
    plataforma: 'Netflix',
    diretor: '',
    descricao: '',
    poster_url: '',
    nota: undefined,
  });

  const [imagemSelecionada, setImagemSelecionada] =
    useState<string | null>(null);

  const [salvando, setSalvando] = useState(false);
  const [deletando, setDeletando] = useState(false);

  useEffect(() => {
    if (filme && modo === 'editar') {
      setForm({
        nome: filme.nome,
        plataforma: filme.plataforma,
        diretor: filme.diretor,
        descricao: filme.descricao ?? '',
        poster_url: filme.poster_url ?? '',
        nota: filme.nota ?? undefined,
      });

      setImagemSelecionada(filme.poster_url ?? null);
    } else if (modo === 'criar') {
      setForm({
        nome: '',
        plataforma: 'Netflix',
        diretor: '',
        descricao: '',
        poster_url: '',
        nota: undefined,
      });

      setImagemSelecionada(null);
    }
  }, [filme, modo, visivel]);

  /* =========================================================
     SELECIONAR IMAGEM
     ========================================================= */

  async function selecionarImagem() {
    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de acesso à sua galeria para você escolher uma imagem.'
        );
        return;
      }

      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [2, 3],
          quality: 0.8,
        });

      if (resultado.canceled) {
        return;
      }

      const imagem = resultado.assets[0];

      if (!imagem?.uri) {
        return;
      }

      setImagemSelecionada(imagem.uri);

      setForm((f) => ({
        ...f,
        poster_url: imagem.uri,
      }));
    } catch (e) {
      Alert.alert(
        'Erro',
        'Não foi possível selecionar a imagem.'
      );
    }
  }

  /* =========================================================
     REMOVER IMAGEM
     ========================================================= */

  function removerImagem() {
    setImagemSelecionada(null);

    setForm((f) => ({
      ...f,
      poster_url: '',
    }));
  }

  /* =========================================================
     SALVAR
     ========================================================= */

  async function handleSalvar() {
    if (
      !form.nome.trim() ||
      !form.plataforma ||
      !form.diretor.trim()
    ) {
      Alert.alert(
        'Atenção',
        'Nome, plataforma e diretor são obrigatórios.'
      );
      return;
    }

    try {
      setSalvando(true);

      await onSalvar({
        ...form,
        nota:
          form.nota !== undefined &&
          form.nota !== null
            ? Number(form.nota)
            : undefined,
        usuario_id: usuarioId,
      });
    } catch (e) {
      Alert.alert(
        'Erro',
        e instanceof Error
          ? e.message
          : 'Erro ao salvar'
      );
    } finally {
      setSalvando(false);
    }
  }

  /* =========================================================
     DELETAR
     ========================================================= */

  async function handleDeletar() {
    Alert.alert(
      'Deletar filme',
      `Tem certeza que deseja remover "${filme?.nome}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletando(true);

              await onDeletar();
            } catch (e) {
              Alert.alert(
                'Erro',
                e instanceof Error
                  ? e.message
                  : 'Erro ao deletar'
              );
            } finally {
              setDeletando(false);
            }
          },
        },
      ]
    );
  }

  const isModoVer = modo === 'ver';
  const isModoForm =
    modo === 'editar' || modo === 'criar';

  return (
    <Modal
      visible={visivel}
      animationType="slide"
      transparent
      onRequestClose={onFechar}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
          style={styles.kav}
        >
          <View style={styles.container}>
            <View style={styles.handleBar} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* =====================================================
                  MODO VISUALIZAÇÃO
                 ===================================================== */}

              {isModoVer && filme && (
                <>
                  <Image
                    source={getPosterImage(
                      filme.poster_url
                    )}
                    style={styles.posterVer}
                    contentFit="cover"
                  />

                  <View style={styles.verContent}>
                    <View
                      style={[
                        styles.platBadge,
                        {
                          backgroundColor:
                            getPlatformColor(
                              filme.plataforma
                            ),
                        },
                      ]}
                    >
                      <Text style={styles.platText}>
                        {filme.plataforma}
                      </Text>
                    </View>

                    <Text style={styles.verNome}>
                      {filme.nome}
                    </Text>

                    <Text style={styles.verDiretor}>
                      Direção: {filme.diretor}
                    </Text>

                    {filme.nota !== null && (
                      <Text style={styles.verNota}>
                        ★{' '}
                        {Number(
                          filme.nota
                        ).toFixed(1)}{' '}
                        / 10
                      </Text>
                    )}

                    {filme.descricao && (
                      <Text style={styles.verDesc}>
                        {filme.descricao}
                      </Text>
                    )}

                    <Text style={styles.verData}>
                      Adicionado em{' '}
                      {new Date(
                        filme.data_cadastro
                      ).toLocaleDateString(
                        'pt-BR'
                      )}
                    </Text>

                    <View style={styles.acoes}>
                      <Pressable
                        style={[
                          styles.btnAcao,
                          styles.btnEditar,
                        ]}
                        onPress={onEditar}
                      >
                        <Text
                          style={
                            styles.btnAcaoText
                          }
                        >
                          ✏️ Editar
                        </Text>
                      </Pressable>

                      <Pressable
                        style={[
                          styles.btnAcao,
                          styles.btnDeletar,
                        ]}
                        onPress={handleDeletar}
                        disabled={deletando}
                      >
                        {deletando ? (
                          <ActivityIndicator
                            color="#fff"
                            size="small"
                          />
                        ) : (
                          <Text
                            style={
                              styles.btnAcaoText
                            }
                          >
                            🗑️ Excluir
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  </View>
                </>
              )}

              {/* =====================================================
                  MODO FORMULÁRIO
                 ===================================================== */}

              {isModoForm && (
                <View style={styles.formContent}>
                  <Text style={styles.formTitulo}>
                    {modo === 'criar'
                      ? '➕ Novo filme'
                      : '✏️ Editar filme'}
                  </Text>

                  {/* NOME */}

                  <Campo label="Nome do filme *">
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: Divertida Mente 2"
                      placeholderTextColor={
                        Colors.textMuted
                      }
                      value={form.nome}
                      onChangeText={(v) =>
                        setForm((f) => ({
                          ...f,
                          nome: v,
                        }))
                      }
                    />
                  </Campo>

                  {/* PLATAFORMA */}

                  <Campo label="Plataforma *">
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={
                        false
                      }
                      contentContainerStyle={
                        styles.plataformasRow
                      }
                    >
                      {PLATAFORMAS.map((p) => {
                        const ativo =
                          form.plataforma === p;

                        return (
                          <Pressable
                            key={p}
                            style={[
                              styles.platChip,
                              ativo && {
                                backgroundColor:
                                  getPlatformColor(
                                    p
                                  ),
                                borderColor:
                                  getPlatformColor(
                                    p
                                  ),
                              },
                            ]}
                            onPress={() =>
                              setForm((f) => ({
                                ...f,
                                plataforma: p,
                              }))
                            }
                          >
                            <Text
                              style={[
                                styles.platChipText,
                                ativo && {
                                  color: '#fff',
                                },
                              ]}
                            >
                              {p}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </Campo>

                  {/* DIRETOR */}

                  <Campo label="Diretor *">
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: Christopher Nolan"
                      placeholderTextColor={
                        Colors.textMuted
                      }
                      value={form.diretor}
                      onChangeText={(v) =>
                        setForm((f) => ({
                          ...f,
                          diretor: v,
                        }))
                      }
                    />
                  </Campo>

                  {/* NOTA */}

                  <Campo label="Nota (0–10)">
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: 8.5"
                      placeholderTextColor={
                        Colors.textMuted
                      }
                      value={
                        form.nota !== undefined &&
                        form.nota !== null
                          ? String(form.nota)
                          : ''
                      }
                      onChangeText={(v) => {
                        const n =
                          parseFloat(v);

                        setForm((f) => ({
                          ...f,
                          nota: isNaN(n)
                            ? undefined
                            : n,
                        }));
                      }}
                      keyboardType="decimal-pad"
                    />
                  </Campo>

                  {/* =================================================
                      ANEXAR IMAGEM
                     ================================================= */}

                  <Campo label="Poster do filme">
                    {!imagemSelecionada ? (
                      <Pressable
                        style={({ pressed }) => [
                          styles.btnAnexar,
                          pressed &&
                            styles.btnAnexarPressed,
                        ]}
                        onPress={selecionarImagem}
                      >
                        <Text
                          style={
                            styles.btnAnexarIcon
                          }
                        >
                          📷
                        </Text>

                        <View>
                          <Text
                            style={
                              styles.btnAnexarTitulo
                            }
                          >
                            Anexar imagem
                          </Text>

                          <Text
                            style={
                              styles.btnAnexarSubtitulo
                            }
                          >
                            Escolha uma imagem da galeria
                          </Text>
                        </View>
                      </Pressable>
                    ) : (
                      <View
                        style={
                          styles.imagemSelecionadaBox
                        }
                      >
                        <Image
                          source={
                            imagemSelecionada.startsWith(
                              'img/'
                            )
                              ? getPosterImage(
                                  imagemSelecionada
                                )
                              : {
                                  uri: imagemSelecionada,
                                }
                          }
                          style={
                            styles.posterPreview
                          }
                          contentFit="cover"
                        />

                        <View
                          style={
                            styles.acoesImagem
                          }
                        >
                          <Pressable
                            style={
                              styles.btnTrocarImagem
                            }
                            onPress={
                              selecionarImagem
                            }
                          >
                            <Text
                              style={
                                styles.btnTrocarTexto
                              }
                            >
                              📷 Trocar imagem
                            </Text>
                          </Pressable>

                          <Pressable
                            style={
                              styles.btnRemoverImagem
                            }
                            onPress={
                              removerImagem
                            }
                          >
                            <Text
                              style={
                                styles.btnRemoverTexto
                              }
                            >
                              🗑️ Remover
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </Campo>

                  {/* DESCRIÇÃO */}

                  <Campo label="Descrição">
                    <TextInput
                      style={[
                        styles.input,
                        styles.textarea,
                      ]}
                      placeholder="Escreva um breve resumo..."
                      placeholderTextColor={
                        Colors.textMuted
                      }
                      value={
                        form.descricao ?? ''
                      }
                      onChangeText={(v) =>
                        setForm((f) => ({
                          ...f,
                          descricao: v,
                        }))
                      }
                      multiline
                      numberOfLines={4}
                    />
                  </Campo>

                  {/* BOTÕES */}

                  <View
                    style={styles.botoesForm}
                  >
                    <Pressable
                      style={styles.btnCancelar}
                      onPress={onFechar}
                    >
                      <Text
                        style={
                          styles.btnCancelarText
                        }
                      >
                        Cancelar
                      </Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.btnSalvar,
                        pressed && {
                          opacity: 0.85,
                        },
                      ]}
                      onPress={handleSalvar}
                      disabled={salvando}
                    >
                      {salvando ? (
                        <ActivityIndicator
                          color="#fff"
                          size="small"
                        />
                      ) : (
                        <Text
                          style={
                            styles.btnSalvarText
                          }
                        >
                          {modo === 'criar'
                            ? 'Adicionar'
                            : 'Salvar'}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* FECHAR */}

            <Pressable
              style={styles.fechar}
              onPress={onFechar}
            >
              <Text style={styles.fecharText}>
                ✕
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

/* =========================================================
   CAMPO
   ========================================================= */

function Campo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={campoStyles.wrapper}>
      <Text style={campoStyles.label}>
        {label}
      </Text>

      {children}
    </View>
  );
}

const campoStyles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },

  label: {
    color: Colors.textSub,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});

/* =========================================================
   ESTILOS
   ========================================================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },

  kav: {
    maxHeight: '95%',
  },

  container: {
    backgroundColor: Colors.bgModal,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '95%',
    position: 'relative',
  },

  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  fechar: {
    position: 'absolute',
    top: 14,
    right: Spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fecharText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: FontSize.base,
  },

  /* =====================================================
     MODO VER
     ===================================================== */

  posterVer: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },

  verContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },

  platBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },

  platText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: '800',
  },

  verNome: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    lineHeight: 34,
  },

  verDiretor: {
    color: Colors.textSub,
    fontSize: FontSize.base,
  },

  verNota: {
    color: Colors.star,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },

  verDesc: {
    color: Colors.textSub,
    fontSize: FontSize.base,
    lineHeight: 22,
    marginTop: Spacing.xs,
  },

  verData: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },

  acoes: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },

  btnAcao: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: Radius.md,
    alignItems: 'center',
  },

  btnEditar: {
    backgroundColor: '#2a3a2a',
    borderWidth: 1,
    borderColor: Colors.success,
  },

  btnDeletar: {
    backgroundColor: '#3a1a1a',
    borderWidth: 1,
    borderColor: Colors.red,
  },

  btnAcaoText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: FontSize.base,
  },

  /* =====================================================
     FORMULÁRIO
     ===================================================== */

  formContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  formTitulo: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '800',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },

  input: {
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 13,
    fontSize: FontSize.base,
    color: Colors.text,
    borderWidth: 1,
    borderColor: '#333',
  },

  textarea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },

  plataformasRow: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },

  platChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: Colors.bgInput,
  },

  platChipText: {
    color: Colors.textSub,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },

  /* =====================================================
     ANEXAR IMAGEM
     ===================================================== */

  btnAnexar: {
    minHeight: 82,
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#444',
    borderStyle: 'dashed',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  btnAnexarPressed: {
    opacity: 0.7,
  },

  btnAnexarIcon: {
    fontSize: 30,
  },

  btnAnexarTitulo: {
    color: Colors.text,
    fontSize: FontSize.base,
    fontWeight: '700',
  },

  btnAnexarSubtitulo: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 3,
  },

  imagemSelecionadaBox: {
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#444',
    padding: Spacing.sm,
  },

  posterPreview: {
    width: 140,
    height: 200,
    borderRadius: Radius.md,
    alignSelf: 'center',
  },

  acoesImagem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },

  btnTrocarImagem: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: Radius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },

  btnTrocarTexto: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },

  btnRemoverImagem: {
    flex: 1,
    backgroundColor: '#3a1a1a',
    borderRadius: Radius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },

  btnRemoverTexto: {
    color: Colors.red,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },

  /* =====================================================
     BOTÕES DO FORMULÁRIO
     ===================================================== */

  botoesForm: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },

  btnCancelar: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },

  btnCancelarText: {
    color: Colors.textSub,
    fontWeight: '600',
    fontSize: FontSize.base,
  },

  btnSalvar: {
    flex: 2,
    backgroundColor: Colors.red,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },

  btnSalvarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FontSize.md,
  },
});