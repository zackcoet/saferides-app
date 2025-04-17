import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday?: string;
  year?: string;
  profileImage?: string;
}

class UserService {
  private static instance: UserService;
  private readonly STORAGE_KEY = 'userProfile';

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profile = await AsyncStorage.getItem(this.STORAGE_KEY);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  public async updateUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
    try {
      const currentProfile = await this.getUserProfile();
      const updatedProfile = { ...currentProfile, ...profile };
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProfile));
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  public async updateProfileImage(imageUri: string): Promise<boolean> {
    try {
      const currentProfile = await this.getUserProfile();
      if (currentProfile) {
        currentProfile.profileImage = imageUri;
        await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentProfile));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile image:', error);
      return false;
    }
  }

  public async clearUserProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user profile:', error);
    }
  }
}

export default UserService; 