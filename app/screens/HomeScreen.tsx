import 'react-native-get-random-values';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform, SafeAreaView, Image, Animated, ScrollView, Modal, Dimensions, Alert, TextInput, Keyboard, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import SideMenu from '../../components/SideMenu';
import SplitPaymentModal from '../../components/SplitPaymentModal';
import PaymentOptionsModal from '../../components/PaymentOptionsModal';
import RideService from '../../services/RideService';
import LogService from '../../services/LogService';
import { collection, onSnapshot, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { auth } from '../../firebaseConfig';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(-280)).current;

  useEffect(() => {
    const checkFirebaseConfig = async () => {
      try {
        // Check if Firebase is properly configured
        if (!db || !auth) {
          throw new Error('Firebase configuration is missing');
        }
        setLoading(false);
      } catch (err) {
        setError('Please configure Firebase in firebaseConfig.ts');
        setLoading(false);
      }
    };

    checkFirebaseConfig();
  }, []);

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(menuAnimation, {
        toValue: -280,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={toggleMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>SafeRides</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to SafeRides</Text>
        <Text style={styles.subtitle}>Your Safe Journey Starts Here</Text>
      </View>
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onMenuItemPress={(id) => {
          // Handle menu item press
          console.log('Menu item pressed:', id);
        }}
        menuAnimation={menuAnimation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
}); 