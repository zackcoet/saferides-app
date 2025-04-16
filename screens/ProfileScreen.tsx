import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Image, Platform, Animated, Modal, TextInput, Alert, Linking } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

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

const ProfileScreen = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showDiscountCode, setShowDiscountCode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProblem, setShowProblem] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    zipCode: ''
  });
  const menuAnimation = useRef(new Animated.Value(-280)).current;
  const discountAnimation = useRef(new Animated.Value(0)).current;
  const settingsAnimation = useRef(new Animated.Value(0)).current;
  const profileAnimation = useRef(new Animated.Value(0)).current;
  const problemAnimation = useRef(new Animated.Value(0)).current;
  const infoAnimation = useRef(new Animated.Value(0)).current;
  const privacyAnimation = useRef(new Animated.Value(0)).current;
  const paymentsAnimation = useRef(new Animated.Value(0)).current;
  const feedbackAnimation = useRef(new Animated.Value(0)).current;
  const cardFormAnimation = useRef(new Animated.Value(0)).current;
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@email.sc.edu',
    phone: '(803) 555-0123',
    birthday: '',
    year: 'Freshman',
    major: '',
    profilePicture: null as string | null,
  });

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

  const toggleDiscountCode = () => {
    const toValue = showDiscountCode ? 0 : 1;
    setShowDiscountCode(!showDiscountCode);
    Animated.timing(discountAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleSettings = () => {
    const toValue = showSettings ? 0 : 1;
    setShowSettings(!showSettings);
    Animated.timing(settingsAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleProfile = () => {
    const toValue = showProfile ? 0 : 1;
    setShowProfile(!showProfile);
    Animated.timing(profileAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleProblem = () => {
    const toValue = showProblem ? 0 : 1;
    setShowProblem(!showProblem);
    Animated.timing(problemAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleInfo = () => {
    const toValue = showInfo ? 0 : 1;
    setShowInfo(!showInfo);
    Animated.timing(infoAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const togglePrivacy = () => {
    const toValue = showPrivacy ? 0 : 1;
    setShowPrivacy(!showPrivacy);
    Animated.timing(privacyAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const togglePayments = () => {
    const toValue = showPayments ? 0 : 1;
    setShowPayments(!showPayments);
    Animated.timing(paymentsAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleFeedback = () => {
    const toValue = showFeedback ? 0 : 1;
    setShowFeedback(!showFeedback);
    Animated.timing(feedbackAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleCardForm = () => {
    const toValue = showCardForm ? 0 : 1;
    setShowCardForm(!showCardForm);
    Animated.timing(cardFormAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleProfileChange = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePicture = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleProfileChange('profilePicture', result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    // Check mandatory fields including profile picture
    const mandatoryFields = ['firstName', 'lastName', 'email', 'phone', 'profilePicture'];
    const emptyFields = mandatoryFields.filter(field => !profileData[field as keyof typeof profileData]);

    if (emptyFields.length > 0) {
      const missingFields = emptyFields.map(field => 
        field === 'profilePicture' ? 'Profile Picture' : field
      ).join(', ');
      Alert.alert('Required Fields', `Please fill in all required fields: ${missingFields}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    Alert.alert('Success', 'Profile updated successfully!');
    toggleProfile();
  };

  const handleApplyCode = () => {
    // Example discount codes
    const validCodes = {
      'STUDENT10': 10,
      'WELCOME20': 20,
      'GAMEDAY': 15,
      'USC25': 25
    };

    if (discountCode.trim() === '') {
      Alert.alert('Error', 'Please enter a discount code');
      return;
    }

    const upperCode = discountCode.toUpperCase();
    if (validCodes[upperCode as keyof typeof validCodes]) {
      Alert.alert(
        'Success!', 
        `Discount code applied! You'll get ${validCodes[upperCode as keyof typeof validCodes]}% off your next ride.`
      );
      setDiscountCode('');
      toggleDiscountCode();
    } else {
      Alert.alert('Invalid Code', 'This discount code is not valid or has expired.');
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    switch (method) {
      case 'apple':
        alert('Adding Apple Pay...');
        break;
      case 'google':
        alert('Adding Google Pay...');
        break;
      case 'card':
        toggleCardForm();
        break;
    }
  };

  const handleSubmitFeedback = () => {
    if (feedbackText.trim() === '') {
      Alert.alert('Error', 'Please enter your feedback before submitting.');
      return;
    }
    Alert.alert(
      'Thank You!',
      'Your feedback has been submitted successfully. We appreciate your input to help improve SafeRides.',
      [{ text: 'OK', onPress: () => {
        setFeedbackText('');
        toggleFeedback();
      }}]
    );
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';
    return formatted;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleAddCard = () => {
    // Basic validation
    if (cardDetails.number.replace(/\s/g, '').length !== 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return;
    }
    if (cardDetails.expiry.length !== 5) {
      Alert.alert('Error', 'Please enter a valid expiry date (MM/YY)');
      return;
    }
    if (cardDetails.cvv.length < 3) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return;
    }
    if (cardDetails.zipCode.length < 5) {
      Alert.alert('Error', 'Please enter a valid ZIP code');
      return;
    }

    Alert.alert(
      'Success',
      'Your card has been added successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            setCardDetails({ number: '', expiry: '', cvv: '', zipCode: '' });
            toggleCardForm();
          }
        }
      ]
    );
  };

  const menuItems = [
    { id: 'schedule', title: 'Schedule a Ride', icon: 'calendar' },
    { id: 'faq', title: 'FAQ', icon: 'help-circle' },
    { id: 'payment', title: 'Add Payment Method', icon: 'card' },
  ];

  const handleMenuItemPress = (id: string) => {
    // For FAQ, we want to show the modal immediately without closing the menu first
    if (id === 'faq') {
      setShowFAQ(true);
      toggleMenu();
      return;
    }

    // For other menu items, close the menu first
    toggleMenu();
    
    // Add a small delay before other actions
    setTimeout(() => {
      switch (id) {
        case 'schedule':
          router.push('/');  // Navigate to home screen for scheduling
          break;
        case 'payment':
          togglePayments();
          break;
        case 'logout':
          alert('Logout');
          break;
      }
    }, 300);
  };

  const handleButtonPress = (action: string) => {
    switch (action) {
      case 'profile':
        toggleProfile();
        break;
      case 'gift_card':
        toggleDiscountCode();
        break;
      case 'settings':
        toggleSettings();
        break;
      case 'school_login':
        alert('Log in with school account');
        break;
      case 'payments':
        togglePayments();
        break;
      case 'info':
        toggleInfo();
        break;
      case 'problem':
        toggleProblem();
        break;
      case 'refer':
        alert('Refer a Friend');
        break;
      case 'privacy':
        togglePrivacy();
        break;
      case 'logout':
        alert('Log Out');
        break;
      case 'feedback':
        toggleFeedback();
        break;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.logoText, { marginRight: 0 }]}>SafeRides</Text>
    </View>

        <ScrollView style={styles.content}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            {profileData.profilePicture ? (
              <Image
                source={{ uri: profileData.profilePicture }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={40} color="#999" />
              </View>
            )}
            <Text style={styles.welcomeText}>Hi {profileData.firstName}</Text>
          </View>

          {/* School Login Button */}
          <Pressable
            style={styles.schoolLoginButton}
            onPress={() => handleButtonPress('school_login')}
          >
            <Text style={styles.schoolLoginText}>Log in with school account</Text>
          </Pressable>

          {/* Main Options */}
          <View style={styles.section}>
            {/* Edit Profile Dropdown */}
            <View>
              <Pressable
                style={styles.optionButton}
                onPress={() => handleButtonPress('profile')}
              >
                <View style={styles.optionLeft}>
                  <Ionicons name="person" size={24} color="#003087" />
                  <Text style={styles.optionText}>Edit Profile</Text>
                </View>
                <Animated.View style={{
                  transform: [{
                    rotate: profileAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg']
                    })
                  }]
                }}>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </Animated.View>
              </Pressable>

              {/* Profile Edit Dropdown */}
              <Animated.View style={[
                styles.profileDropdown,
                {
                  maxHeight: profileAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 500]
                  }),
                  opacity: profileAnimation
                }
              ]}>
                <ScrollView style={styles.profileScrollView}>
                  <View style={styles.profileContent}>
                    {/* Profile Picture Section */}
                    <View style={styles.profilePictureSection}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.fieldLabel}>Profile Picture</Text>
                        <Text style={styles.requiredStar}>*</Text>
                      </View>
                      <View style={styles.pictureContainer}>
                        {profileData.profilePicture ? (
                          <Image
                            source={{ uri: profileData.profilePicture }}
                            style={styles.profilePicturePreview}
                          />
                        ) : (
                          <View style={styles.profilePicturePlaceholder}>
                            <Ionicons name="person" size={40} color="#999" />
                          </View>
                        )}
                        <Pressable
                          style={styles.uploadButton}
                          onPress={handleProfilePicture}
                        >
                          <Ionicons name="camera" size={20} color="#fff" />
                          <Text style={styles.uploadButtonText}>
                            {profileData.profilePicture ? 'Change Picture' : 'Upload Picture'}
                          </Text>
                        </Pressable>
                      </View>
                    </View>

                    {/* First Name */}
                    <View style={styles.profileField}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.fieldLabel}>First Name</Text>
                        <Text style={styles.requiredStar}>*</Text>
                      </View>
                      <TextInput
                        style={styles.fieldInput}
                        value={profileData.firstName}
                        onChangeText={(value) => handleProfileChange('firstName', value)}
                        placeholder="Enter first name"
                        placeholderTextColor="#666"
                      />
                    </View>

                    {/* Last Name */}
                    <View style={styles.profileField}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.fieldLabel}>Last Name</Text>
                        <Text style={styles.requiredStar}>*</Text>
                      </View>
                      <TextInput
                        style={styles.fieldInput}
                        value={profileData.lastName}
                        onChangeText={(value) => handleProfileChange('lastName', value)}
                        placeholder="Enter last name"
                        placeholderTextColor="#666"
                      />
                    </View>

                    {/* School Email */}
                    <View style={styles.profileField}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.fieldLabel}>School Email</Text>
                        <Text style={styles.requiredStar}>*</Text>
                      </View>
                      <TextInput
                        style={styles.fieldInput}
                        value={profileData.email}
                        onChangeText={(value) => handleProfileChange('email', value)}
                        placeholder="Enter school email"
                        placeholderTextColor="#666"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>

                    {/* Phone Number */}
                    <View style={styles.profileField}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.fieldLabel}>Phone Number</Text>
                        <Text style={styles.requiredStar}>*</Text>
                      </View>
                      <TextInput
                        style={styles.fieldInput}
                        value={profileData.phone}
                        onChangeText={(value) => handleProfileChange('phone', value)}
                        placeholder="Enter phone number"
                        placeholderTextColor="#666"
                        keyboardType="phone-pad"
                      />
                    </View>

                    {/* Birthday */}
                    <View style={styles.profileField}>
                      <Text style={styles.fieldLabel}>Birthday</Text>
                      <TextInput
                        style={styles.fieldInput}
                        value={profileData.birthday}
                        onChangeText={(value) => handleProfileChange('birthday', value)}
                        placeholder="MM/DD/YYYY"
                        placeholderTextColor="#666"
                        keyboardType="numbers-and-punctuation"
                      />
                    </View>

                    {/* Year */}
                    <View style={styles.profileField}>
                      <Text style={styles.fieldLabel}>Year</Text>
                      <View style={styles.yearContainer}>
                        {['Freshman', 'Sophomore', 'Junior', 'Senior'].map((year) => (
                          <Pressable
                            key={year}
                            style={[
                              styles.yearButton,
                              profileData.year === year && styles.yearButtonActive
                            ]}
                            onPress={() => handleProfileChange('year', year)}
                          >
                            <Text style={[
                              styles.yearButtonText,
                              profileData.year === year && styles.yearButtonTextActive
                            ]}>
                              {year}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>

                    {/* Major */}
                    <View style={styles.profileField}>
                      <Text style={styles.fieldLabel}>Major</Text>
                      <TextInput
                        style={styles.fieldInput}
                        value={profileData.major}
                        onChangeText={(value) => handleProfileChange('major', value)}
                        placeholder="Enter your major"
                        placeholderTextColor="#666"
                      />
                    </View>

                    {/* Save Button */}
                    <View style={styles.saveButtonContainer}>
                      <Pressable 
                        style={styles.saveButton}
                        onPress={handleSaveProfile}
                      >
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                      </Pressable>
                    </View>
                  </View>
                </ScrollView>
              </Animated.View>
            </View>
            <Pressable
              style={styles.optionButton}
              onPress={togglePayments}
            >
              <View style={styles.optionLeft}>
                <Ionicons name="card" size={24} color="#003087" />
                <Text style={styles.optionText}>Add Payment Method</Text>
              </View>
              <Animated.View style={{
                transform: [{
                  rotate: paymentsAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              }}>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </Animated.View>
            </Pressable>

            {/* Payment Methods Dropdown */}
            <Animated.View style={[
              styles.paymentsDropdown,
              {
                maxHeight: paymentsAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 200]
                }),
                opacity: paymentsAnimation
              }
            ]}>
              <View style={styles.paymentsContent}>
                <Pressable 
                  style={styles.paymentOption}
                  onPress={() => handlePaymentMethodSelect('apple')}
                >
                  <View style={styles.paymentOptionLeft}>
                    <Ionicons name="logo-apple" size={24} color="#000" />
                    <Text style={styles.paymentOptionText}>Apple Pay</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </Pressable>

                <Pressable 
                  style={styles.paymentOption}
                  onPress={() => handlePaymentMethodSelect('google')}
                >
                  <View style={styles.paymentOptionLeft}>
                    <Ionicons name="logo-google" size={24} color="#4285F4" />
                    <Text style={styles.paymentOptionText}>Google Pay</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </Pressable>

                <Pressable 
                  style={styles.paymentOption}
                  onPress={() => handlePaymentMethodSelect('card')}
                >
                  <View style={styles.paymentOptionLeft}>
                    <Ionicons name="card" size={24} color="#003087" />
                    <Text style={styles.paymentOptionText}>Add credit or debit card</Text>
                  </View>
                  <Animated.View style={{
                    transform: [{
                      rotate: cardFormAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg']
                      })
                    }]
                  }}>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                  </Animated.View>
                </Pressable>
              </View>
            </Animated.View>

            {/* Credit Card Form Dropdown */}
            <Animated.View style={[
              styles.cardFormDropdown,
              {
                maxHeight: cardFormAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 300]
                }),
                opacity: cardFormAnimation
              }
            ]}>
              <ScrollView 
                style={styles.cardFormContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.cardFormScrollContent}
              >
                <View style={styles.cardField}>
                  <Text style={styles.cardFieldLabel}>Card Number</Text>
                  <TextInput
                    style={styles.cardInput}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={19}
                    value={cardDetails.number}
                    onChangeText={(text) => setCardDetails(prev => ({
                      ...prev,
                      number: formatCardNumber(text)
                    }))}
                  />
                </View>

                <View style={styles.cardRowFields}>
                  <View style={[styles.cardField, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.cardFieldLabel}>Expiry Date</Text>
                    <TextInput
                      style={styles.cardInput}
                      placeholder="MM/YY"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={5}
                      value={cardDetails.expiry}
                      onChangeText={(text) => setCardDetails(prev => ({
                        ...prev,
                        expiry: formatExpiry(text)
                      }))}
                    />
                  </View>

                  <View style={[styles.cardField, { flex: 1 }]}>
                    <Text style={styles.cardFieldLabel}>CVV</Text>
                    <TextInput
                      style={styles.cardInput}
                      placeholder="123"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={4}
                      value={cardDetails.cvv}
                      onChangeText={(text) => setCardDetails(prev => ({
                        ...prev,
                        cvv: text
                      }))}
                    />
                  </View>
                </View>

                <View style={styles.cardField}>
                  <Text style={styles.cardFieldLabel}>ZIP Code</Text>
                  <TextInput
                    style={styles.cardInput}
                    placeholder="12345"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={5}
                    value={cardDetails.zipCode}
                    onChangeText={(text) => setCardDetails(prev => ({
                      ...prev,
                      zipCode: text
                    }))}
                  />
                </View>

                <Pressable
                  style={styles.addCardButton}
                  onPress={handleAddCard}
                >
                  <Text style={styles.addCardButtonText}>Add Card</Text>
                </Pressable>
              </ScrollView>
            </Animated.View>

            <Pressable
              style={styles.optionButton}
              onPress={() => handleButtonPress('info')}
            >
              <View style={styles.optionLeft}>
                <Ionicons name="information-circle" size={24} color="#003087" />
                <Text style={styles.optionText}>Info</Text>
              </View>
              <Animated.View style={{
                transform: [{
                  rotate: infoAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              }}>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </Animated.View>
            </Pressable>
            {/* Info Dropdown */}
            <Animated.View style={[
              styles.infoDropdown,
              {
                maxHeight: infoAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 400]
                }),
                opacity: infoAnimation
              }
            ]}>
              <ScrollView 
                style={styles.infoScrollView}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>SafeRides</Text>
                  <Text style={styles.infoText}>
                    SafeRides is a student-run transportation service at the University of South Carolina, 
                    providing safe and reliable rides for students within the campus area.
                  </Text>
                  <Text style={styles.infoText}>
                    Founded in 2023, our mission is to ensure every student has access to safe transportation, 
                    especially during late hours.
                  </Text>
                  <Text style={styles.infoFeatures}>Key Features:</Text>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#003087" />
                    <Text style={styles.featureText}>24/7 Safe Transportation</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#003087" />
                    <Text style={styles.featureText}>Student Drivers</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#003087" />
                    <Text style={styles.featureText}>Campus Coverage</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#003087" />
                    <Text style={styles.featureText}>Real-time Tracking</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#003087" />
                    <Text style={styles.featureText}>Secure Payment Options</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#003087" />
                    <Text style={styles.featureText}>In-app Chat Support</Text>
                  </View>
                  <Text style={styles.infoSubtitle}>Service Hours</Text>
                  <Text style={styles.infoText}>
                    Monday - Thursday: 8:00 PM - 3:00 AM{'\n'}
                    Friday - Saturday: 8:00 PM - 4:00 AM{'\n'}
                    Sunday: 8:00 PM - 2:00 AM
                  </Text>
                  <Text style={styles.infoSubtitle}>Coverage Area</Text>
                  <Text style={styles.infoText}>
                    We operate within the USC campus area and popular student destinations including Five Points, 
                    The Vista, and Williams Brice Stadium.
                  </Text>
                  <Text style={styles.infoVersion}>Version 1.0.0</Text>
                </View>
              </ScrollView>
            </Animated.View>
            <View>
              <Pressable
                style={styles.optionButton}
                onPress={() => handleButtonPress('problem')}
              >
                <View style={styles.optionLeft}>
                  <Ionicons name="warning" size={24} color="#003087" />
                  <Text style={styles.optionText}>Problem</Text>
                </View>
                <Animated.View style={{
                  transform: [{
                    rotate: problemAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg']
                    })
                  }]
                }}>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </Animated.View>
              </Pressable>

              {/* Problem Dropdown */}
              <Animated.View style={[
                styles.problemDropdown,
                {
                  maxHeight: problemAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 250]
                  }),
                  opacity: problemAnimation
                }
              ]}>
                <View style={styles.problemContent}>
                  <Text style={styles.problemTitle}>Need help?</Text>
                  
                  {/* FAQ Option */}
                  <Pressable 
                    style={styles.problemOption}
                    onPress={() => {
                      toggleProblem();
                      setShowFAQ(true);
                    }}
                  >
                    <View style={styles.problemOptionLeft}>
                      <Ionicons name="help-circle" size={24} color="#003087" />
                      <Text style={styles.problemOptionText}>Check our FAQ</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                  </Pressable>

                  {/* Phone Option */}
                  <Pressable 
                    style={styles.problemOption}
                    onPress={() => Linking.openURL('tel:3327336922')}
                  >
                    <View style={styles.problemOptionLeft}>
                      <Ionicons name="call" size={24} color="#003087" />
                      <Text style={styles.problemOptionText}>Call Support</Text>
                    </View>
                    <Text style={styles.problemContactText}>332 733 6922</Text>
                  </Pressable>

                  {/* Email Option */}
                  <Pressable 
                    style={styles.problemOption}
                    onPress={() => Linking.openURL('mailto:support@saferides.com')}
                  >
                    <View style={styles.problemOptionLeft}>
                      <Ionicons name="mail" size={24} color="#003087" />
                      <Text style={styles.problemOptionText}>Email Support</Text>
                    </View>
                    <Text style={styles.problemContactText}>support@saferides.com</Text>
                  </Pressable>
                </View>
              </Animated.View>
            </View>
            <Pressable
              style={styles.optionButton}
              onPress={() => handleButtonPress('gift_card')}
            >
              <View style={styles.optionLeft}>
                <Ionicons name="gift" size={24} color="#003087" />
                <Text style={styles.optionText}>Discount code</Text>
              </View>
              <Animated.View style={{
                transform: [{
                  rotate: discountAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              }}>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </Animated.View>
            </Pressable>

            {/* Discount Code Dropdown */}
            <Animated.View style={[
              styles.discountDropdown,
              {
                maxHeight: discountAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 300]
                }),
                opacity: discountAnimation
              }
            ]}>
              <View style={styles.discountContent}>
                <TextInput
                  style={styles.discountInput}
                  value={discountCode}
                  onChangeText={setDiscountCode}
                  placeholder="Enter discount code"
                  placeholderTextColor="#666"
                />
                <Pressable
                  style={styles.applyButton}
                  onPress={handleApplyCode}
                >
                  <Text style={styles.applyButtonText}>Apply Code</Text>
                </Pressable>
                <View style={styles.discountList}>
                  <Text style={styles.discountTitle}>Available Discounts:</Text>
                  <View style={styles.discountItem}>
                    <Ionicons name="pricetag" size={20} color="#003087" />
                    <Text style={styles.discountItemText}>STUDENT10 - 10% off your next ride</Text>
                  </View>
                  <View style={styles.discountItem}>
                    <Ionicons name="pricetag" size={20} color="#003087" />
                    <Text style={styles.discountItemText}>WELCOME20 - 20% off for new users</Text>
                  </View>
                  <View style={styles.discountItem}>
                    <Ionicons name="pricetag" size={20} color="#003087" />
                    <Text style={styles.discountItemText}>GAMEDAY - 15% off on game days</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>

          {/* Privacy Section */}
          <View>
            <Pressable
              style={styles.optionButton}
              onPress={() => handleButtonPress('privacy')}
            >
              <View style={styles.optionLeft}>
                <Ionicons name="lock-closed" size={24} color="#003087" />
                <Text style={styles.optionText}>Privacy</Text>
              </View>
              <Animated.View style={{
                transform: [{
                  rotate: privacyAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              }}>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </Animated.View>
            </Pressable>

            {/* Add Feedback Button */}
            <Pressable
              style={styles.optionButton}
              onPress={() => handleButtonPress('feedback')}
            >
              <View style={styles.optionLeft}>
                <Ionicons name="chatbox-ellipses" size={24} color="#003087" />
                <Text style={styles.optionText}>Give feedback for improvement</Text>
              </View>
              <Animated.View style={{
                transform: [{
                  rotate: feedbackAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              }}>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </Animated.View>
            </Pressable>

            {/* Privacy Dropdown */}
            <Animated.View style={[
              styles.privacyDropdown,
              {
                maxHeight: privacyAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 400]
                }),
                opacity: privacyAnimation
              }
            ]}>
              <ScrollView
                style={styles.privacyScrollView}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.privacyContent}>
                  <Text style={styles.privacyTitle}>Privacy Settings</Text>
                  
                  {/* Location Services */}
                  <View style={styles.privacySection}>
                    <Text style={styles.privacySubtitle}>Location Services</Text>
                    <View style={styles.privacyOption}>
                      <View style={styles.privacyOptionLeft}>
                        <Ionicons name="location" size={24} color="#003087" />
                        <View>
                          <Text style={styles.privacyOptionTitle}>Location Access</Text>
                          <Text style={styles.privacyOptionDescription}>Allow access while using the app</Text>
                        </View>
                      </View>
                      <View style={[styles.toggle, darkMode && styles.toggleActive]}>
                        <View style={[styles.toggleCircle, darkMode && styles.toggleCircleActive]} />
                      </View>
                    </View>
                  </View>

                  {/* Data Sharing */}
                  <View style={styles.privacySection}>
                    <Text style={styles.privacySubtitle}>Data Sharing</Text>
                    <View style={styles.privacyOption}>
                      <View style={styles.privacyOptionLeft}>
                        <Ionicons name="analytics" size={24} color="#003087" />
                        <View>
                          <Text style={styles.privacyOptionTitle}>Analytics</Text>
                          <Text style={styles.privacyOptionDescription}>Help improve SafeRides</Text>
                        </View>
                      </View>
                      <View style={[styles.toggle, notifications && styles.toggleActive]}>
                        <View style={[styles.toggleCircle, notifications && styles.toggleCircleActive]} />
                      </View>
                    </View>
                  </View>

                  {/* Privacy Policy */}
                  <View style={styles.privacySection}>
                    <Text style={styles.privacySubtitle}>Privacy Policy</Text>
                    <Text style={styles.privacyText}>
                      Your privacy is important to us. We only collect and use information that is necessary 
                      to provide you with safe and reliable transportation services.
                    </Text>
                    <Text style={styles.privacyText}>
                      We use your location data only while you are using the app to:
                    </Text>
                    <View style={styles.bulletPoints}>
                      <Text style={styles.bulletPoint}>• Match you with nearby drivers</Text>
                      <Text style={styles.bulletPoint}>• Provide accurate pickup and dropoff</Text>
                      <Text style={styles.bulletPoint}>• Ensure your safety during rides</Text>
                    </View>
                    <Text style={styles.privacyText}>
                      Your personal information is encrypted and securely stored. We never share your data 
                      with third parties without your explicit consent.
                    </Text>
                  </View>

                  {/* Data Management */}
                  <View style={styles.privacySection}>
                    <Text style={styles.privacySubtitle}>Data Management</Text>
                    <Pressable style={styles.privacyButton}>
                      <Text style={styles.privacyButtonText}>Download My Data</Text>
                    </Pressable>
                    <Pressable style={[styles.privacyButton, styles.privacyButtonDanger]}>
                      <Text style={styles.privacyButtonTextDanger}>Delete My Account</Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            </Animated.View>
          </View>

          {/* Settings Section */}
          <View>
            <Pressable
              style={styles.optionButton}
              onPress={() => handleButtonPress('settings')}
            >
              <View style={styles.optionLeft}>
                <Ionicons name="settings" size={24} color="#003087" />
                <Text style={styles.optionText}>Settings</Text>
              </View>
              <Animated.View style={{
                transform: [{
                  rotate: settingsAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              }}>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </Animated.View>
            </Pressable>

            {/* Settings Dropdown Content */}
            <Animated.View style={[
              styles.settingsDropdown,
              {
                maxHeight: settingsAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 300]
                }),
                opacity: settingsAnimation
              }
            ]}>
              <View style={styles.settingsContent}>
                {/* Dark Mode Toggle */}
                <Pressable 
                  style={styles.settingItem}
                  onPress={() => setDarkMode(!darkMode)}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons name={darkMode ? "moon" : "moon-outline"} size={24} color="#003087" />
                    <Text style={styles.settingText}>Dark Mode</Text>
                  </View>
                  <View style={[styles.toggle, darkMode && styles.toggleActive]}>
                    <View style={[styles.toggleCircle, darkMode && styles.toggleCircleActive]} />
                  </View>
                </Pressable>

                {/* Notifications Toggle */}
                <Pressable 
                  style={styles.settingItem}
                  onPress={() => setNotifications(!notifications)}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons name={notifications ? "notifications" : "notifications-off"} size={24} color="#003087" />
                    <Text style={styles.settingText}>Notifications</Text>
                  </View>
                  <View style={[styles.toggle, notifications && styles.toggleActive]}>
                    <View style={[styles.toggleCircle, notifications && styles.toggleCircleActive]} />
                  </View>
                </Pressable>

                {/* Language Selection */}
                <Pressable style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="language" size={24} color="#003087" />
                    <Text style={styles.settingText}>Language</Text>
                  </View>
                  <View style={styles.settingRight}>
                    <Text style={styles.settingValue}>English</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                  </View>
                </Pressable>
              </View>
            </Animated.View>
          </View>

          {/* Feedback Dropdown */}
          <Animated.View style={[
            styles.feedbackDropdown,
            {
              maxHeight: feedbackAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 300]
              }),
              opacity: feedbackAnimation
            }
          ]}>
            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackTitle}>We value your feedback!</Text>
              <Text style={styles.feedbackSubtitle}>
                Help us improve SafeRides by sharing your thoughts, suggestions, or reporting any issues.
              </Text>
              <TextInput
                style={styles.feedbackInput}
                multiline
                numberOfLines={4}
                placeholder="Type your feedback here..."
                placeholderTextColor="#666"
                value={feedbackText}
                onChangeText={setFeedbackText}
              />
              <Pressable
                style={styles.submitButton}
                onPress={handleSubmitFeedback}
              >
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Logout Button */}
          <View style={styles.logoutSection}>
            <Pressable
              style={styles.logoutButton}
              onPress={() => handleButtonPress('logout')}
            >
              <View style={styles.optionLeft}>
                <Ionicons name="log-out" size={24} color="#ff3b30" />
                <Text style={styles.logoutText}>Log out</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ff3b30" />
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
          <Link href="/trips" asChild>
            <Pressable style={styles.navItem}>
              <Text style={styles.navText}>Trips</Text>
            </Pressable>
          </Link>
          <Pressable style={styles.navItem}>
            <Text style={[styles.navText, { color: '#007AFF' }]}>Profile</Text>
          </Pressable>
        </View>

        {/* Side Menu Modal */}
        <Modal
          visible={menuVisible}
          transparent={true}
          animationType="none"
          onRequestClose={toggleMenu}
        >
          <View style={styles.menuModalContainer}>
            <Pressable
              style={styles.menuModalOverlay}
              onPress={toggleMenu}
            />
            <Animated.View 
              style={[
                styles.menuContent,
                {
                  transform: [{ translateX: menuAnimation }]
                }
              ]}
            >
              <SafeAreaView style={styles.menuSafeArea}>
                <View style={styles.menuHeader}>
                  <Text style={styles.menuHeaderText}>Menu</Text>
                </View>
                
                <View style={styles.menuItems}>
                  {menuItems.map((item) => (
                    <Pressable
                      key={item.id}
                      style={({ pressed }) => [
                        styles.menuItem,
                        pressed && styles.menuItemPressed
                      ]}
                      onPress={() => handleMenuItemPress(item.id)}
                    >
                      <Ionicons name={item.icon as any} size={24} color="#fff" />
                      <Text style={styles.menuItemText}>{item.title}</Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.menuFooter}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.menuItem,
                      styles.logoutButton,
                      pressed && styles.menuItemPressed
                    ]}
                    onPress={() => handleMenuItemPress('logout')}
                  >
                    <Ionicons name="log-out" size={24} color="#ff3b30" />
                    <Text style={[styles.menuItemText, styles.logoutText]}>Log Out</Text>
                  </Pressable>
                </View>
              </SafeAreaView>
            </Animated.View>
          </View>
        </Modal>

        {/* FAQ Modal */}
        <Modal
          visible={showFAQ}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowFAQ(false)}
        >
          <View style={styles.faqModalContainer}>
            <SafeAreaView style={styles.faqModalSafeArea}>
              <View style={styles.faqModalHeader}>
                <Text style={styles.faqModalTitle}>Frequently Asked Questions</Text>
                <Pressable 
                  style={styles.faqModalCloseButton}
                  onPress={() => setShowFAQ(false)}
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
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#003087',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#003087',
    marginBottom: 8,
  },
  schoolLoginButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  schoolLoginText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ff3b30',
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
  menuModalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  menuModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContent: {
    width: 280,
    backgroundColor: '#1a1a1a',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  menuSafeArea: {
    flex: 1,
  },
  menuHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuHeaderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
  },
  menuItemPressed: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  menuFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 20,
  },
  faqModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  faqModalSafeArea: {
    flex: 1,
  },
  faqModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#003087',
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
    fontSize: 24,
    color: '#fff',
  },
  faqModalContent: {
    flex: 1,
    padding: 20,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  discountDropdown: {
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  discountContent: {
    padding: 16,
  },
  discountInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  applyButton: {
    backgroundColor: '#003087',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  discountList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  discountTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  discountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountItemText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 14,
  },
  settingsDropdown: {
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  settingsContent: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginBottom: 1,
    borderRadius: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#003087',
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    transform: [{ translateX: 0 }],
  },
  toggleCircleActive: {
    transform: [{ translateX: 20 }],
  },
  profileDropdown: {
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  profileContent: {
    padding: 16,
  },
  profileField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#003087',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requiredStar: {
    color: '#ff3b30',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  yearContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  yearButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  yearButtonActive: {
    backgroundColor: '#003087',
    borderColor: '#003087',
  },
  yearButtonText: {
    fontSize: 14,
    color: '#666',
  },
  yearButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  problemDropdown: {
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  problemContent: {
    padding: 16,
  },
  problemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  problemOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  problemOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  problemOptionText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  problemContactText: {
    fontSize: 14,
    color: '#666',
  },
  infoDropdown: {
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  infoScrollView: {
    flexGrow: 0,
  },
  infoContent: {
    padding: 16,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 12,
  },
  infoSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003087',
    marginTop: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoFeatures: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003087',
    marginTop: 16,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  infoVersion: {
    fontSize: 12,
    color: '#666',
    marginTop: 24,
    textAlign: 'center',
  },
  privacyDropdown: {
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  privacyScrollView: {
    flexGrow: 0,
  },
  privacyContent: {
    padding: 16,
  },
  privacyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 16,
  },
  privacySection: {
    marginBottom: 24,
  },
  privacySubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003087',
    marginBottom: 12,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  privacyOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  privacyOptionTitle: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  privacyOptionDescription: {
    fontSize: 12,
    color: '#666',
    marginLeft: 12,
  },
  privacyText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletPoints: {
    marginLeft: 8,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  privacyButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#003087',
  },
  privacyButtonText: {
    color: '#003087',
    fontSize: 16,
    fontWeight: '600',
  },
  privacyButtonDanger: {
    borderColor: '#ff3b30',
  },
  privacyButtonTextDanger: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
  profilePictureSection: {
    marginBottom: 24,
  },
  pictureContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  profilePicturePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003087',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  profileScrollView: {
    maxHeight: 500,
  },
  logoutSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paymentsDropdown: {
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  paymentsContent: {
    padding: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  feedbackDropdown: {
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  feedbackContent: {
    padding: 16,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003087',
    marginBottom: 8,
  },
  feedbackSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  feedbackInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    height: 120,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#003087',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardFormDropdown: {
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  cardFormContent: {
    flexGrow: 0,
  },
  cardFormScrollContent: {
    padding: 16,
  },
  cardField: {
    marginBottom: 16,
  },
  cardFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  cardInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardRowFields: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  addCardButton: {
    backgroundColor: '#003087',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addCardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;

