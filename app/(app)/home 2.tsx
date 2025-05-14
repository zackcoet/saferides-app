import { View, Text } from 'react-native';

export default function HomeScreen() {
  console.log('HomeScreen: Rendering home screen');
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to SafeRides</Text>
    </View>
  );
} 