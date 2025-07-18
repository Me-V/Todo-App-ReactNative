import { auth } from '@/firebaseConfig';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
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

  // Watch for sign in/out
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setEmail('');
        setPassword('');
        router.replace('/');
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
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
    {currentUser?.photoURL && (
      <Image
        source={{ uri: currentUser.photoURL }}
        style={className`w-24 h-24 rounded-full mb-4`}
      />
    )}
    <Text className='text-2xl font-bold mb-2'>Welcome</Text>
    <Text className='text-lg mb-4'>{currentUser?.email}</Text>
    <TouchableOpacity style={className`bg-red-500 p-3 rounded`} onPress={handleSignOut}>
      <Text style={className`text-white font-bold`}>Sign Out</Text>
    </TouchableOpacity>
  </View>
      )}
    </SafeAreaView>
  );
}
