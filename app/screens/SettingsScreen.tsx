import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import UserService from '../../services/UserService';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
}) => (
  <Pressable
    style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
    onPress={onPress}
  >
    <View style={styles.itemContent}>
      <View style={styles.itemIcon}>
        <Ionicons name={icon as any} size={24} color="#fff" />
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {rightElement || (
      <Ionicons name="chevron-forward" size={20} color="#666" />
    )}
  </Pressable>
);

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const [settings, setSettings] = useState({
    wheelchairAccess: false,
    darkMode: false,
    notifications: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await UserService.getInstance().getUserSettings();
      if (userSettings) {
        setSettings(userSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleSettingChange = async (key: string, value: boolean) => {
    try {
      setSettings(prev => ({ ...prev, [key]: value }));
      await UserService.getInstance().updateUserSettings({ [key]: value });
    } catch (error) {
      console.error('Error updating setting:', error);
      Alert.alert('Error', 'Failed to update setting. Please try again.');
      // Revert the change if it failed
      setSettings(prev => ({ ...prev, [key]: !value }));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const navigateToEditProfile = () => router.push('/edit-profile');
  const navigateToEditEmail = () => router.push('/edit-email');
  const navigateToEditPhone = () => router.push('/edit-phone');
  const navigateToPayment = () => router.push('/payment');
  const navigateToNotifications = () => router.push('/notifications');
  const navigateToHelp = () => router.push('/help');
  const navigateToSafety = () => router.push('/safety');
  const navigateToSecurity = () => router.push('/security');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <SettingsSection>
          <SettingsItem
            icon="person-circle"
            title="Edit Profile"
            onPress={navigateToEditProfile}
          />
          <SettingsItem
            icon="mail"
            title="Change Email"
            onPress={navigateToEditEmail}
          />
          <SettingsItem
            icon="call"
            title="Change Phone"
            onPress={navigateToEditPhone}
          />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsItem
            icon="accessibility"
            title="Wheelchair access"
            rightElement={
              <Switch
                value={settings.wheelchairAccess}
                onValueChange={(value) => handleSettingChange('wheelchairAccess', value)}
                trackColor={{ false: '#3e3e3e', true: '#003087' }}
                thumbColor={settings.wheelchairAccess ? '#fff' : '#fff'}
              />
            }
          />
          <SettingsItem
            icon="moon"
            title="Dark mode"
            rightElement={
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => handleSettingChange('darkMode', value)}
                trackColor={{ false: '#3e3e3e', true: '#003087' }}
                thumbColor={settings.darkMode ? '#fff' : '#fff'}
              />
            }
          />
          <SettingsItem
            icon="notifications"
            title="Notifications"
            rightElement={
              <Switch
                value={settings.notifications}
                onValueChange={(value) => handleSettingChange('notifications', value)}
                trackColor={{ false: '#3e3e3e', true: '#003087' }}
                thumbColor={settings.notifications ? '#fff' : '#fff'}
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Safety & Security">
          <SettingsItem
            icon="shield-checkmark"
            title="Safety tools"
            onPress={navigateToSafety}
          />
          <SettingsItem
            icon="lock-closed"
            title="Security center"
            onPress={navigateToSecurity}
          />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsItem
            icon="card"
            title="Payment methods"
            onPress={navigateToPayment}
          />
          <SettingsItem
            icon="help-circle"
            title="Help & Support"
            onPress={navigateToHelp}
          />
          <SettingsItem
            icon="log-out"
            title="Sign Out"
            onPress={handleSignOut}
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 15,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  sectionContent: {
    backgroundColor: '#2a2a2a',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  itemPressed: {
    backgroundColor: '#333',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: '#fff',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default SettingsScreen; 