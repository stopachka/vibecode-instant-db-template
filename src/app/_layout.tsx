import { Text, View } from "react-native";
import { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import db from "../lib/db";
import Login from "../components/Login";

export default function RootLayout() {
  const { isLoading, error, user } = db.useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) return null;
  if (error) <Text>{error.message}</Text>;
  if (!user) return <Login />;
  return (
    <View>
      <Text>Hi</Text>
    </View>
  );
  // return (
  //   <Stack>
  //     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  //     <Stack.Screen
  //       name="note-detail"
  //       options={{
  //         headerShown: true,
  //         title: "Note Details",
  //         presentation: "card",
  //       }}
  //     />
  //     <Stack.Screen
  //       name="add-comment"
  //       options={{
  //         headerShown: true,
  //         title: "Add Comment",
  //         presentation: "modal",
  //       }}
  //     />
  //     <Stack.Screen name="+not-found" />
  //   </Stack>
  // );
}
