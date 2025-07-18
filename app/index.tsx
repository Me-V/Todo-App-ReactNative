import { router } from "expo-router";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity } from "react-native";
import className from "twrnc";
import { auth } from "../firebaseConfig";

export default function Index() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      if (user) router.replace('/(tabs)/two');
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: ' + error.message);
    }
  }

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      if (user) router.replace('/selectimage');
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: ' + error.message);
    }
  }
  
  return (
    <SafeAreaView style={className`flex-1 items-center justify-center`}>
      <Text >Login</Text>
      <TextInput placeholder="email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="password" value={password} onChangeText={setPassword} secureTextEntry/>
      <TouchableOpacity onPress={signIn}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={signUp}>
        <Text>Make Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
