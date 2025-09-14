import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="auth"
            options={{
              headerShown: false,
            }}
          />
        <Stack.Screen
          name="memory"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
          <Stack.Screen
            name="tabs"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        <Toast />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
