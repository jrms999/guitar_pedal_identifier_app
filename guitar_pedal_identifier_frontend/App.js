import React, { useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      identifyPedal(result.base64);
    }
  };

  const identifyPedal = async (base64Image) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/identify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      Alert.alert("Error", "Failed to identify pedal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Capture Pedal Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {result && (
        <View style={styles.result}>
          <Text style={styles.resultText}>Name: {result.name}</Text>
          <Text style={styles.resultText}>Brand: {result.brand}</Text>
          <Text style={styles.resultText}>Estimated Value: ${result.estimated_value}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20
  },
  image: {
    width: 200, height: 200, marginVertical: 20
  },
  result: {
    marginTop: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10
  },
  resultText: {
    fontSize: 16
  }
});