import { Tabs } from 'expo-router';
import { Colors, FontSize } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bgHeader,
          borderTopColor: '#1f1f1f',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.red,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="🎬" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explorar"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="🔍" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="👤" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  const { Text, View } = require('react-native');
  return (
    <View style={{ opacity: color === Colors.red ? 1 : 0.5 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
    </View>
  );
}
