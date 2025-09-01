import db from "../lib/db";
import { SplashScreen, Tabs } from "expo-router";
import { Text } from "react-native";
import SignIn from "../auth/SignIn";
import ScaleButton from "../components/ScaleButton";
import AuthorizedContainer from "../auth/AuthorizedContainer";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const { isLoading, error, user } = db.useAuth();

  if (isLoading) return null;

  if (error) <Text>{error.message}</Text>;

  if (!user) return <SignIn />;
  return (
    <AuthorizedContainer>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: ScaleButton,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Wall",
            tabBarIcon: () => <Text>💬</Text>,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: () => <Text>🎫</Text>,
            title: "Profile",
          }}
        />
      </Tabs>
    </AuthorizedContainer>
  );
}
