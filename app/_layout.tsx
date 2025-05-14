import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';

export default function RootLayout() {
  console.log('RootLayout: Rendering');
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <RootLayoutNav />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { user, loading } = useAuth();

  console.log('RootLayoutNav: Auth State:', { 
    user: user?.uid, 
    loading,
    hasUser: !!user,
    timestamp: new Date().toISOString()
  });

  if (loading) {
    console.log('RootLayoutNav: Showing loading screen');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  console.log('RootLayoutNav: Rendering navigation stack');
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="splash"
        options={{
          headerShown: false,
        }}
      />
      {!user ? (
        // Auth screens
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
      ) : (
        // App screens
        <Stack.Screen
          name="(app)"
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack>
  );
} 