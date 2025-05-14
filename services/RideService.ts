import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface Ride {
  pickupLocation: string;
  dropoffLocation: string;
  scheduledTime: Date;
  totalCost: number;
  participants: Array<{
    userId: string;
    username: string;
    amount: number;
    status: string;
  }>;
  rideType: string;
  status: string;
  requestTime: Date;
  pickupCoords?: {
    latitude: number;
    longitude: number;
  };
  dropoffCoords?: {
    latitude: number;
    longitude: number;
  };
  driverId?: string;
  isDriverPreselected?: boolean;
}

class RideService {
  private static instance: RideService;

  private constructor() {}

  public static getInstance(): RideService {
    if (!RideService.instance) {
      RideService.instance = new RideService();
    }
    return RideService.instance;
  }

  async createRide(rideData: Ride) {
    try {
      const ridesRef = collection(db, 'rides');
      const docRef = await addDoc(ridesRef, {
        ...rideData,
        createdAt: new Date(),
      });
      return { id: docRef.id, ...rideData };
    } catch (error) {
      console.error('Error creating ride:', error);
      throw error;
    }
  }
}

export default RideService; 