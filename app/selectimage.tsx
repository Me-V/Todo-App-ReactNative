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
  View,
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
    <SafeAreaView style={className`flex-1 bg-black px-6 pt-10`}>
      {!currentUser ? (
        <View style={className`mt-10`}>
          <Text style={className`text-3xl font-bold text-center mb-8`}>Welcome Back</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={className`border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base`}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={className`border border-gray-300 rounded-xl px-4 py-3 mb-6 text-base`}
          />

          <TouchableOpacity
            onPress={signIn}
            style={className`bg-blue-600 py-4 rounded-xl mb-3`}>
            <Text style={className`text-white text-center font-semibold text-base`}>
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={signUp}
            style={className`bg-green-600 py-4 rounded-xl`}>
            <Text style={className`text-white text-center font-semibold text-base`}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={className`items-center mt-40`}>
          <TouchableOpacity onPress={pickAndSaveImage} activeOpacity={0.8}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={className`w-38 h-38 rounded-full mb-2 ml-10`}
              />
            ) : (
              <View style={className`w-38 h-38 rounded-full bg-gray-400 mb-2 ml-10`} />
            )}
            <Text style={className`text-sm text-gray-500 text-center mb-6 ml-5 mt-6`}>
              Select your profile picture
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={className`bg-red-500 py-3 px-8 rounded-xl ml-3`}
            onPress={handleDone}>
            <Text style={className`text-white text-base font-semibold`}>
              Continue to To-Do
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
