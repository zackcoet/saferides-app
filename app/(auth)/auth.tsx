import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>SafeRides</Text>
          <Text style={styles.tagline}>Drive safely, earn flexibly</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.createAccountButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </Pressable>

          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink} onPress={() => router.push('/(auth)/signin')}>Log In</Text>
          </Text>
        </View>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003087', // USC Blue
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  createAccountButton: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  createAccountButtonText: {
    color: '#003087',
    fontSize: 18,
    fontWeight: '600',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  loginLink: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  termsText: {
    color: '#fff',
    opacity: 0.7,
    textAlign: 'center',
    marginHorizontal: 40,
    fontSize: 12,
  },
}); 