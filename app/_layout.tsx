import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
  <Stack.Screen name="index" options={{ headerShown: false }} />
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
  <Stack.Screen name="selectimage" options={{ headerShown: false }} />
</Stack>
}
