import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";

interface TitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export default function Title({ children, style }: TitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
});