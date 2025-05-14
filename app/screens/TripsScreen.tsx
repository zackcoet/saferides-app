import 'react-native-get-random-values';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform, SafeAreaView, Image, Animated, ScrollView, Modal, Dimensions, Alert, TextInput, Keyboard, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SideMenu from '../../components/SideMenu';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

interface Trip {
  id: string;
  date: string;
  price: string;
  destination: string;
  driverImage: string;
  status: 'completed' | 'cancelled' | 'upcoming';
}

interface ScheduleLocation {
  name: string;
  latitude: number;
  longitude: number;
}

const TripsScreen = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [scheduleLocation, setScheduleLocation] = useState<ScheduleLocation | null>(null);
  const menuAnimation = useRef(new Animated.Value(-280)).current;
  const [showFAQ, setShowFAQ] = useState(false);
  const [scheduledRides, setScheduledRides] = useState<Trip[]>([]);
  const [showScheduledRidesModal, setShowScheduledRidesModal] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [pastTrips, setPastTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

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

  const menuItems = [
    { id: 'schedule', title: 'Schedule a Ride', icon: 'calendar' },
    { id: 'info', title: 'Info', icon: 'information-circle' },
    { id: 'faq', title: 'FAQ', icon: 'help-circle' },
    { id: 'payment', title: 'Add Payment Method', icon: 'card' },
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
          Alert.alert('Add Payment Method', 'This feature is coming soon!');
          break;
      }
    }, 300);
  };

  const handleScheduleRide = () => {
    if (!scheduleLocation) {
      Alert.alert('Error', 'Please select a destination');
      return;
    }
    
    const newScheduledRide: Trip = {
      id: Date.now().toString(),
      date: scheduleDate.toLocaleString(),
      price: '$0.00',
      destination: scheduleLocation.name,
      driverImage: '',
      status: 'upcoming'
    };
    
    setScheduledRides(prev => [...prev, newScheduledRide]);
    Alert.alert('Success', `Ride scheduled to ${scheduleLocation.name} for ${scheduleDate.toLocaleString()}`);
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

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const tripsQuery = query(
      collection(db, 'rides'),
      where('riderId', '==', user.uid),
      where('status', '==', 'completed')
    );

    const unsubscribe = onSnapshot(tripsQuery, (snapshot) => {
      const trips = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trip[];
      setPastTrips(trips);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003087" />
      </View>
    );
  }

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
              {pastTrips.length === 0 ? (
                <Text style={styles.noTripsText}>No past trips yet.</Text>
              ) : (
                pastTrips.map((trip) => (
                  <View key={trip.id} style={styles.tripCard}>
                    <View style={styles.tripInfo}>
                      <Text style={styles.tripDate}>{trip.date}</Text>
                      <Text style={styles.tripPrice}>{trip.price}</Text>
                      <Text style={styles.tripDestination}>{trip.destination}</Text>
                    </View>
                    {trip.driverImage && (
                      <Image
                        source={{ uri: trip.driverImage }}
                        style={styles.driverImage}
                      />
                    )}
                  </View>
                ))
              )}
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
                setScheduleLocation({
                  name: 'Charlotte Douglas International Airport (CLT)',
                  latitude: 35.2144,
                  longitude: -80.9473,
                });
                setShowSearch(false);
                setShowScheduleModal(true);
              }}
            >
              <View style={styles.actionButtonContent}>
                <Ionicons name="airplane" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Get a ride to CLT Airport - $100</Text>
              </View>
            </Pressable>

            <Pressable 
              style={[styles.actionButton, { marginTop: 10 }]}
              onPress={() => Alert.alert('Become a Driver', 'This feature is coming soon!')}
            >
              <View style={styles.actionButtonContent}>
                <Ionicons name="car" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Become a driver</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>

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
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Schedule Ride</Text>
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => {
                    setShowScheduleModal(false);
                    setScheduleLocation(null);
                    setShowSearch(true);
                  }}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </Pressable>
              </View>

              {showSearch ? (
                <View style={styles.searchContainer}>
                  <GooglePlacesAutocomplete
                    placeholder="Where to?"
                    minLength={2}
                    fetchDetails={true}
                    onPress={handleLocationSelect}
                    query={{
                      key: 'YOUR_GOOGLE_PLACES_API_KEY',
                      language: 'en',
                      components: 'country:us',
                    }}
                    styles={{
                      container: styles.searchInputContainer,
                      textInput: styles.searchInput,
                      listView: styles.searchResults,
                      row: styles.searchRow,
                    }}
                    enablePoweredByContainer={false}
                  />
                </View>
              ) : (
                <View style={styles.selectedLocation}>
                  <View style={styles.selectedLocationContent}>
                    <Ionicons name="location" size={20} color="#007AFF" />
                    <Text style={styles.selectedLocationText}>{scheduleLocation?.name}</Text>
                  </View>
                  <Pressable 
                    style={styles.editLocationButton}
                    onPress={() => setShowSearch(true)}
                  >
                    <Ionicons name="pencil" size={16} color="#666" />
                    <Text style={styles.editLocationText}>Edit</Text>
                  </Pressable>
                </View>
              )}

              <View style={styles.dateTimeContainer}>
                <Pressable 
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar" size={24} color="#003087" />
                  <Text style={styles.dateTimeText}>
                    {scheduleDate.toLocaleDateString()}
                  </Text>
                </Pressable>

                <Pressable 
                  style={styles.dateTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Ionicons name="time" size={24} color="#003087" />
                  <Text style={styles.dateTimeText}>
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
                  styles.scheduleButton,
                  !scheduleLocation && styles.scheduleButtonDisabled
                ]}
                onPress={handleScheduleRide}
                disabled={!scheduleLocation}
              >
                <Text style={styles.scheduleButtonText}>Schedule Ride</Text>
              </Pressable>
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
          <View style={styles.modalOverlay}>
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
              <ScrollView style={styles.scrollView}>
                {scheduledRides.length === 0 ? (
                  <View style={styles.noRidesContainer}>
                    <Ionicons name="calendar-outline" size={48} color="#666" />
                    <Text style={styles.noRidesText}>No scheduled rides yet</Text>
                  </View>
                ) : (
                  scheduledRides.map((ride) => (
                    <View key={ride.id} style={styles.scheduledRideItem}>
                      <View style={styles.scheduledRideHeader}>
                        <Ionicons name="time" size={24} color="#003087" />
                        <Text style={styles.scheduledRideDate}>{ride.date}</Text>
                      </View>
                      <View style={styles.scheduledRideDetails}>
                        <Ionicons name="location" size={20} color="#003087" />
                        <Text style={styles.scheduledRideDestination}>{ride.destination}</Text>
                      </View>
                      <View style={styles.scheduledRideFooter}>
                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: ride.status === 'upcoming' ? '#4CAF50' : '#FF3B30' }
                        ]}>
                          <Text style={styles.statusText}>{ride.status}</Text>
                        </View>
                        {ride.status === 'upcoming' && (
                          <Pressable 
                            style={styles.cancelButton}
                            onPress={() => handleCancelRide(ride.id)}
                          >
                            <Ionicons name="close-circle" size={20} color="#FF3B30" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003087',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
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
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 25,
    width: '48%',
  },
  dateTimeText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#003087',
  },
  scheduleButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scheduleButtonDisabled: {
    backgroundColor: '#ccc',
  },
  scrollView: {
    maxHeight: '90%',
  },
  scheduledRideItem: {
    backgroundColor: '#f8f8f8',
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
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#003087',
  },
  scheduledRideDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduledRideDestination: {
    fontSize: 16,
    marginLeft: 10,
    color: '#666',
  },
  scheduledRideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statusBadge: {
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
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  noRidesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noRidesText: {
    color: '#666',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  noTripsText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TripsScreen; 