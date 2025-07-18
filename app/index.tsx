import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import className from "twrnc";
import { auth } from "../firebaseConfig";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/(tabs)/two");
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
  };

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/selectimage");
    } catch (error: any) {
      console.log(error);
      alert("Sign up failed: " + error.message);
    }
  };

  return (
    <SafeAreaView style={className`flex-1 bg-black px-6 justify-center`}>
      <View style={className`mb-10`}>
        <Text style={className`text-3xl mb-2 font-bold text-center text-white`}>
          Todo App
        </Text>
        <Text style={className`text-center text-gray-500`}>
          Sign in to continue
        </Text>
      </View>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
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
        onPress={signIn}
        style={className`bg-blue-600 rounded-lg py-3 mb-4`}
      >
        <Text style={className`text-white text-center text-lg font-semibold`}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={signUp}
        style={className`border border-blue-600 rounded-lg py-3`}
      >
        <Text
          style={className`text-blue-600 text-center text-lg font-semibold`}
        >
          Create New Account
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
