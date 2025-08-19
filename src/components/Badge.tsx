import React from 'react'
import { Text, TextStyle, View, ViewStyle } from 'react-native'
import { theme } from '../styles/theme'

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  children?: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  style?: ViewStyle
  icon?: React.ReactNode
  dot?: boolean
}

const sizeStyles = {
  sm: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontSize: 11,
    borderRadius: 4,
    minHeight: 20,
    lineHeight: 15,
  },
  md: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 13,
    borderRadius: 8,
    minHeight: 24,
    lineHeight: 18,
  },
  lg: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    fontSize: 15,
    borderRadius: 8,
    minHeight: 32,
    lineHeight: 22,
  },
}

const getVariantStyles = (variant: BadgeVariant) => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.colors.primary,
        color: theme.colors.textInverse,
      }
    case 'secondary':
      return {
        backgroundColor: theme.colors.gray100,
        color: theme.colors.text,
      }
    case 'success':
      return {
        backgroundColor: theme.colors.successSubtle,
        color: theme.colors.success,
      }
    case 'warning':
      return {
        backgroundColor: theme.colors.warningSubtle,
        color: theme.colors.warning,
      }
    case 'error':
      return {
        backgroundColor: theme.colors.errorSubtle,
        color: theme.colors.error,
      }
    case 'info':
      return {
        backgroundColor: theme.colors.infoSubtle,
        color: theme.colors.info,
      }
    case 'neutral':
    default:
      return {
        backgroundColor: theme.colors.gray100,
        color: theme.colors.textSecondary,
      }
  }
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  style,
  icon,
  dot = false,
}) => {
  const variantStyles = getVariantStyles(variant)
  const sizeStyle = sizeStyles[size]

  if (dot) {
    const dotSize = size === 'sm' ? 8 : size === 'lg' ? 12 : 10
    return (
      <View
        style={[{
          width: dotSize,
          height: dotSize,
          borderRadius: 9999,
          backgroundColor: variantStyles.backgroundColor === theme.colors.gray100 ? theme.colors.error : variantStyles.backgroundColor,
        }, style]}
      />
    )
  }

  return (
    <View
      style={[{
        ...variantStyles,
        paddingHorizontal: sizeStyle.paddingHorizontal,
        paddingVertical: sizeStyle.paddingVertical,
        borderRadius: sizeStyle.borderRadius,
        minHeight: sizeStyle.minHeight,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        gap: size === 'sm' ? 2 : 4,
      }, style]}
    >
      {icon && (
        <View style={{ marginRight: size === 'sm' ? 2 : 4 }}>
          {icon}
        </View>
      )}
      {children && (
        <Text
          style={{
            fontSize: sizeStyle.fontSize,
            fontWeight: '600',
            color: variantStyles.color,
            textAlign: 'center',
            letterSpacing: 0.25,
            lineHeight: sizeStyle.lineHeight,
          } as TextStyle}
        >
          {children}
        </Text>
      )}
    </View>
  )
}