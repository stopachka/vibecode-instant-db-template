import React, { useRef } from "react";
import { Animated, Pressable, View, ViewStyle } from "react-native";
import { theme } from "../styles/theme";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: "default" | "elevated" | "outlined";
  padding?: number;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  disabled = false,
  style,
  variant = "default",
  padding = 24,
  hoverable = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled && onPress && hoverable) {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 20,
        bounciness: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && onPress && hoverable) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 10,
      }).start();
    }
  };

  const getCardStyle = (): ViewStyle => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: theme.colors.surface,
          borderRadius: 24,
          padding: padding,
          paddingVertical: 24,
          borderWidth: 1,
          borderColor: theme.colors.borderLight,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 6,
        };
      case "outlined":
        return {
          backgroundColor: theme.colors.surface,
          borderRadius: 24,
          padding: padding,
          borderWidth: 1,
          borderColor: theme.colors.border,
          elevation: 0,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderRadius: 24,
          padding: padding,
          paddingVertical: 24,
          borderWidth: 1,
          borderColor: theme.colors.borderLight,
        };
    }
  };

  const cardStyle: ViewStyle = {
    ...getCardStyle(),
    opacity: disabled ? 0.6 : 1,
    gap: 8,
    ...style,
  };

  if (onPress) {
    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Pressable
          onPress={disabled ? undefined : onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={cardStyle}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};