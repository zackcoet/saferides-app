import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  onMenuItemPress: (id: string) => void;
  menuAnimation: Animated.Value;
}

const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose, onMenuItemPress, menuAnimation }) => {
  const menuItems = [
    { id: 'schedule', title: 'Schedule a Ride', icon: 'calendar' },
    { id: 'info', title: 'Info', icon: 'information-circle' },
    { id: 'faq', title: 'FAQ', icon: 'help-circle' },
    { id: 'payment', title: 'Add Payment Method', icon: 'card' },
  ];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: menuAnimation }],
        },
      ]}
    >
      <View style={styles.menuContent}>
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            style={styles.menuItem}
            onPress={() => onMenuItemPress(item.id)}
          >
            <Ionicons name={item.icon as any} size={24} color="#fff" />
            <Text style={styles.menuItemText}>{item.title}</Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#003087',
    zIndex: 1000,
  },
  menuContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
});

export default SideMenu; 