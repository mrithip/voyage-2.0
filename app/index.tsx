import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Small delay to allow auth state to be determined
      // Temporary fix for Expo Router navigation - update these paths as needed
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace("/tabs");
        } else {
          router.replace("/auth/login");
        }
      }, 100);
    }
  }, [isAuthenticated, loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0ea5e9" />
      <Text style={styles.text}>Loading Voyage...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    marginTop: 16,
    color: '#4b5563',
  },
});
