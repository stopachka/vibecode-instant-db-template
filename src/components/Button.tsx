import React, { useRef, useState } from "react";
import { ActivityIndicator, Animated, LayoutChangeEvent, Pressable, Text, TextStyle, View, ViewStyle } from "react-native";
import { theme } from "../styles/theme";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md";

interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    fontSize: 13,
    borderRadius: 24,
    lineHeight: 18,
  },
  md: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    fontSize: 15,
    borderRadius: 24,
    lineHeight: 22,
  },
  lg: {
    paddingHorizontal: 32,
    paddingVertical: 18,
    fontSize: 17,
    borderRadius: 24,
    lineHeight: 27,
  },
};

const getTextColor = (variant: ButtonVariant) => {
  switch (variant) {
    case "primary":
    case "danger":
      return theme.colors.textInverse;
    case "secondary":
      return theme.colors.text;
    case "outline":
      return theme.colors.text;
    case "ghost":
      return theme.colors.text;
    default:
      return theme.colors.textInverse;
  }
};



const getButtonStyle = (variant: ButtonVariant): ViewStyle => {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
      };
    case "secondary":
      return {
        backgroundColor: theme.colors.gray100,
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
      };
    case "outline":
      return {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: theme.colors.text,
      };
    case "danger":
      return {
        backgroundColor: theme.colors.error,
        shadowColor: theme.colors.error,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
      };
    default:
      return {
        backgroundColor: theme.colors.primary,
      };
  }
};

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  disabled = false,
  onPress,
  style,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);

  const handlePressIn = () => {
    if (!disabled && !loading) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.97,
          useNativeDriver: true,
          speed: 20,
          bounciness: 10,
        }),
        // Animated.timing(opacityAnim, {
        //   toValue: 0.85,
        //   duration: 100,
        //   useNativeDriver: true,
        // }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 10,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    if (!fullWidth && !buttonWidth) {
      setButtonWidth(event.nativeEvent.layout.width);
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
        alignSelf: fullWidth ? "stretch" : "center",
        width: !fullWidth && buttonWidth ? buttonWidth : undefined,
      }}
    >
      <Pressable
        onPress={disabled || loading ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLayout={handleLayout}
        style={[
          {
            ...getButtonStyle(variant),
            paddingHorizontal: sizeStyles[size].paddingHorizontal,
            paddingVertical: sizeStyles[size].paddingVertical,
            borderRadius: sizeStyles[size].borderRadius,
            opacity: disabled ? 0.6 : 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: fullWidth ? "100%" : "auto",
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={theme.colors.textInverse}
          />
        ) : (
          <>
            {icon && iconPosition === "left" && <View style={{ marginRight: 4 }}>{icon}</View>}
            <Text
              style={{
                color: getTextColor(variant),
                fontSize: sizeStyles[size].fontSize,
                fontWeight: "600",
                textAlign: "center",
                letterSpacing: 0.5,
                lineHeight: sizeStyles[size].lineHeight,
              } as TextStyle}
            >
              {title}
            </Text>
            {icon && iconPosition === "right" && <View style={{ marginLeft: 4 }}>{icon}</View>}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};
