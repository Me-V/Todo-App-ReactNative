import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
  apiKey: "AIzaSyARga390EwlMg27VEMtg3wZ2OvCvXeq6Y4",
  authDomain: "todo-app-219f1.firebaseapp.com",
  projectId: "todo-app-219f1",
  storageBucket: "todo-app-219f1.firebasestorage.app",
  messagingSenderId: "916649662990",
  appId: "1:916649662990:web:f0f1a60cbff4db09027a5f"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);