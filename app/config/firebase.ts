import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt_8CflOO01Xwin0ffi5T_85DuBwAiP6E",
  authDomain: "saferides-4a2d2.firebaseapp.com",
  projectId: "saferides-4a2d2",
  storageBucket: "saferides-4a2d2.firebasestorage.app",
  messagingSenderId: "81569775633",
  appId: "1:81569775633:web:55dd9520880078f09a71b0",
  measurementId: "G-P1FG13B651"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage }; 