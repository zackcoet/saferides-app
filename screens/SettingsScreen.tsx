import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
  const [wheelchairAccess, setWheelchairAccess] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const navigateToEditProfile = () => {
    router.push('/edit-profile');
  };

  const navigateToEditEmail = () => {
    router.push('/edit-email');
  };

  const navigateToEditPhone = () => {
    router.push('/edit-phone');
  };

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
            title="Zack"
            onPress={navigateToEditProfile}
          />
          <SettingsItem
            icon="mail"
            title="zackcoetzee123@gmail.com"
            onPress={navigateToEditEmail}
          />
          <SettingsItem
            icon="call"
            title="+1 332-733-6922"
            onPress={navigateToEditPhone}
          />
        </SettingsSection>

        <SettingsSection>
          <SettingsItem
            icon="accessibility"
            title="Wheelchair access"
            rightElement={
              <Switch
                value={wheelchairAccess}
                onValueChange={setWheelchairAccess}
                trackColor={{ false: '#3e3e3e', true: '#007AFF' }}
                thumbColor={wheelchairAccess ? '#fff' : '#fff'}
              />
            }
          />
          <SettingsItem
            icon="moon"
            title="Dark mode"
            subtitle="Use device settings"
          />
        </SettingsSection>

        <SettingsSection>
          <SettingsItem
            icon="home"
            title="Add Home"
            subtitle="Set once and go"
          />
          <SettingsItem
            icon="briefcase"
            title="Add Work"
            subtitle="Set once and go"
          />
          <SettingsItem
            icon="location"
            title="Manage all shortcuts"
          />
        </SettingsSection>

        <SettingsSection>
          <SettingsItem
            icon="shield-checkmark"
            title="Safety tools"
          />
          <SettingsItem
            icon="lock-closed"
            title="Security center"
            subtitle="Keep your account secure"
          />
        </SettingsSection>

        <SettingsSection>
          <SettingsItem
            icon="cash"
            title="Set default tip"
          />
        </SettingsSection>

        <SettingsSection title="Programs">
          <SettingsItem
            icon="pricetag"
            title="Price Lock"
          />
          <SettingsItem
            icon="star"
            title="Rewards"
          />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsItem
            icon="notifications"
            title="Notifications"
          />
          <SettingsItem
            icon="gift"
            title="Refer a friend"
          />
          <SettingsItem
            icon="time"
            title="Ride history"
          />
          <SettingsItem
            icon="card"
            title="Payment"
          />
          <SettingsItem
            icon="gift"
            title="Gift cards"
          />
          <SettingsItem
            icon="help-circle"
            title="Help"
          />
        </SettingsSection>

        <SettingsSection title="Community">
          <SettingsItem
            icon="heart"
            title="Donate"
          />
          <SettingsItem
            icon="car"
            title="Drive with SafeRides"
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