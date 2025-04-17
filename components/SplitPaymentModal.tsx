import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RideService from '../services/RideService';
import UserService from '../services/UserService';

interface SplitPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  rideId: string;
  totalCost: number;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const SplitPaymentModal: React.FC<SplitPaymentModalProps> = ({
  visible,
  onClose,
  rideId,
  totalCost,
}) => {
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactList, setShowContactList] = useState(false);
  const [username, setUsername] = useState('');
  const [participants, setParticipants] = useState<Array<{ username: string; amount: number }>>([]);
  const rideService = RideService.getInstance();
  const userService = UserService.getInstance();

  // Sample contacts - in a real app, this would come from your contacts or user database
  const contacts: Contact[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '555-123-4567' },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const handleAddParticipant = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    // Check if user exists (in a real app, this would be an API call)
    const userProfile = await userService.getUserProfile();
    if (!userProfile) {
      Alert.alert('Error', 'User not found');
      return;
    }

    const newParticipant = {
      username: username.trim(),
      amount: 0, // Will be calculated when splitting
    };

    setParticipants([...participants, newParticipant]);
    setUsername('');
  };

  const handleSplitPayment = () => {
    if (!amount || !selectedContact) {
      Alert.alert('Error', 'Please enter an amount and select a contact');
      return;
    }

    const splitAmount = parseFloat(amount);
    if (isNaN(splitAmount) || splitAmount <= 0 || splitAmount > totalCost) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // In a real app, this would send a payment request to the selected contact
    Alert.alert(
      'Payment Request Sent',
      `Requested $${splitAmount.toFixed(2)} from ${selectedContact.name}`,
      [{ text: 'OK', onPress: onClose }]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Split Payment</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#003087" />
            </Pressable>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Cost:</Text>
            <Text style={styles.totalAmount}>${totalCost.toFixed(2)}</Text>
          </View>

          <View style={styles.recipientSection}>
            <Text style={styles.sectionTitle}>Send Request To</Text>
            <Pressable 
              style={styles.recipientInput}
              onPress={() => setShowContactList(!showContactList)}
            >
              <Text style={selectedContact ? styles.selectedContact : styles.placeholderText}>
                {selectedContact ? selectedContact.name : 'Select or search for a contact'}
              </Text>
              <Ionicons 
                name={showContactList ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#003087" 
              />
            </Pressable>

            {showContactList && (
              <View style={styles.contactListContainer}>
                <View style={styles.searchContainer}>
                  <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <ScrollView style={styles.contactList}>
                  {filteredContacts.map(contact => (
                    <Pressable
                      key={contact.id}
                      style={styles.contactItem}
                      onPress={() => {
                        setSelectedContact(contact);
                        setShowContactList(false);
                      }}
                    >
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactName}>{contact.name}</Text>
                        <Text style={styles.contactDetail}>{contact.email}</Text>
                        <Text style={styles.contactDetail}>{contact.phone}</Text>
                      </View>
                      {selectedContact?.id === contact.id && (
                        <Ionicons name="checkmark" size={20} color="#003087" />
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.sectionTitle}>Amount to Request</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>

          <Pressable style={styles.confirmButton} onPress={handleSplitPayment}>
            <Text style={styles.confirmButtonText}>Send Payment Request</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003087',
  },
  closeButton: {
    padding: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
  },
  recipientSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  recipientInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedContact: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
  contactListContainer: {
    marginTop: 8,
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  contactList: {
    maxHeight: 150,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  contactDetail: {
    fontSize: 14,
    color: '#666',
  },
  amountSection: {
    marginBottom: 20,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#003087',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SplitPaymentModal; 