import React from 'react'
import { View, Text, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native'
import { theme } from '../styles/theme'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  style?: ViewStyle
  backgroundColor?: string
  textColor?: string
  badge?: React.ReactNode
}

const sizeStyles = {
  xs: {
    width: 24,
    height: 24,
    fontSize: 11,
  },
  sm: {
    width: 32,
    height: 32,
    fontSize: 13,
  },
  md: {
    width: 40,
    height: 40,
    fontSize: 15,
  },
  lg: {
    width: 48,
    height: 48,
    fontSize: 17,
  },
  xl: {
    width: 64,
    height: 64,
    fontSize: 21,
  },
  '2xl': {
    width: 80,
    height: 80,
    fontSize: 26,
  },
}

const getInitials = (name: string): string => {
  const names = name.trim().split(' ')
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase()
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

const getBackgroundColor = (name: string): string => {
  const colors = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.success,
    theme.colors.warning,
    theme.colors.info,
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name = '',
  size = 'md',
  style,
  backgroundColor,
  textColor = 'white',
  badge,
}) => {
  const sizeStyle = sizeStyles[size]
  const initials = getInitials(name)
  const bgColor = backgroundColor || getBackgroundColor(name)

  return (
    <View style={[{ position: 'relative' }, style]}>
      <View
        style={{
          width: sizeStyle.width,
          height: sizeStyle.height,
          borderRadius: 9999,
          backgroundColor: src ? 'transparent' : bgColor,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: 'white',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {src ? (
          <Image
            source={{ uri: src }}
            alt={alt || name}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 9999,
            } as ImageStyle}
          />
        ) : (
          <Text
            style={{
              fontSize: sizeStyle.fontSize,
              fontWeight: '600',
              color: textColor,
              textAlign: 'center',
            } as TextStyle}
          >
            {initials}
          </Text>
        )}
      </View>
      
      {badge && (
        <View
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            zIndex: 2,
          }}
        >
          {badge}
        </View>
      )}
    </View>
  )
}

interface AvatarGroupProps {
  children: React.ReactNode
  max?: number
  size?: AvatarSize
  style?: ViewStyle
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 5,
  size = 'md',
  style,
}) => {
  const childrenArray = React.Children.toArray(children)
  const visibleChildren = childrenArray.slice(0, max)
  const excess = Math.max(0, childrenArray.length - max)
  const sizeStyle = sizeStyles[size]

  return (
    <View
      style={[{
        flexDirection: 'row',
        alignItems: 'center',
      }, style]}
    >
      {visibleChildren.map((child, index) => (
        <View
          key={index}
          style={{
            marginLeft: index === 0 ? 0 : -8,
            zIndex: visibleChildren.length - index,
          }}
        >
          {React.isValidElement(child) 
            ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size })
            : child
          }
        </View>
      ))}
      
      {excess > 0 && (
        <View
          style={{
            width: sizeStyle.width,
            height: sizeStyle.height,
            borderRadius: 9999,
            backgroundColor: theme.colors.gray300,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: -8,
            borderWidth: 2,
            borderColor: 'white',
            zIndex: 0,
          }}
        >
          <Text
            style={{
              fontSize: sizeStyle.fontSize,
              fontWeight: '600',
              color: theme.colors.textSecondary,
              textAlign: 'center',
            } as TextStyle}
          >
            +{excess}
          </Text>
        </View>
      )}
    </View>
  )
}