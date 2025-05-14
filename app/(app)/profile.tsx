import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import UserService, { UserProfile, UserSettings } from '../../services/UserService';

export default function ProfileScreen() {
  const router = useRouter();
  const userService = UserService.getInstance();
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    username: '',
    birthday: '',
    year: '',
    major: '',
    gender: '',
    profilePicture: ''
  });
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    notifications: true
  });
  const [feedback, setFeedback] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileUpdate = async (updates: Partial<UserProfile>) => {
    const success = await userService.updateUserProfile(updates);
    if (success) {
      setProfile(prev => ({ ...prev, ...updates }));
      setIsEditing(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const uploadedUri = await userService.uploadProfilePicture(imageUri);
        if (uploadedUri) {
          handleProfileUpdate({ profilePicture: uploadedUri });
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleSettingsChange = async (setting: keyof UserSettings, value: boolean) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    await userService.updateUserSettings({ [setting]: value });
  };

  const handleFeedbackSubmit = async () => {
    if (feedback.trim()) {
      const success = await userService.submitFeedback(feedback);
      if (success) {
        setFeedback('');
        // Show success message
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleImagePick}>
            <View style={styles.profileImageContainer}>
              {profile.profilePicture ? (
                <Image
                  source={{ uri: profile.profilePicture }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={40} color="#666" />
                </View>
              )}
              <View style={styles.editImageButton}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profile.firstName} {profile.lastName}
            </Text>
            <Text style={styles.profileUsername}>@{profile.username}</Text>
          </View>
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={profile.firstName}
              onChangeText={(text) => setProfile(prev => ({ ...prev, firstName: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={profile.lastName}
              onChangeText={(text) => setProfile(prev => ({ ...prev, lastName: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={profile.username}
              onChangeText={(text) => setProfile(prev => ({ ...prev, username: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={profile.phoneNumber}
              onChangeText={(text) => setProfile(prev => ({ ...prev, phoneNumber: text }))}
              keyboardType="phone-pad"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={() => handleProfileUpdate(profile)}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingItem}>
          <Text>Dark Mode</Text>
          <Switch
            value={settings.darkMode}
            onValueChange={(value) => handleSettingsChange('darkMode', value)}
          />
        </View>
        <View style={styles.settingItem}>
          <Text>Notifications</Text>
          <Switch
            value={settings.notifications}
            onValueChange={(value) => handleSettingsChange('notifications', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <TextInput
          style={styles.feedbackInput}
          multiline
          numberOfLines={4}
          placeholder="Share your thoughts..."
          value={feedback}
          onChangeText={setFeedback}
        />
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={handleFeedbackSubmit}
        >
          <Text style={styles.feedbackButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333'
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    minHeight: 100,
    textAlignVertical: 'top'
  },
  feedbackButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  feedbackButtonText: {
    color: 'white',
    fontWeight: '600'
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center'
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333'
  },
  profileUsername: {
    fontSize: 16,
    color: '#666',
    marginTop: 4
  },
  editForm: {
    marginTop: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8
  },
  cancelButton: {
    backgroundColor: '#f2f2f2'
  },
  saveButton: {
    backgroundColor: '#007AFF'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
}); 