import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DiscountCodeScreen = () => {
  const router = useRouter();
  const [code, setCode] = useState('');

  const handleApplyCode = () => {
    // Example discount codes
    const validCodes = {
      'STUDENT10': 10,
      'WELCOME20': 20,
      'GAMEDAY': 15,
      'USC25': 25
    };

    if (code.trim() === '') {
      Alert.alert('Error', 'Please enter a discount code');
      return;
    }

    const upperCode = code.toUpperCase();
    if (validCodes[upperCode]) {
      Alert.alert(
        'Success!', 
        `Discount code applied! You'll get ${validCodes[upperCode]}% off your next ride.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert('Invalid Code', 'This discount code is not valid or has expired.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Discount Code</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter your discount code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter code (e.g., STUDENT10)"
            placeholderTextColor="#666"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          
          <Text style={styles.hint}>
            Enter a valid discount code to get a discount on your next ride!
          </Text>

          <Pressable 
            style={styles.applyButton}
            onPress={handleApplyCode}
          >
            <Text style={styles.applyButtonText}>Apply Code</Text>
          </Pressable>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Available Discounts:</Text>
            <View style={styles.discountItem}>
              <Ionicons name="school" size={20} color="#003087" />
              <Text style={styles.discountText}>STUDENT10 - 10% off for students</Text>
            </View>
            <View style={styles.discountItem}>
              <Ionicons name="star" size={20} color="#003087" />
              <Text style={styles.discountText}>WELCOME20 - 20% off for new users</Text>
            </View>
            <View style={styles.discountItem}>
              <Ionicons name="football" size={20} color="#003087" />
              <Text style={styles.discountText}>GAMEDAY - 15% off on game days</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003087',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 12,
  },
  hint: {
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: '#003087',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  discountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 14,
  },
});

export default DiscountCodeScreen; 