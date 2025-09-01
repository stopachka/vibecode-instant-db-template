import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { lookup } from "@instantdb/react-native";
import db from "../lib/db";
import { useRequiredProfile } from "../auth/AuthorizedContainer";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import Card from "../components/Card";
import Title from "../components/Title";
import Divider from "../components/Divider";

function ProfileAvatar() {
  const user = db.useUser();
  const profile = useRequiredProfile();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const avatarPath = `${user.id}/avatar`;

  const handleAvatarUpload = async (): Promise<void> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setIsUploading(true);
      try {
        const blob = await fetch(result.assets[0].uri!).then((res) =>
          res.blob()
        );
        const { data } = await db.storage.uploadFile(avatarPath, blob);
        await db.transact(db.tx.profiles[profile.id].link({ avatar: data.id }));
      } catch (error) {
        console.error("Upload failed:", error);
        Alert.alert("Upload failed", "Please try again");
      }
      setIsUploading(false);
    }
  };

  const handleAvatarDelete = async (): Promise<void> => {
    if (!profile.avatar) return;
    db.transact(db.tx.$files[lookup("path", avatarPath)].delete());
  };

  return (
    <Card>
      <View style={styles.avatarRow}>
        <TouchableOpacity onPress={handleAvatarUpload}>
          <Avatar
            url={profile.avatar?.url}
            name={profile.handle}
            size="large"
          />
          {isUploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator color="white" />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.handle}>handle: {profile.handle}</Text>
          <Text style={styles.email}>email: {user.email}</Text>
          <Button
            onPress={handleAvatarDelete}
            disabled={!profile.avatar || isUploading}
            variant="secondary"
            style={{ marginTop: 8, paddingVertical: 4, paddingHorizontal: 8 }}
            textStyle={{ fontSize: 14 }}
          >
            Delete Avatar
          </Button>
        </View>
      </View>
    </Card>
  );
}

export default function ProfileTab() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <ScrollView style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <Title>Profile</Title>

          <ProfileAvatar />

          <Divider />

          <Button onPress={() => db.auth.signOut()} variant="secondary">
            Sign Out
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  handle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
});
