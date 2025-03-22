import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import CallScreen from "./src/screens/CallScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

// Providers
//import { CallProvider } from "./src/context/CallContext";
//import { TranslationProvider } from "./src/context/TranslationContext";
//import { UserProvider } from "./src/context/UserContext";
import LoginScreen from "./src/screens/LoginScreen";

export type RootStackParamList = {
  // Diğer ekranlar:
  Home: undefined;
  Settings: undefined;
  Call: {
    callId?: string; 
    remoteUserName: string;
    targetLanguage: string;
    receiverId?: string; 
  };

  // Login rotası:
  Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Translation Call" }}
          />
          <Stack.Screen
            name="Call"
            component={CallScreen}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: "Settings" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
