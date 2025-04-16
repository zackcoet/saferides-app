import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Image, Platform, Animated, Modal, TextInput, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SideMenu from '../components/SideMenu';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

interface Trip {
  id: string;
  date: string;
  price: string;
  destination: string;
  driverImage: string;
}

interface ScheduleLocation {
  name: string;
  latitude: number;
  longitude: number;
}

interface ScheduledRide {
  id: string;
  date: Date;
  destination: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

// Mock data for past trips
const pastTrips: Trip[] = [
  {
    id: '1',
    date: 'March 15, 2024',
    price: '$10',
    destination: 'Williams Brice Stadium',
    driverImage: 'https://via.placeholder.com/50',
  },
  {
    id: '2',
    date: 'March 14, 2024',
    price: '$10',
    destination: '5 Points',
    driverImage: 'https://via.placeholder.com/50',
  },
  {
    id: '3',
    date: 'March 13, 2024',
    price: '$150',
    destination: 'Charlotte Airport',
    driverImage: 'https://via.placeholder.com/50',
  },
];

const TripsScreen = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [scheduleLocation, setScheduleLocation] = useState<ScheduleLocation | null>(null);
  const menuAnimation = useRef(new Animated.Value(-280)).current; // Menu width is 280
  const [showFAQ, setShowFAQ] = useState(false);
  const [scheduledRides, setScheduledRides] = useState<ScheduledRide[]>([]);
  const [showScheduledRidesModal, setShowScheduledRidesModal] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  const toggleMenu = () => {
    if (menuVisible) {
      // Slide out
      Animated.timing(menuAnimation, {
        toValue: -280,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      // Slide in
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const menuItems = [
    { id: 'schedule', title: 'Schedule a Ride', icon: 'calendar' },
    { id: 'info', title: 'Info', icon: 'information-circle' },
    { id: 'faq', title: 'FAQ', icon: 'help-circle' },
    { id: 'payment', title: 'Add Payment Method', icon: 'card' },
  ];

  const faqItems = [
    {
      question: 'What is SafeRides?',
      answer: 'SafeRides is a free transportation service provided by USC for students who need a safe ride home within the designated service area.'
    },
    {
      question: 'When does SafeRides operate?',
      answer: 'SafeRides operates from 7:30 PM to 2:30 AM, seven days a week during fall and spring semesters.'
    },
    {
      question: 'How do I request a ride?',
      answer: 'Simply open the SafeRides app, enter your destination, and confirm your pickup location. A driver will be assigned to you shortly.'
    },
    {
      question: 'What is the service area?',
      answer: 'SafeRides serves the USC Columbia campus and surrounding areas including Five Points, the Vista, and other popular student areas within a 3-mile radius of campus.'
    },
    {
      question: 'How long will I have to wait?',
      answer: 'Wait times typically range from 5-15 minutes depending on demand and your location. You can track your driver in real-time through the app.'
    },
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

  const handleMenuItemPress = (id: string) => {
    toggleMenu();
    
    setTimeout(() => {
      switch (id) {
        case 'schedule':
          setShowScheduleModal(true);
          break;
        case 'faq':
          setShowFAQ(true);
          break;
        case 'payment':
          alert('Add Payment Method');
          break;
        case 'logout':
          alert('Logout');
          break;
      }
    }, 300);
  };

  const handleScheduleRide = () => {
    if (!scheduleLocation) {
      alert('Please select a destination');
      return;
    }
    
    const newScheduledRide: ScheduledRide = {
      id: Date.now().toString(),
      date: scheduleDate,
      destination: scheduleLocation.name,
      status: 'upcoming'
    };
    
    setScheduledRides(prev => [...prev, newScheduledRide]);
    alert(`Ride scheduled to ${scheduleLocation.name} for ${scheduleDate.toLocaleString()}`);
    setShowScheduleModal(false);
    setScheduleLocation(null);
  };

  const handleCancelRide = (rideId: string) => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this scheduled ride?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setScheduledRides(prev => 
              prev.map(ride => 
                ride.id === rideId 
                  ? { ...ride, status: 'cancelled' }
                  : ride
              )
            );
          }
        }
      ]
    );
  };

  const handleLocationSelect = (data: any, details: any) => {
    if (details) {
      setScheduleLocation({
        name: data.structured_formatting.main_text,
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      });
      setShowSearch(false);
    }
  };

  const handleMarkerPress = () => {
    setShowSearch(true);
    setScheduleLocation(null);
  };

