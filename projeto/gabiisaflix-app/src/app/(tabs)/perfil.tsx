import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function PerfilScreen() {
  const { usuario, logout } = useAuth();

  function confirmarLogout() {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  }

  if (!usuario) return null;

  const iniciais = usuario.nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const dataFormatada = new Date(usuario.data_cadastro).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Perfil</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciais}</Text>
          </View>
          <Text style={styles.nome}>{usuario.nome}</Text>
          <Text style={styles.email}>{usuario.email}</Text>
        </View>

        <View style={styles.card}>
          <InfoRow label="Nome" value={usuario.nome} />
          <View style={styles.divider} />
          <InfoRow label="E-mail" value={usuario.email} />
          <View style={styles.divider} />
          <InfoRow label="Membro desde" value={dataFormatada} />
          <View style={styles.divider} />
          <InfoRow label="ID da conta" value={`#${usuario.id}`} />
        </View>

        <Pressable
          style={({ pressed }) => [styles.btnSair, pressed && styles.btnSairPressed]}
          onPress={confirmarLogout}>
          <Text style={styles.btnSairText}>Sair da conta</Text>
        </Pressable>

        <Text style={styles.footer}>
          Gabiisaflix © 2025 · Feito com ❤️ por Isabela e Gabriela
        </Text>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.value}>{value}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  label: { color: Colors.textSub, fontSize: FontSize.sm },
  value: { color: Colors.text, fontSize: FontSize.sm, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.bgHeader,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  titulo: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },
  content: { padding: Spacing.md, gap: Spacing.md },
  avatarArea: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '900' },
  nome: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '700' },
  email: { color: Colors.textSub, fontSize: FontSize.base },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
  },
  divider: { height: 1, backgroundColor: '#2a2a2a' },
  btnSair: {
    borderWidth: 1.5,
    borderColor: Colors.red,
    borderRadius: Radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  btnSairPressed: { backgroundColor: '#2a0a0a' },
  btnSairText: { color: Colors.red, fontWeight: '700', fontSize: FontSize.md },
  footer: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: Spacing.xl,
  },
});
