import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthday?: string;
  year?: string;
  major?: string;
  profilePicture?: string;
  gender?: string;
  username: string;
  trustedContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface UserSettings {
  darkMode: boolean;
  notifications: boolean;
  wheelchairAccess: boolean;
}

class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUserSettings(): Promise<UserSettings | null> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return null;

      const data = userDoc.data();
      return data.settings || {
        darkMode: false,
        notifications: true,
        wheelchairAccess: false
      };
    } catch (error) {
      console.error('Error getting user settings:', error);
      return null;
    }
  }

  async updateUserSettings(settings: Partial<UserSettings>): Promise<boolean> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return false;

      await setDoc(doc(db, 'users', user.uid), {
        settings: settings
      }, { merge: true });

      return true;
    } catch (error) {
      console.error('Error updating user settings:', error);
      return false;
    }
  }

  async submitFeedback(feedback: string): Promise<boolean> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return false;

      await setDoc(doc(db, 'feedback', Date.now().toString()), {
        userId: user.uid,
        feedback,
        createdAt: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return false;

      await setDoc(doc(db, 'users', user.uid), {
        profile: profile
      }, { merge: true });

      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  async uploadProfilePicture(uri: string): Promise<string | null> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return null;

      // TODO: Implement image upload to Firebase Storage
      // For now, we'll just return the URI
      return uri;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return null;
    }
  }
}

export default UserService; 