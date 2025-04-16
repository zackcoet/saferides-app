import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EditPhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = React.useState('+1 332-733-6922');

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleSave = () => {
    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s-]+$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    // Save phone changes
    Alert.alert('Success', 'Phone number updated successfully');
    handleBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Phone number</Text>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          You can update your number and we'll send a verification to this number.
        </Text>
        
        <View style={styles.phoneInputContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryFlag}>🇺🇸</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </View>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.verificationStatus}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  saveButton: {
    padding: 5,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 16,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#4CAF50',
    marginLeft: 8,
    fontSize: 16,
  },
}); 