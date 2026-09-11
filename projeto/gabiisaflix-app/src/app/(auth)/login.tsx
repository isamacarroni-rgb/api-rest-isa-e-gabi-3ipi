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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    try {
      setCarregando(true);
      const { usuario } = await usuariosService.login({ email: email.trim(), senha });
      await login(usuario);
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <View style={styles.logoArea}>
            <Text style={styles.logoText}>
              GABIISA<Text style={styles.logoRed}>FLIX</Text>
            </Text>
            <Text style={styles.logoSub}>Os filmes de Isabela e Gabriela</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Entrar</Text>

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
              placeholder="Senha"
              placeholderTextColor={Colors.textMuted}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoComplete="password"
            />

            <Pressable
              style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
              onPress={handleLogin}
              disabled={carregando}>
              {carregando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Entrar</Text>
              )}
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.divLine} />
              <Text style={styles.divText}>ou</Text>
              <View style={styles.divLine} />
            </View>

            <Pressable
              style={({ pressed }) => [styles.btnSecondary, pressed && styles.btnSecondaryPressed]}
              onPress={() => router.push('/(auth)/cadastro')}>
              <Text style={styles.btnSecondaryText}>Criar conta</Text>
            </Pressable>

            <Text style={styles.hint}>
              Teste: isabela@gabiisaflix.com / senha123
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  kav: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 4,
  },
  logoRed: {
    color: Colors.red,
  },
  logoSub: {
    fontSize: FontSize.sm,
    color: Colors.textSub,
    marginTop: Spacing.xs,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
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
  btnPressed: {
    backgroundColor: Colors.redDark,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FontSize.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  divText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: '#444',
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSecondaryPressed: {
    backgroundColor: '#222',
  },
  btnSecondaryText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: FontSize.base,
  },
  hint: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
});
