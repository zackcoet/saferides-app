import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Show splash screen for at least 2 seconds
        const startTime = Date.now();
        
        // Check auth status
        const authToken = await AsyncStorage.getItem('authToken');
        setIsAuthenticated(!!authToken);
        
        // Calculate remaining time to show splash screen
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);
        
        // Wait for remaining time if needed
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
        setShowSplash(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading || showSplash) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Always show splash screen first */}
        <Stack.Screen
          name="splash"
          options={{
            // Prevent going back
            gestureEnabled: false,
          }}
        />
        
        {/* After splash screen, show auth flow */}
        {!isAuthenticated ? (
          <Stack.Screen
            name="start"
            options={{
              gestureEnabled: false,
            }}
          />
        ) : (
          <>
            <Stack.Screen name="index" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="trips" />
            <Stack.Screen name="settings" />
          </>
        )}
      </Stack>
    </SafeAreaProvider>
  );
} 