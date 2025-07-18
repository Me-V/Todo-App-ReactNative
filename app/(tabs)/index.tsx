import { auth, database } from "@/firebaseConfig";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import className from "twrnc";

export default function TabOneScreen() {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadProfileImage(user.uid);
      } else {
        setProfileImage(null);
        setEmail("");
        setPassword("");
        router.replace("/");
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
      console.error("Error loading image:", error);
    }
  };

  const pickImageAndSaveToFirebase = async () => {
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
          await set(
            ref(database, `users/${currentUser.uid}/profileImage`),
            uri
          );
          setProfileImage(uri);
          Alert.alert("Success", "Profile picture updated!");
        }
      }
    } catch (error) {
      console.log("Image update error:", error);
      Alert.alert("Error", "Failed to update profile picture");
    }
  };

  const signIn = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      if (userCred) router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
  };

  const signUp = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCred) router.replace("/selectimage");
    } catch (error: any) {
      console.log(error);
      alert("Sign up failed: " + error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <SafeAreaView style={className`flex-1 bg-black px-6`}>
      {currentUser ? (
        <Text
          style={className`mt-20 text-3xl font-bold text-center mb-6 text-gray-800 text-white`}
        >
          Profile Section
        </Text>
      ) : (
        <Text
          style={className`mt-32 text-3xl font-bold text-center mb- text-gray-800 text-white`}
        >
          Login
        </Text>
      )}
      {!currentUser ? (
        <View style={className`mt-14`}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={className`border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-gray-50`}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={className`border border-gray-300 rounded-lg px-4 py-3 mb-6 bg-gray-50`}
          />
          <TouchableOpacity
            style={className`bg-blue-600 py-3 rounded-lg mb-3`}
            onPress={signIn}
          >
            <Text style={className`text-white font-semibold text-center`}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={className`bg-green-600 py-3 rounded-lg`}
            onPress={signUp}
          >
            <Text style={className`text-white font-semibold text-center`}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={className`items-center mt-20`}>
          <TouchableOpacity
            onPress={pickImageAndSaveToFirebase}
            activeOpacity={0.8}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={className`w-28 h-28 rounded-full mb-3 shadow-lg ml-11`}
              />
            ) : (
              <View
                style={className`ml-11 w-28 h-28 rounded-full bg-gray-200 mb-3 items-center justify-center shadow`}
              >
                <AntDesign name="user" size={36} color="#888" />
              </View>
            )}
            <Text style={className`text-gray-500 text-sm text-center mb-4`}>
              Tap to change profile picture
            </Text>
          </TouchableOpacity>
          <Text
            style={className`text-xl text-white font-semibold text-center mb-2`}
          >
            Welcome, {currentUser?.email?.split("@")[0]}
          </Text>
          <TouchableOpacity
            style={className`bg-red-500 px-5 py-3 rounded-lg mt-4`}
            onPress={handleSignOut}
          >
            <Text style={className`text-white font-bold`}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
