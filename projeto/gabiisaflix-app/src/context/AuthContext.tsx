import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import type { Usuario } from '@/constants/types';

interface AuthContextType {
  usuario: Usuario | null;
  carregando: boolean;
  login: (usuario: Usuario) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  carregando: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('gabiisaflix_usuario')
      .then((json) => {
        if (json) setUsuario(JSON.parse(json));
      })
      .finally(() => setCarregando(false));
  }, []);

  async function login(u: Usuario) {
    setUsuario(u);
    await AsyncStorage.setItem('gabiisaflix_usuario', JSON.stringify(u));
  }

  async function logout() {
    setUsuario(null);
    await AsyncStorage.removeItem('gabiisaflix_usuario');
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
