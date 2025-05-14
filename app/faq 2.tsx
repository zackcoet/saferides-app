import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const faqItems = [
  {
    question: 'I lost my phone, how can I get it back?',
    answer: 'Go to the Trips tab, find your most recent ride, and tap on it. The driver\'s phone number will be listed. You can call or text them directly to arrange the return of your item.'
  },
  {
    question: 'How do I schedule a ride?',
    answer: 'Tap the menu icon (☰) in the top left corner. Select "Schedule a Ride," then choose your pickup location, destination, date, and time.'
  },
  {
    question: 'How do I cancel a ride after I selected one?',
    answer: 'If you selected a ride by mistake, simply tap the "Cancel" button that appears before confirming the request.'
  },
  {
    question: 'How do I know I\'m safe during a ride?',
    answer: 'All SafeRides drivers are registered university students or approved staff. Before confirming a ride, you\'ll be able to see the driver\'s name and profile. You can also share your live trip status with friends or family.'
  },
  {
    question: 'Can I choose a specific type of ride?',
    answer: 'Yes! We offer different ride options like:\n\n• Safe Ride (standard)\n• Safe Ride with Female Driver\n• Name Your Price Ride\n• Flat Rate to Airport\n\nEach has a description so you can pick what fits best.'
  },
  {
    question: 'What if my destination isn\'t showing up?',
    answer: 'Use the search bar to type your destination. If it doesn\'t autocomplete, double-check spelling or zoom out on the map. You can also select from our preset suggestions below the search bar.'
  },
  {
    question: 'Where can I find my past trips?',
    answer: 'Go to the Trips tab. There you\'ll see a list of all your past rides, including the date, price, destination, and driver info.'
  },
  {
    question: 'Can I become a SafeRides driver?',
    answer: 'Yes! In the Trips tab, scroll to the bottom and tap "Become a Driver." You\'ll be guided through the onboarding process.'
  },
  {
    question: 'How do I access my profile or log out?',
    answer: 'Tap the menu icon (☰) on the top left to access your profile or logout button.'
  },
  {
    question: 'What if I\'m outside the service zone?',
    answer: 'SafeRides currently operates within the designated red border zone shown on the map. If you\'re outside it, you won\'t be able to request a ride until you\'re back in the zone.'
  }
];

export default function FAQScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>FAQ</Text>
        </View>

        {/* FAQ Content */}
        <ScrollView style={styles.content}>
          {faqItems.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.question}>{item.question}</Text>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#003087',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginRight: 30,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  faqItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 