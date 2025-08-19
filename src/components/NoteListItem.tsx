import React from 'react';
import { Pressable, View, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Body, Caption } from './Typography';
import { theme } from '../styles/theme';
import { getShortTimeRemaining } from '../lib/timeUtils';
import { Reaction, getTopEmojiCounts, getTotalReactionCount } from '../lib/reactions';

interface Props {
  id: string;
  createdAt: number;
  unlockAt: number;
  content: string;
  reactions: Reaction[];
  isVisited: boolean;
  onPress: () => void;
}

export const NoteListItem: React.FC<Props> = ({ id, createdAt, unlockAt, content, reactions, isVisited, onPress }) => {
  const top = getTopEmojiCounts(id, reactions, 3);
  const total = getTotalReactionCount(id, reactions);
  const timeLabel = getShortTimeRemaining(unlockAt);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable onPress={handlePress} style={{ marginBottom: 12 }} accessibilityLabel={`Note created ${new Date(createdAt).toLocaleDateString()}, ${timeLabel.replace('🔒','locked').replace('🔓','unlocked')}, ${total} reactions`}>
      <View style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
        backgroundColor: theme.colors.surface,
        padding: 12,
        opacity: isVisited ? 0.85 : 1,
      }}>
        {/* Top row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {!isVisited ? (
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.info }} />
            ) : (
              <View style={{ height: 1, width: 8, backgroundColor: theme.colors.borderLight }} />
            )}
            <Caption color={theme.colors.textSecondary}>{new Date(createdAt).toLocaleDateString()}</Caption>
          </View>
          <View style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: theme.colors.infoSubtle, borderRadius: 12 }}>
            <Caption color={theme.colors.info}>{timeLabel}</Caption>
          </View>
        </View>

        {/* Content preview */}
        <View style={{ borderWidth: 1, borderColor: theme.colors.borderLight, backgroundColor: theme.colors.backgroundSecondary, borderRadius: 10, padding: 10, marginBottom: 8 }}>
          <Body numberOfLines={2} style={{ color: theme.colors.text }}>{content}</Body>
        </View>

        {/* Bottom row: reactions + comments placeholder (comment count rendered by parent if needed) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {top.map(({ emoji, count }) => (
              <View key={emoji} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e9ecef', borderRadius: 14 }}>
                <Text style={{ fontSize: 14, marginRight: 4 }}>{emoji}</Text>
                <Caption color={theme.colors.textSecondary}>{count}</Caption>
              </View>
            ))}
            {total > 0 && (
              <Caption color={theme.colors.textSecondary}>{total} reaction{total !== 1 ? 's' : ''}</Caption>
            )}
          </View>
          <Caption color={theme.colors.textMuted}>Tap to view</Caption>
        </View>
      </View>
    </Pressable>
  );
};
