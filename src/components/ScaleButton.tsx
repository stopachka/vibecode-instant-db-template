import React, { useRef } from "react";
import { Animated, Pressable, PressableProps } from "react-native";
import * as Haptics from "expo-haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ScaleButton(props: PressableProps) {
  const scaleRef = useRef(new Animated.Value(0));
  const scaleAnimated = scaleRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });
  return (
    <AnimatedPressable
      onPressIn={() => {
        if (process.env.EXPO_OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        Animated.spring(scaleRef.current, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(scaleRef.current, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }}
      style={{
        transform: [{ scale: scaleAnimated }],
      }}
      {...props}
    />
  );
}
