import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { getAuth, updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SelectImage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const storage = getStorage();
  const auth = getAuth();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image');
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    if (!auth.currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsLoading(true);
    
    try {
      // Upload the image to Firebase Storage
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, blob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update user profile with the image URL
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL
      });
      
      Alert.alert('Success', 'Profile picture updated successfully!');
      router.replace('/(tabs)'); // Navigate to home screen after successful upload
    } catch (error) {
      console.log('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Profile Picture</Text>
      
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={pickImage}
        disabled={isLoading}
      >
        {image ? (
          <Image 
            source={{ uri: image }} 
            style={styles.image} 
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="camera" size={48} color="#666" />
            <Text style={styles.placeholderText}>Tap to select an image</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, (!image || isLoading) && styles.buttonDisabled]}
        onPress={uploadImage}
        disabled={!image || isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Uploading...' : 'Set as Profile Picture'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.skipButton, isLoading && styles.buttonDisabled]}
        onPress={() => router.replace('/(tabs)')}
        disabled={isLoading}
      >
        <Text style={styles.skipButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f0f0f0',
    marginBottom: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: '100%',
    maxWidth: 300,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SelectImage;