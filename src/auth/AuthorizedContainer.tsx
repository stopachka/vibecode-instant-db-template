import React, { useEffect } from "react";
import db from "../lib/db";
import { SplashScreen } from "expo-router";
import { StyleSheet, Text } from "react-native";

export function useProfile() {
  // CRITICAL: useUser assumes you are signed in.
  const user = db.useUser();
  const { data, isLoading, error } = db.useQuery({
    profiles: {
      $: { where: { "user.id": user.id } },
      avatar: {},
    },
  });
  const profile = data?.profiles?.[0];
  return { profile, isLoading, error };
}

export function useRequiredProfile() {
  const { profile } = useProfile();
  if (!profile) {
    throw new Error("useRequiredProfile must be used inside EnsureProfile");
  }
  return profile;
}

function randomHandle() {
  const adjectives = ["Quick", "Lazy", "Happy", "Sad", "Bright", "Dark"];
  const nouns = ["Fox", "Dog", "Cat", "Bird", "Fish", "Mouse"];
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
  return `${randomAdjective}${randomNoun}${randomSuffix}`;
}

export async function createProfile(userId: string): Promise<void> {
  await db.transact(
    db.tx.profiles[userId]
      .update({ handle: randomHandle() })
      .link({ user: userId })
  );
}

export default function AuthorizedContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = db.useUser();
  const { isLoading, profile, error } = useProfile();

  useEffect(() => {
    if (!isLoading && !profile) {
      createProfile(user.id);
    }
    if (profile || error) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, profile, user.id]);

  if (isLoading) {
    return null;
  }
  if (error) {
    return <Text style={styles.error}>Profile error: {error.message}</Text>;
  }
  if (!profile) return null;
  return <>{children}</>;
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    padding: 16,
    textAlign: "center",
  },
});
