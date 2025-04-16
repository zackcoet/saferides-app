import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform, Linking, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';

interface TrustedContact {
  id: string;
  name: string;
  phoneNumber: string;
}

const SafetyCenter = () => {
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [isSharing, setIsSharing] = useState(false);

  const handleEmergency = () => {
    Alert.alert(
      'Emergency',
      'Do you want to contact emergency services?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Call 911',
          style: 'destructive',
          onPress: () => {
            Linking.openURL('tel:911');
          }
        }
      ]
    );
  };

  const handleAddTrustedContact = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name]
        });

        if (data.length > 0) {
          // Filter contacts with phone numbers
          const validContacts = data.filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0);
          
          // Show contact picker alert for first 5 contacts
          Alert.alert(
            'Select Trusted Contact',
            'Choose a contact to add:',
            validContacts.slice(0, 5).map(contact => ({
              text: contact.name || 'Unknown',
              onPress: () => {
                const phoneNumber = contact.phoneNumbers![0].number;
                const newContact: TrustedContact = {
                  id: Date.now().toString(),
                  name: contact.name || 'Unknown',
                  phoneNumber: phoneNumber || ''
                };
                setTrustedContacts(prev => [...prev, newContact]);
                Alert.alert('Success', `${contact.name} added as trusted contact`);
              }
            }))
          );
        }
      } else {
        Alert.alert('Permission Required', 'Please enable contacts access to add trusted contacts.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access contacts');
    }
  };

  const handleShareLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please enable location access to share your location.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const mapsUrl = Platform.select({
        ios: `http://maps.apple.com/?ll=${location.coords.latitude},${location.coords.longitude}`,
        android: `http://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`
      });

      if (trustedContacts.length === 0) {
        Alert.alert('No Trusted Contacts', 'Please add trusted contacts first.');
        return;
      }

      const message = `I'm sharing my SafeRides location with you: ${mapsUrl}`;
      
      // Share with each trusted contact
      trustedContacts.forEach(contact => {
        Linking.openURL(`sms:${contact.phoneNumber}&body=${encodeURIComponent(message)}`);
      });

      setIsSharing(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to share location');
    }
  };

  const handleStopSharing = () => {
    setIsSharing(false);
    Alert.alert('Location Sharing Stopped', 'Your trusted contacts will no longer receive updates.');
  };

  return (
    <View style={styles.container}>
      {/* Emergency Button */}
      <Pressable
        style={styles.emergencyButton}
        onPress={handleEmergency}
      >
        <Ionicons name="warning" size={24} color="#fff" />
        <Text style={styles.emergencyButtonText}>Emergency</Text>
      </Pressable>

      {/* Trusted Contacts Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trusted Contacts</Text>
        {trustedContacts.map(contact => (
          <View key={contact.id} style={styles.contactItem}>
            <Ionicons name="person" size={20} color="#003087" />
            <Text style={styles.contactName}>{contact.name}</Text>
          </View>
        ))}
        <Pressable
          style={styles.addButton}
          onPress={handleAddTrustedContact}
        >
          <Ionicons name="add" size={20} color="#003087" />
          <Text style={styles.addButtonText}>Add Trusted Contact</Text>
        </Pressable>
      </View>

      {/* Location Sharing Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Sharing</Text>
        <Pressable
          style={[
            styles.shareButton,
            isSharing && styles.shareButtonActive
          ]}
          onPress={isSharing ? handleStopSharing : handleShareLocation}
        >
          <Ionicons 
            name={isSharing ? "location" : "location-outline"} 
            size={20} 
            color={isSharing ? "#fff" : "#003087"} 
          />
          <Text style={[
            styles.shareButtonText,
            isSharing && styles.shareButtonTextActive
          ]}>
            {isSharing ? 'Stop Sharing Location' : 'Share Location'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  contactName: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#003087',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: '#003087',
    marginLeft: 10,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#003087',
  },
  shareButtonActive: {
    backgroundColor: '#003087',
    borderColor: '#003087',
  },
  shareButtonText: {
    fontSize: 16,
    color: '#003087',
    marginLeft: 10,
  },
  shareButtonTextActive: {
    color: '#fff',
  },
});

export default SafetyCenter; 