  const handleChangeLocation = () => {
    setShowSearch(true);
    setScheduleLocation(null);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            style={styles.menuButton}
            onPress={toggleMenu}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>
          <Text style={styles.logoText}>SafeRides</Text>
        </View>

        <ScrollView style={styles.content}>
          {/* Past Trips Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past trips</Text>
            <View style={styles.tripsList}>
              {pastTrips.map((trip) => (
                <View key={trip.id} style={styles.tripCard}>
                  <View style={styles.tripInfo}>
                    <Text style={styles.tripDate}>{trip.date}</Text>
                    <Text style={styles.tripPrice}>{trip.price}</Text>
                    <Text style={styles.tripDestination}>{trip.destination}</Text>
                  </View>
                  <Image
                    source={{ uri: trip.driverImage }}
                    style={styles.driverImage}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable 
              style={styles.actionButton}
              onPress={() => setShowScheduleModal(true)}
            >
              <View style={styles.actionButtonContent}>
                <Ionicons name="time" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Schedule a ride</Text>
              </View>
            </Pressable>

            <Pressable 
              style={[styles.actionButton, { marginTop: 10 }]}
              onPress={() => setShowScheduledRidesModal(true)}
            >
              <View style={styles.actionButtonContent}>
                <Ionicons name="calendar" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Show scheduled rides</Text>
              </View>
            </Pressable>

            <Pressable 
              style={[styles.actionButton, { marginTop: 10 }]}
              onPress={() => {
                router.push('/');
                setTimeout(() => {
                  router.setParams({ selectedRide: '4' });
                }, 300);
              }}
            >
              <View style={styles.actionButtonContent}>
                <Ionicons name="airplane" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Get a ride to the airport</Text>
              </View>
            </Pressable>

            <Pressable 
              style={[styles.actionButton, { marginTop: 10 }]}
              onPress={() => alert('Become a driver')}
            >
              <View style={styles.actionButtonContent}>
                <Ionicons name="car" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Become a driver</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <Link href="/" asChild>
            <Pressable style={styles.navItem}>
              <Text style={styles.navText}>Rides</Text>
            </Pressable>
          </Link>
          <Pressable style={styles.navItem}>
            <Text style={[styles.navText, { color: '#007AFF' }]}>Trips</Text>
          </Pressable>
          <Link href="/profile" asChild>
            <Pressable style={styles.navItem}>
              <Text style={styles.navText}>Profile</Text>
            </Pressable>
          </Link>
        </View>

        {/* Side Menu */}
        <SideMenu
          visible={menuVisible}
          onClose={toggleMenu}
          onMenuItemPress={handleMenuItemPress}
          menuAnimation={menuAnimation}
        />

        {/* Schedule Ride Modal */}
        <Modal
          visible={showScheduleModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowScheduleModal(false);
            setScheduleLocation(null);
          }}
        >
          <View style={styles.scheduleModalOverlay}>
            <View style={styles.scheduleModalContent}>
              <View style={styles.scheduleModalHeader}>
                <Text style={styles.scheduleModalTitle}>Schedule a Ride</Text>
                <Pressable 
                  style={styles.scheduleModalCloseButton}
                  onPress={() => {
                    setShowScheduleModal(false);
                    setScheduleLocation(null);
                    setShowSearch(true);
                  }}
                >
                  <Text style={styles.scheduleModalCloseText}>✕</Text>
                </Pressable>
              </View>

              {/* Location Search */}
              {showSearch ? (
                <View style={styles.searchContainer}>
                  <GooglePlacesAutocomplete
                    placeholder="Where to?"
                    minLength={2}
                    fetchDetails={true}
                    onPress={(data, details) => handleLocationSelect(data, details)}
                    query={{
                      key: 'AIzaSyCD7fbDDTZTQnX9JrBO8kl0ZEuEcGdGfmA',
                      language: 'en',
                      components: 'country:us',
                      location: '33.9937,-81.0299',
                      radius: '50000',
                      strictbounds: true,
                    }}
                    styles={{
                      container: styles.searchInputContainer,
                      textInput: styles.searchInput,
                      listView: styles.searchResults,
                      row: styles.searchRow,
                    }}
                    enablePoweredByContainer={false}
                    renderLeftButton={() => (
                      <View style={styles.searchIcon}>
                        <Ionicons name="location" size={24} color="#007AFF" />
                      </View>
                    )}
                  />
                </View>
              ) : (
                <View>
                  <Pressable 
                    style={styles.selectedLocation}
                    onPress={handleMarkerPress}
                  >
                    <View style={styles.selectedLocationContent}>
                      <Ionicons name="location" size={20} color="#007AFF" />
                      <Text style={styles.selectedLocationText}>{scheduleLocation?.name}</Text>
                    </View>
                    <View style={styles.editLocationButton}>
                      <Ionicons name="pencil" size={16} color="#666" />
                      <Text style={styles.editLocationText}>Edit</Text>
                    </View>
                  </Pressable>

                  {/* Map Preview */}
                  <View style={styles.mapPreview}>
                    <Pressable 
                      style={styles.mapMarker}
                      onPress={handleMarkerPress}
                    >
                      <Ionicons name="location" size={32} color="#FF3B30" />
                    </Pressable>
                    <Text style={styles.mapHint}>Tap marker to change location</Text>
                  </View>
                </View>
              )}

