import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';

interface SplitPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  totalCost: number;
  onSplitComplete: () => void;
}

const SplitPaymentModal: React.FC<SplitPaymentModalProps> = ({
  visible,
  onClose,
  totalCost,
  onSplitComplete,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Split Payment</Text>
          <Text style={styles.cost}>Total Cost: ${totalCost.toFixed(2)}</Text>
          
          <Pressable style={styles.splitButton} onPress={onSplitComplete}>
            <Text style={styles.splitButtonText}>Split Payment</Text>
          </Pressable>
          
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003087',
  },
  cost: {
    fontSize: 18,
    marginBottom: 30,
    color: '#333',
  },
  splitButton: {
    backgroundColor: '#003087',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  splitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default SplitPaymentModal; 