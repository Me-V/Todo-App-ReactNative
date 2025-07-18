import { auth, database } from '@/firebaseConfig';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User
} from 'firebase/auth';
import { get, ref, set } from 'firebase/database';
import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import className from 'twrnc';

export default function TabOneScreen() {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await loadProfileImage(user.uid);
      } else {
        setProfileImage(null);
        setEmail('');
        setPassword('');
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, []);

  const loadProfileImage = async (uid: string) => {
    try {
      const snapshot = await get(ref(database, `users/${uid}/profileImage`));
      if (snapshot.exists()) {
        setProfileImage(snapshot.val());
      } else {
        setProfileImage(null);
      }
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  const pickAndSaveImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;

        if (currentUser?.uid) {
          await set(ref(database, `users/${currentUser.uid}/profileImage`), uri);
          setProfileImage(uri);
          Alert.alert('Success', 'Profile picture updated!');
        }
      }
    } catch (error) {
      console.log('Image update error:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };

  const signIn = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      if (userCred) router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }
  };

  const signUp = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      if (userCred) router.replace('/selectimage');
    } catch (error: any) {
      console.log(error);
      alert('Sign up failed: ' + error.message);
    }
  };

  const handleDone = async () => {
    router.replace('/(tabs)/two');
  };

  return (
    <SafeAreaView style={className`flex-1 items-center justify-center`}>
      {!currentUser ? (
        <View style={className`w-full px-6`}>
          <Text className='text-2xl font-bold mb-4 text-center'>Login</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={className`border border-gray-400 rounded p-3 mb-4`}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={className`border border-gray-400 rounded p-3 mb-4`}
          />
          <TouchableOpacity style={className`bg-blue-600 rounded p-3 mb-2`} onPress={signIn}>
            <Text style={className`text-white text-center font-bold`}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={className`bg-green-600 rounded p-3`} onPress={signUp}>
            <Text style={className`text-white text-center font-bold`}>Make Account</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={className`items-center`}>
          <TouchableOpacity onPress={pickAndSaveImage} activeOpacity={0.8}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={className`w-24 h-24 rounded-full mb-2`}
              />
            ) : (
              <View style={className`w-24 h-24 rounded-full bg-gray-300 mb-2`} />
            )}
            <Text style={className`text-xs text-gray-500 mb-4 text-center`}>
              Tap to change picture
            </Text>
          </TouchableOpacity>
          <Text className='text-2xl font-bold mb-2'>Welcome</Text>
          <Text className='text-lg mb-4'>{currentUser?.email}</Text>
          <TouchableOpacity style={className`bg-red-500 p-3 rounded`} onPress={handleDone}>
            <Text style={className`text-white font-bold`}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
