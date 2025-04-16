import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface RideData {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledTime: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface NotificationConfig {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await this.configureNotifications();
    this.setupNetworkListener();
    this.isInitialized = true;
  }

  private async configureNotifications(): Promise<void> {
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  private setupNetworkListener(): void {
    NetInfo.addEventListener((state: NetInfoState) => {
      if (state.isConnected) {
        this.syncPendingData();
      }
    });
  }

  public async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  public async scheduleRideNotification(ride: RideData): Promise<string> {
    const notificationTime = new Date(ride.scheduledTime);
    notificationTime.setMinutes(notificationTime.getMinutes() - 15);

    const notification: NotificationConfig = {
      title: 'Upcoming SafeRide',
      body: `Your ride from ${ride.pickupLocation} to ${ride.dropoffLocation} is scheduled in 15 minutes`,
      data: { rideId: ride.id },
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: notification,
      trigger: {
        channelId: 'default',
        date: notificationTime,
      },
    });

    return notificationId;
  }

  public async saveRideOffline(ride: RideData): Promise<void> {
    try {
      const offlineRides = await this.getOfflineRides();
      offlineRides.push(ride);
      await AsyncStorage.setItem('offlineRides', JSON.stringify(offlineRides));
    } catch (error) {
      console.error('Error saving ride offline:', error);
    }
  }

  public async getOfflineRides(): Promise<RideData[]> {
    try {
      const rides = await AsyncStorage.getItem('offlineRides');
      return rides ? JSON.parse(rides) : [];
    } catch (error) {
      console.error('Error getting offline rides:', error);
      return [];
    }
  }

  private async syncPendingData(): Promise<void> {
    try {
      const offlineRides = await this.getOfflineRides();
      if (offlineRides.length === 0) return;

      // TODO: Implement API call to sync rides with backend
      // For now, just clear the offline data
      await this.clearOfflineData();
    } catch (error) {
      console.error('Error syncing pending data:', error);
    }
  }

  public async clearOfflineData(): Promise<void> {
    try {
      await AsyncStorage.removeItem('offlineRides');
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }
}

export default NotificationService; 