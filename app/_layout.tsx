import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import "./globals.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#030014" translucent />
      <Stack
        screenOptions={{
          headerShown: false,
          // This matches the splash background so it feels like one seamless experience
          contentStyle: { backgroundColor: "#030014" },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="movie/[id]" />
      </Stack>
    </>
  );
}
