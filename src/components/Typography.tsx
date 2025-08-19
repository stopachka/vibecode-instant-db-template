import React from 'react'
import { Text, TextStyle } from 'react-native'
import { theme } from '../styles/theme'

interface TypographyProps {
  children: React.ReactNode
  style?: TextStyle
  color?: string
  align?: 'left' | 'center' | 'right' | 'justify'
  numberOfLines?: number
}

export const H1: React.FC<TypographyProps> = ({ 
  children, 
  style, 
  color, 
  align = 'left',
  numberOfLines,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{
        fontSize: 21,
        fontWeight: '600',
        color: color || theme.colors.text,
        lineHeight: 25,
        textAlign: align,
      }, style]}
    >
      {children}
    </Text>
  )
}

export const H2: React.FC<TypographyProps> = ({ 
  children, 
  style, 
  color, 
  align = 'left',
  numberOfLines,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{
        fontSize: 17,
        fontWeight: '600',
        color: color || theme.colors.text,
        lineHeight: 20,
        textAlign: align,
      }, style]}
    >
      {children}
    </Text>
  )
}

export const H3: React.FC<TypographyProps> = ({ 
  children, 
  style, 
  color, 
  align = 'left',
  numberOfLines,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{
        fontSize: 15,
        fontWeight: '600',
        color: color || theme.colors.text,
        lineHeight: 18,
        textAlign: align,
      }, style]}
    >
      {children}
    </Text>
  )
}

export const Body: React.FC<TypographyProps> = ({ 
  children, 
  style, 
  color, 
  align = 'left',
  numberOfLines,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{
        fontSize: 15,
        color: color || theme.colors.text,
        fontWeight: '400',
        lineHeight: 22,
        textAlign: align,
      }, style]}
    >
      {children}
    </Text>
  )
}

export const BodyLarge: React.FC<TypographyProps> = ({ 
  children, 
  style, 
  color, 
  align = 'left',
  numberOfLines,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{
        fontSize: 17,
        color: color || theme.colors.text,
        fontWeight: '400',
        lineHeight: 27,
        textAlign: align,
      }, style]}
    >
      {children}
    </Text>
  )
}

export const BodySmall: React.FC<TypographyProps> = ({ 
  children, 
  style, 
  color, 
  align = 'left',
  numberOfLines,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{
        fontSize: 13,
        color: color || theme.colors.textSecondary,
        fontWeight: '400',
        lineHeight: 19,
        textAlign: align,
      }, style]}
    >
      {children}
    </Text>
  )
}

export const Caption: React.FC<TypographyProps> = ({ 
  children, 
  style, 
  color, 
  align = 'left',
  numberOfLines,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{
        fontSize: 11,
        color: color || theme.colors.textMuted,
        fontWeight: '400',
        lineHeight: 15,
        textAlign: align,
      }, style]}
    >
      {children}
    </Text>
  )
}

export const Label: React.FC<TypographyProps> = ({ 
  children, 
  style, 
  color, 
  align = 'left',
  numberOfLines,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{
        fontSize: 13,
        color: color || theme.colors.text,
        fontWeight: '500',
        lineHeight: 18,
        letterSpacing: 0.25,
        textAlign: align,
      }, style]}
    >
      {children}
    </Text>
  )
}