import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  onMenuItemPress: (id: string) => void;
  menuAnimation: Animated.Value;
}

const menuItems = [
  { id: 'schedule', title: 'Schedule a Ride', icon: 'calendar' },
  { id: 'faq', title: 'FAQ', icon: 'help-circle' },
  { id: 'payment', title: 'Add Payment Method', icon: 'card' },
];

const SideMenu = ({ visible, onClose, onMenuItemPress, menuAnimation }: SideMenuProps) => {
  const router = useRouter();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.menuModalContainer}>
        <Pressable
          style={styles.menuModalOverlay}
          onPress={onClose}
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
                  onPress={() => onMenuItemPress(item.id)}
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
                  styles.logoutMenuItem,
                  pressed && styles.menuItemPressed
                ]}
                onPress={() => onMenuItemPress('logout')}
              >
                <Ionicons name="log-out" size={24} color="#ff3b30" />
                <Text style={[styles.menuItemText, styles.logoutText]}>Log Out</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  logoutMenuItem: {
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  logoutText: {
    color: '#ff3b30',
  },
});

export default SideMenu; 