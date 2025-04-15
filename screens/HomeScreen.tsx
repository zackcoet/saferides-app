import 'react-native-get-random-values';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform, SafeAreaView, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

interface Location {
  latitude: number;
  longitude: number;
}

interface RideOption {
  id: string;
  title: string;
  price: string;
  description: string;
}

interface Suggestion {
  id: string;
  name: string;
}

interface GooglePlaceDetails {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const suggestions: Suggestion[] = [
  { id: '1', name: 'Williams Brice Stadium' },
  { id: '2', name: '5 Points' },
  { id: '3', name: 'Vista' },
];

const rideOptions: RideOption[] = [
  { id: '1', title: 'Safe Ride', price: '$10', description: 'Get to a location for flat rate' },
  { id: '2', title: 'Safe Ride (Female Driver)', price: '$10', description: 'SafeRide only for women and by women' },
  { id: '3', title: 'Safe Ride (Name your price)', price: '$---', description: 'Rider chooses price' },
  { id: '4', title: 'Charlotte Airport', price: '$150', description: 'Flat rate to CLT Airport' },
];

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleSuggestionPress = async (place: string) => {
    const res = await Location.geocodeAsync(place);
    if (res.length) {
      const { latitude, longitude } = res[0];
      setDestination({ latitude, longitude });
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleCancel = () => {
    setDestination(null);
    setSelectedRide(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
        <Text style={styles.logoText}>SafeRides</Text>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.title}>WHERE ARE YOU GOING TODAY?</Text>
        <View style={styles.searchBarContainer}>
          <GooglePlacesAutocomplete
            placeholder="Enter destination"
            minLength={2}
            fetchDetails={true}
            onPress={(data, details) => {
              if (details) {
                const { lat, lng } = details.geometry.location;
                setDestination({ latitude: lat, longitude: lng });
                mapRef.current?.animateToRegion({
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
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

        {/* Quick Suggestions */}
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item) => (
            <Pressable
              key={item.id}
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(item.name)}
            >
              <Ionicons name="location" size={24} color="#007AFF" />
              <Text style={styles.suggestionText}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

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
          {destination && currentLocation && (
            <Polyline
              coordinates={[currentLocation, destination]}
              strokeColor="#000"
              strokeWidth={4}
            />
          )}
        </MapView>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <Ionicons name="car" size={24} color="#007AFF" />
          <Text style={[styles.navText, { color: '#007AFF' }]}>Rides</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/trips')}>
          <Ionicons name="list" size={24} color="#999999" />
          <Text style={styles.navText}>Trips</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/profile')}>
          <Ionicons name="person" size={24} color="#999999" />
          <Text style={styles.navText}>Profile</Text>
        </Pressable>
      </View>

      {/* Ride Options and Cancel Button */}
      {destination && (
        <View style={styles.optionsContainer}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          {rideOptions.map((option) => (
            <Pressable
              key={option.id}
              style={[
                styles.optionButton,
                selectedRide?.id === option.id && styles.optionSelected,
              ]}
              onPress={() => setSelectedRide(option)}
            >
              <Text style={styles.optionText}>{option.title} - {option.price}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </Pressable>
          ))}
          {selectedRide && (
            <Pressable style={styles.requestButton} onPress={() => alert('Ride requested!')}>
              <Text style={styles.requestText}>Request Ride</Text>
            </Pressable>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003087',
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
    marginTop: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 30,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
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
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#999999',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cancelButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
  cancelButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '500',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: '#e3f2fd',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  requestButton: {
    backgroundColor: '#007aff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  requestText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
