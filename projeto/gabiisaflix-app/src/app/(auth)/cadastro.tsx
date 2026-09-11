import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usuariosService } from '@/constants/api';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function CadastroScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    try {
      setCarregando(true);
      await usuariosService.cadastrar({ nome: nome.trim(), email: email.trim(), senha });
      const { usuario } = await usuariosService.login({ email: email.trim(), senha });
      await login(usuario);
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Erro ao cadastrar');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable style={styles.back} onPress={() => router.back()}>
            <Text style={styles.backText}>← Voltar</Text>
          </Pressable>

          <View style={styles.logoArea}>
            <Text style={styles.logoText}>
              GABIISA<Text style={styles.logoRed}>FLIX</Text>
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Criar conta</Text>

            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor={Colors.textMuted}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <TextInput
              style={styles.input}
              placeholder="Senha (mínimo 6 caracteres)"
              placeholderTextColor={Colors.textMuted}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <Pressable
              style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
              onPress={handleCadastro}
              disabled={carregando}>
              {carregando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Criar conta</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  back: { marginBottom: Spacing.md },
  backText: { color: Colors.textSub, fontSize: FontSize.base },
  logoArea: { alignItems: 'center', marginBottom: Spacing.xl },
  logoText: { fontSize: 36, fontWeight: '900', color: Colors.text, letterSpacing: 4 },
  logoRed: { color: Colors.red },
  card: { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs },
  input: {
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: FontSize.base,
    color: Colors.text,
    borderWidth: 1,
    borderColor: '#333',
  },
  btnPrimary: {
    backgroundColor: Colors.red,
    borderRadius: Radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  btnPressed: { backgroundColor: Colors.redDark },
  btnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
});
