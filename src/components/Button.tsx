import React from "react";
import { Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import ScaleButton from "./ScaleButton";

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function Button({
  onPress,
  children,
  variant = "primary",
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  return (
    <ScaleButton
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variant === "primary" ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "primary" ? styles.primaryButtonText : styles.secondaryButtonText,
          disabled && styles.disabledButtonText,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </ScaleButton>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  fullWidth: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
  },
  secondaryButton: {
    backgroundColor: "#e5e7eb",
  },
  disabledButton: {
    backgroundColor: "#f3f4f6",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  primaryButtonText: {
    color: "white",
  },
  secondaryButtonText: {
    color: "#374151",
  },
  disabledButtonText: {
    color: "#9ca3af",
  },
});