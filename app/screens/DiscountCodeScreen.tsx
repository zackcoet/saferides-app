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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DiscountCodeScreen = () => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApplyCode = async () => {
    if (code.trim() === '') {
      Alert.alert('Error', 'Please enter a discount code');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

      const upperCode = code.toUpperCase();
      const validCodes: Record<string, number> = {
        'STUDENT10': 10,
        'WELCOME20': 20,
        'GAMEDAY': 15,
        'USC25': 25
      };

      if (validCodes[upperCode]) {
        Alert.alert(
          'Success!', 
          `Discount code applied! You'll get ${validCodes[upperCode]}% off your next ride.`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Invalid Code', 'This discount code is not valid or has expired.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to apply discount code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Pressable 
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Discount Code</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter your discount code</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="pricetag" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter code (e.g., STUDENT10)"
              placeholderTextColor="#666"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!loading}
            />
          </View>
          
          <Text style={styles.hint}>
            Enter a valid discount code to get a discount on your next ride!
          </Text>

          <Pressable 
            style={({ pressed }) => [
              styles.applyButton,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled
            ]}
            onPress={handleApplyCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.applyButtonText}>Apply Code</Text>
            )}
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
            <View style={styles.discountItem}>
              <Ionicons name="trophy" size={20} color="#003087" />
              <Text style={styles.discountText}>USC25 - 25% off for USC students</Text>
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
  backButtonPressed: {
    opacity: 0.7,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 12,
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
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
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
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