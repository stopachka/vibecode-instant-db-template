import React from "react";
import { View, Text, Image, StyleSheet, ViewStyle } from "react-native";

interface AvatarProps {
  url?: string;
  name?: string;
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
}

export default function Avatar({
  url,
  name,
  size = "small",
  style,
}: AvatarProps) {
  const dimensions = {
    small: 40,
    medium: 60,
    large: 80,
  };

  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
  };

  const avatarSize = dimensions[size];
  const textSize = fontSize[size];

  const sizeStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
  };

  if (url) {
    return <Image source={{ uri: url }} style={[styles.avatar, sizeStyle]} />;
  }

  return (
    <View style={[styles.avatarPlaceholder, sizeStyle, style]}>
      <Text style={[styles.avatarText, { fontSize: textSize }]}>
        {name ? name[0].toUpperCase() : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  avatarPlaceholder: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontWeight: "bold",
    color: "#374151",
  },
});
