import React, { useState } from 'react';
import { TextInput as RNTextInput, View, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../styles/theme';
import { Caption } from './Typography';

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  autoFocus?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  editable?: boolean;
  numberOfLines?: number;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  maxLength,
  showCharacterCount = false,
  autoFocus = false,
  style,
  textStyle,
  secureTextEntry = false,
  keyboardType = 'default',
  returnKeyType = 'done',
  onSubmitEditing,
  editable = true,
  numberOfLines,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isFocused ? theme.colors.primary : theme.colors.border,
    ...style,
  };

  const inputStyle: TextStyle = {
    fontSize: 16,
    lineHeight: 24,
    padding: 12,
    color: theme.colors.text,
    textAlignVertical: multiline ? 'top' : 'center',
    minHeight: multiline ? 80 : 44,
    ...textStyle,
  };

  return (
    <View>
      <View style={containerStyle}>
        <RNTextInput
          style={inputStyle}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          multiline={multiline}
          maxLength={maxLength}
          autoFocus={autoFocus}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          editable={editable}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      
      {showCharacterCount && maxLength && (
        <Caption style={{ 
          textAlign: 'right', 
          marginTop: 4,
          color: value.length > maxLength * 0.9 ? theme.colors.warning : theme.colors.textMuted
        }}>
          {value.length}/{maxLength}
        </Caption>
      )}
    </View>
  );
};