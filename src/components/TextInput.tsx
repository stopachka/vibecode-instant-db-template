import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
} from "react-native";

export default function TextInput({
  style,
  multiline,
  ...props
}: RNTextInputProps) {
  return (
    <RNTextInput
      style={[styles.input, multiline && styles.multilineInput, style]}
      placeholderTextColor="#9ca3af"
      {...props}
      multiline={multiline}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
    color: "#374151",
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
});
