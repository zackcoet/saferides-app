import 'react-native-get-random-values';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform, SafeAreaView, Image, Animated, ScrollView, Modal, Dimensions, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import SideMenu from '../components/SideMenu';
import SplitPaymentModal from '../components/SplitPaymentModal';
import PaymentOptionsModal from '../components/PaymentOptionsModal';
import RideService from '../services/RideService';

interface Location {
  latitude: number;
  longitude: number;
}

interface Stop {
  name: string;
  location: Location;
}

interface RideOption {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: string;
}

interface Suggestion {
  id: string;
  name: string;
  address: string;
  location: Location;
}

interface GooglePlaceDetails {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
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

const suggestions: Suggestion[] = [
  { id: '1', name: 'Williams Brice Stadium', address: '1125 George Rogers Blvd, Columbia, SC 29201', location: { latitude: 33.9725, longitude: -81.0184 } },
  { id: '2', name: '5 Points', address: '2002 Greene St, Columbia, SC 29205', location: { latitude: 33.9957, longitude: -81.0199 } },
  { id: '3', name: 'Vista', address: '701 Gervais St, Columbia, SC 29201', location: { latitude: 33.9999, longitude: -81.0372 } },
];

const rideOptions: RideOption[] = [
  { id: '1', title: 'Safe Ride', price: '$10', description: 'Get to a location for flat rate', icon: 'car' },
  { id: '2', title: 'Safe Ride (Female Driver)', price: '$10', description: 'SafeRide only for women and by women', icon: 'woman' },
  { id: '3', title: 'Safe Ride (Name your price)', price: '$---', description: 'Rider chooses price', icon: 'cash' },
  { id: '4', title: 'Charlotte Airport', price: '$150', description: 'Flat rate to CLT Airport', icon: 'airplane' },
];

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [destination, setDestination] = useState<Location | null>(null);
  const [destinationName, setDestinationName] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [showAddStop, setShowAddStop] = useState(false);
  const [stops, setStops] = useState<Stop[]>([]);
  const mapRef = useRef<MapView | null>(null);
  const suggestionsOpacity = useRef(new Animated.Value(1)).current;
  const searchRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(-280)).current; // Menu width is 280
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showFAQs, setShowFAQs] = useState(false);
  const faqAnimation = useRef(new Animated.Value(0)).current;
  const [showInfo, setShowInfo] = useState(false);
  const infoAnimation = useRef(new Animated.Value(0)).current;
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);
  const [rideCost, setRideCost] = useState<number>(0);
  const rideService = RideService.getInstance();

  const menuIconStyle = {
    fontSize: 24,
    color: '#fff',
    marginTop: destination ? -2 : 0, // Adjust back arrow position
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      const currentLoc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(currentLoc);

      // Get address for current location
      const addresses = await Location.reverseGeocodeAsync(currentLoc);
      if (addresses && addresses[0]) {
        const address = addresses[0];
        setCurrentAddress(`${address.street}, ${address.city}`);
      }
    })();
  }, []);

  const handleSuggestionPress = (location: Location, name: string) => {
    setDestination(location);
    setDestinationName(name);
    mapRef.current?.animateToRegion({
      ...location,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleCancel = () => {
    setDestination(null);
    setDestinationName('');
    setSelectedRide(null);
  };

  const toggleSuggestions = (show: boolean) => {
    Animated.timing(suggestionsOpacity, {
      toValue: show ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setIsSearching(!show);
  };

  const handleBack = () => {
    // Reset all states to return to original screen
    setDestination(null);
    setDestinationName('');
    setSelectedRide(null);
    setStops([]);
    setIsSearching(false);
    
    // Reset map to initial region
      mapRef.current?.animateToRegion({
      latitude: 34.0007,
      longitude: -81.0348,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
  };

  const handleAddStop = () => {
    setShowAddStop(true);
  };

  const handleStopSelected = (name: string, location: Location) => {
    setStops([...stops, { name, location }]);
    setShowAddStop(false);
  };

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

  const handleMenuItemPress = (id: string) => {
    toggleMenu();
    
    setTimeout(() => {
      switch (id) {
        case 'schedule':
          setShowScheduleModal(true);
          break;
        case 'faq':
          setShowFAQs(true);
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
    alert('Ride scheduled for ' + scheduleDate.toLocaleString());
    setShowScheduleModal(false);
  };

  // Add info content
  const infoContent = {
    description: 'SafeRides is a student-created rideshare platform built for the University of South Carolina community. Designed with safety and simplicity in mind, SafeRides helps students move around campus and nearby areas with trusted, flat-rate rides.\n\nWhether you\'re heading to a party, class, or back to your dorm, SafeRides offers a more personal and secure experience than traditional rideshare apps.',
    features: {
      title: 'Why SafeRides?',
      items: [
        'Student-only drivers: Every driver is verified through a UofSC login, so you\'ll always ride with a fellow student.',
        'Flat-rate pricing: No surprises, no surge. What you see is what you pay.',
        'Female-only driver option: We get it — sometimes you just want that extra peace of mind.',
        'Schedule in advance: Plan ahead with ride scheduling options.',
        'Trip history & contact: Lost something? View your past trips and contact the driver directly.'
      ]
    },
    founder: {
      title: 'Who\'s Behind This?',
      content: 'SafeRides was founded by Zack Coetzee, a student at the University of South Carolina. Frustrated with the lack of safe, affordable, and student-centered transportation late at night, Zack set out to build something better — and make campus feel safer for everyone.'
    },
    support: {
      title: 'Need Help?',
      content: 'Email us at support@saferides.app and we\'ll get back to you as quickly as possible.'
    }
  };

  const handleRequestRide = async () => {
    if (!selectedRide || !destination) return;

    const rideOption = rideOptions.find(option => option.id === selectedRide);
    if (!rideOption) return;

    try {
      const ride = await rideService.createRide({
        pickupLocation: currentAddress,
        dropoffLocation: destinationName,
        scheduledTime: new Date(),
        totalCost: parseFloat(rideOption.price.replace('$', '')),
        participants: [{
          userId: 'current-user', // In real app, use actual user ID
          username: 'You',
          amount: parseFloat(rideOption.price.replace('$', '')),
          status: 'pending',
        }],
      });

      if (ride) {
        setCurrentRideId(ride.id);
        setRideCost(parseFloat(rideOption.price.replace('$', '')));
        setShowPaymentOptions(true);
      }
    } catch (error) {
      console.error('Error creating ride:', error);
      Alert.alert('Error', 'Failed to create ride');
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentOptions(false);
    // Additional logic after payment completion
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <SafeAreaView>
          {/* Header */}
          <View style={styles.header}>
            <Pressable 
              style={styles.menuButton}
              onPress={destination ? handleBack : toggleMenu}
            >
              <Text style={menuIconStyle}>
                {destination ? '←' : '☰'}
              </Text>
            </Pressable>
            <Text style={styles.logoText}>SafeRides</Text>
          </View>

          {destination ? (
            // Ride Selection View
            <View style={styles.rideSelectionHeader}>
              <View style={styles.locationInfo}>
                <View style={styles.locationRow}>
                  <View style={styles.locationDot} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {currentAddress || 'Current Location'}
                  </Text>
                </View>
                {stops.map((stop, index) => (
                  <View key={index} style={[styles.locationRow, styles.stopRow]}>
                    <View style={[styles.locationDot, styles.stopDot]} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {stop.name}
                    </Text>
                  </View>
                ))}
                <View style={[styles.locationRow, styles.destinationRow]}>
                  <View style={[styles.locationDot, styles.destinationDot]} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {destinationName}
                  </Text>
                </View>
              </View>
              <Pressable style={styles.backButton} onPress={handleAddStop}>
                <Text style={styles.backButtonText}>+</Text>
              </Pressable>
            </View>
          ) : (
            // Search View
            <View style={styles.searchSection}>
              <Text style={styles.title}>WHERE ARE YOU GOING TODAY?</Text>
              <View style={styles.searchBarContainer}>
      <GooglePlacesAutocomplete
                  ref={searchRef}
                  placeholder="Enter destination"
        minLength={2}
        fetchDetails={true}
                  onPress={(data, details) => {
                    if (details) {
          const { lat, lng } = details.geometry.location;
          setDestination({ latitude: lat, longitude: lng });
                      setDestinationName(data.structured_formatting.main_text);
          mapRef.current?.animateToRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
                    }
                  }}
                  textInputProps={{
                    onFocus: () => toggleSuggestions(false),
                    onBlur: () => toggleSuggestions(true),
        }}
        query={{
          key: 'AIzaSyCD7fbDDTZTQnX9JrBO8kl0ZEuEcGdGfmA',
          language: 'en',
                    components: 'country:us',
                    location: '33.9937,-81.0299',
                    radius: '50000',
                    strictbounds: true,
        }}
        styles={{
          container: styles.searchContainer,
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
            </View>
          )}
        </SafeAreaView>
      </View>

      <View style={styles.contentSection}>
        {!destination ? (
          // Show suggestions when no destination is selected
          <Animated.View 
            style={[
              styles.suggestionsContainer,
              { opacity: suggestionsOpacity },
              isSearching && styles.suggestionsHidden
            ]}
            pointerEvents={isSearching ? 'none' : 'auto'}
          >
            <ScrollView 
              style={styles.suggestionsScroll}
              showsVerticalScrollIndicator={false}
            >
              {suggestions.map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.suggestionItem,
                    pressed && styles.suggestionPressed
                  ]}
                  onPress={() => handleSuggestionPress(item.location, item.name)}
                >
                  <Ionicons name="location-sharp" size={24} color="#007AFF" />
                  <View style={styles.suggestionTextContainer}>
                    <Text style={styles.suggestionTitle}>{item.name}</Text>
                    <Text style={styles.suggestionAddress}>{item.address}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        ) : (
          // Show ride options when destination is selected
          <View style={styles.rideOptionsContainer}>
            <ScrollView 
              style={styles.rideOptionsScroll}
              showsVerticalScrollIndicator={false}
            >
              {rideOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={({ pressed }) => [
                    styles.rideOption,
                    selectedRide === option.id && styles.rideOptionSelected,
                    pressed && styles.rideOptionPressed,
                  ]}
                  onPress={() => setSelectedRide(option.id)}
                >
                  <View style={styles.rideOptionIcon}>
                    <Ionicons name={option.icon as any} size={24} color="#007AFF" />
                  </View>
                  <View style={styles.rideOptionContent}>
                    <View style={styles.rideOptionHeader}>
                      <Text style={styles.rideOptionTitle}>{option.title}</Text>
                      <Text style={styles.rideOptionPrice}>{option.price}</Text>
                    </View>
                    <Text style={styles.rideOptionDescription}>{option.description}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            {selectedRide && (
              <Pressable style={styles.requestButton} onPress={handleRequestRide}>
                <Text style={styles.requestButtonText}>Request Ride</Text>
          </Pressable>
            )}
          </View>
        )}

        {/* Map */}
        <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: 34.0007,
          longitude: -81.0348,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {destination && <Marker coordinate={destination} />}
            {stops.map((stop, index) => (
              <Marker key={index} coordinate={stop.location} pinColor="yellow" />
            ))}
        {destination && currentLocation && (
          <Polyline
                coordinates={[
                  currentLocation,
                  ...stops.map(stop => stop.location),
                  destination
                ]}
                strokeColor="#007AFF"
                strokeWidth={3}
          />
        )}
      </MapView>
        </View>
      </View>

      {/* Add Stop Modal */}
      <Modal
        visible={showAddStop}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddStop(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add a Stop</Text>
              <Pressable 
                style={styles.modalCloseButton}
                onPress={() => setShowAddStop(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>
            <GooglePlacesAutocomplete
              placeholder="Search for a stop"
              minLength={2}
              fetchDetails={true}
              onPress={(data, details) => {
                if (details) {
                  const { lat, lng } = details.geometry.location;
                  handleStopSelected(
                    data.structured_formatting.main_text,
                    { latitude: lat, longitude: lng }
                  );
                }
              }}
              query={{
                key: 'AIzaSyCD7fbDDTZTQnX9JrBO8kl0ZEuEcGdGfmA',
                language: 'en',
                components: 'country:us',
                location: '33.9937,-81.0299',
                radius: '50000',
                strictbounds: true,
              }}
              styles={{
                container: styles.modalSearchContainer,
                textInput: styles.modalSearchInput,
                listView: styles.modalSearchResults,
                row: styles.modalSearchRow,
                poweredContainer: { display: 'none' },
              }}
              enablePoweredByContainer={false}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Schedule Ride Modal */}
      <Modal
        visible={showScheduleModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View style={styles.scheduleModalOverlay}>
          <View style={styles.scheduleModalContent}>
            <View style={styles.scheduleModalHeader}>
              <Text style={styles.scheduleModalTitle}>Schedule a Ride</Text>
              <Pressable 
                style={styles.scheduleModalCloseButton}
                onPress={() => setShowScheduleModal(false)}
              >
                <Text style={styles.scheduleModalCloseText}>✕</Text>
              </Pressable>
            </View>

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
              style={styles.scheduleConfirmButton}
              onPress={handleScheduleRide}
            >
              <Text style={styles.scheduleConfirmButtonText}>Schedule Ride</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* FAQ Modal */}
      <Modal
        visible={showFAQs}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFAQs(false)}
      >
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.faqModalSafeArea}>
            <View style={styles.faqModalHeader}>
              <Text style={styles.faqModalTitle}>Frequently Asked Questions</Text>
              <Pressable 
                style={styles.faqModalCloseButton}
                onPress={() => setShowFAQs(false)}
              >
                <Text style={styles.faqModalCloseText}>✕</Text>
            </Pressable>
            </View>
            <ScrollView style={styles.faqModalContent}>
              {faqItems.map((item, index) => (
                <View key={index} style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Payment Options Modal */}
      <PaymentOptionsModal
        visible={showPaymentOptions}
        onClose={() => setShowPaymentOptions(false)}
        rideId={currentRideId || ''}
        totalCost={rideCost}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Side Menu */}
      <SideMenu
        visible={menuVisible}
        onClose={toggleMenu}
        onMenuItemPress={handleMenuItemPress}
        menuAnimation={menuAnimation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003087',
  },
  topSection: {
    backgroundColor: '#003087',
    paddingBottom: 35,
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  menuButton: {
    padding: 5,
  },
  logoText: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 30,
    color: '#fff',
  },
  searchSection: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  searchBarContainer: {
    marginBottom: 20,
  },
  searchContainer: {
    flex: 0,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingLeft: 40,
    height: 50,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  searchRow: {
    padding: 15,
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
    marginTop: -10,
    height: 190,
  },
  suggestionsHidden: {
    display: 'none',
  },
  suggestionsScroll: {
    flex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 25,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 70,
  },
  suggestionPressed: {
    backgroundColor: '#f8f8f8',
    transform: [{ scale: 0.98 }],
  },
  suggestionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  suggestionAddress: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  rideSelectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destinationRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  destinationDot: {
    backgroundColor: '#F44336',
  },
  locationText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  backButton: {
    marginLeft: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
    marginTop: -2,
  },
  rideOptionsContainer: {
    paddingHorizontal: 20,
    height: 230, // Height to show exactly 2.5 options
  },
  rideOptionsScroll: {
    marginBottom: 10,
  },
  rideOption: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rideOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  rideOptionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  rideOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rideOptionContent: {
    flex: 1,
  },
  rideOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  rideOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  rideOptionPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  rideOptionDescription: {
    fontSize: 14,
    color: '#666',
  },
  requestButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  stopRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  stopDot: {
    backgroundColor: '#FFC107',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#003087',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 20,
    color: '#fff',
  },
  modalSearchContainer: {
    flex: 0,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  modalSearchInput: {
    backgroundColor: '#fff',
    borderRadius: 30,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 20,
  },
  modalSearchResults: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    marginTop: 5,
  },
  modalSearchRow: {
    padding: 15,
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
  faqContainer: {
    overflow: 'hidden',
  },
  faqList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  faqItem: {
    marginBottom: 15,
    paddingRight: 10,
  },
  faqQuestion: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  faqAnswer: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 18,
  },
  infoContainer: {
    overflow: 'hidden',
  },
  infoContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  infoText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 15,
  },
  infoSectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
  },
  infoFeature: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
    paddingLeft: 15,
  },
  faqModalSafeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  faqModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  faqModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  faqModalCloseButton: {
    padding: 5,
  },
  faqModalCloseText: {
    fontSize: 20,
    color: '#fff',
  },
  faqModalContent: {
    padding: 10,
  },
});

export default HomeScreen;
