import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface DividerProps {
  style?: ViewStyle;
}

export default function Divider({ style }: DividerProps) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 20,
  },
});