import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SplitPaymentModal from './SplitPaymentModal';

interface PaymentOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  rideId: string;
  totalCost: number;
  onPaymentComplete: () => void;
}

const PaymentOptionsModal: React.FC<PaymentOptionsModalProps> = ({
  visible,
  onClose,
  rideId,
  totalCost,
  onPaymentComplete,
}) => {
  const [showSplitPayment, setShowSplitPayment] = useState(false);

  const handlePayment = (method: string) => {
    Alert.alert(
      'Payment Method Selected',
      `You selected ${method}. Payment processing would happen here.`,
      [
        {
          text: 'OK',
          onPress: onPaymentComplete,
        },
      ]
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Select Payment Method</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#003087" />
              </Pressable>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Cost:</Text>
              <Text style={styles.totalAmount}>${totalCost.toFixed(2)}</Text>
            </View>

            <ScrollView style={styles.paymentOptions}>
              <Pressable
                style={styles.paymentOption}
                onPress={() => handlePayment('Apple Pay')}
              >
                <Ionicons name="logo-apple" size={24} color="#000" />
                <Text style={styles.paymentOptionText}>Apple Pay</Text>
              </Pressable>

              <Pressable
                style={styles.paymentOption}
                onPress={() => handlePayment('Credit Card')}
              >
                <Ionicons name="card" size={24} color="#003087" />
                <Text style={styles.paymentOptionText}>Credit Card</Text>
              </Pressable>

              <Pressable
                style={styles.paymentOption}
                onPress={() => handlePayment('Stripe')}
              >
                <Ionicons name="card-outline" size={24} color="#635BFF" />
                <Text style={styles.paymentOptionText}>Stripe</Text>
              </Pressable>
            </ScrollView>

            <Pressable
              style={styles.splitPaymentButton}
              onPress={() => {
                setShowSplitPayment(true);
                onClose();
              }}
            >
              <Ionicons name="people" size={24} color="#003087" />
              <Text style={styles.splitPaymentButtonText}>Split Payment</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <SplitPaymentModal
        visible={showSplitPayment}
        onClose={() => setShowSplitPayment(false)}
        rideId={rideId}
        totalCost={totalCost}
      />
    </>
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
  paymentOptions: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentOptionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  splitPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
  },
  splitPaymentButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#003087',
    fontWeight: 'bold',
  },
});

export default PaymentOptionsModal; 