              <View style={styles.scheduleDateTimeContainer}>
                <Pressable 
                  style={styles.scheduleDateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar" size={24} color="#003087" />
                  <Text style={styles.scheduleDateTimeText}>
                    {scheduleDate.toLocaleDateString()}
                  </Text>
                </Pressable>

                <Pressable 
                  style={styles.scheduleDateTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Ionicons name="time" size={24} color="#003087" />
                  <Text style={styles.scheduleDateTimeText}>
                    {scheduleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Pressable>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={scheduleDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setScheduleDate(selectedDate);
                    }
                  }}
                  minimumDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={scheduleDate}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(false);
                    if (selectedTime) {
                      setScheduleDate(selectedTime);
                    }
                  }}
                />
              )}

              <Pressable
                style={[
                  styles.scheduleConfirmButton,
                  !scheduleLocation && styles.scheduleConfirmButtonDisabled
                ]}
                onPress={handleScheduleRide}
                disabled={!scheduleLocation}
              >
                <Text style={styles.scheduleConfirmButtonText}>Schedule Ride</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showFAQ}
          onRequestClose={() => setShowFAQ(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Frequently Asked Questions</Text>
                <Pressable onPress={() => setShowFAQ(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>×</Text>
                </Pressable>
              </View>
              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {faqItems.map((item, index) => (
                  <View key={index} style={styles.faqItem}>
                    <Text style={styles.question}>{item.question}</Text>
                    <Text style={styles.answer}>{item.answer}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Scheduled Rides Modal */}
        <Modal
          visible={showScheduledRidesModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowScheduledRidesModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Scheduled Rides</Text>
                <Pressable 
                  onPress={() => setShowScheduledRidesModal(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </Pressable>
              </View>
              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {scheduledRides.length === 0 ? (
                  <View style={styles.noRidesContainer}>
                    <Ionicons name="calendar-outline" size={48} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.noRidesText}>No scheduled rides yet</Text>
                  </View>
                ) : (
                  scheduledRides.map((ride) => (
                    <View key={ride.id} style={styles.scheduledRideItem}>
                      <View style={styles.scheduledRideHeader}>
                        <Ionicons name="time" size={24} color="#fff" />
                        <Text style={styles.scheduledRideDate}>
                          {ride.date.toLocaleDateString()} at {ride.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                      <View style={styles.scheduledRideDetails}>
                        <Ionicons name="location" size={20} color="#fff" />
                        <Text style={styles.scheduledRideDestination}>{ride.destination}</Text>
                      </View>
                      <View style={styles.scheduledRideFooter}>
                        <View style={[styles.statusBadge, { 
                          backgroundColor: ride.status === 'upcoming' 
                            ? '#4CAF50' 
                            : ride.status === 'cancelled' 
                              ? '#FF3B30' 
                              : '#FF9800' 
                        }]}>
                          <Text style={styles.statusText}>{ride.status}</Text>
                        </View>
                        {ride.status === 'upcoming' && (
                          <Pressable 
                            style={styles.cancelButton}
                            onPress={() => handleCancelRide(ride.id)}
                          >
                            <Ionicons name="close-circle" size={20} color="#fff" />
                            <Text style={styles.cancelButtonText}>Cancel Ride</Text>
                          </Pressable>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

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
  menuButton: {
    padding: 5,
  },
  menuIcon: {
    fontSize: 24,
    color: '#fff',
  },
  logoText: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 30,
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tripsList: {
    gap: 15,
  },
  tripCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripInfo: {
    flex: 1,
  },
  tripDate: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  tripPrice: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 4,
  },
  tripDestination: {
    fontSize: 14,
    color: '#666',
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 15,
  },
  actionButtons: {
    padding: 20,
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#003087',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  navText: {
    fontSize: 14,
    color: '#999999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#003087',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    maxHeight: '90%',
  },
  faqItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  question: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  answer: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    lineHeight: 22,
  },
  scheduleModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  scheduleModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '90%',
  },
  scheduleModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scheduleModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003087',
  },
  scheduleModalCloseButton: {
    padding: 5,
  },
  scheduleModalCloseText: {
    fontSize: 20,
    color: '#666',
  },
  scheduleDateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scheduleDateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 25,
    width: '48%',
  },
  scheduleDateTimeText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#003087',
  },
  scheduleConfirmButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  scheduleConfirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scheduleConfirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 0,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingLeft: 40,
    height: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 13,
    zIndex: 1,
  },
  searchResults: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchRow: {
    padding: 15,
  },
  selectedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 25,
    marginBottom: 12,
  },
  selectedLocationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedLocationText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  editLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  editLocationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  mapPreview: {
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapMarker: {
    padding: 8,
  },
  mapHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  scheduledRideItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  scheduledRideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduledRideDate: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  scheduledRideDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduledRideDestination: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginLeft: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  noRidesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noRidesText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  scheduledRideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default TripsScreen;
