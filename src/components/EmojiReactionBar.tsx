import React, { useState, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { 
  EmojiType, 
  EMOJI_OPTIONS, 
  Reaction, 
  addReaction, 
  removeReaction, 
  getUserReactions, 
  getReactionCounts, 
  hasUserReacted 
} from '../lib/reactions';
import { getAnonymousUserId } from '../lib/anonymous';
import { Caption } from './Typography';

interface EmojiReactionBarProps {
  noteId: string;
  reactions: Reaction[];
  onReactionChange?: () => void;
}

export const EmojiReactionBar: React.FC<EmojiReactionBarProps> = ({
  noteId,
  reactions,
  onReactionChange,
}) => {
  const [anonymousUserId, setAnonymousUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getAnonymousUserId().then(setAnonymousUserId);
  }, []);

  const reactionCounts = getReactionCounts(noteId, reactions);
  const userReactions = getUserReactions(noteId, anonymousUserId, reactions);

  const handleReactionPress = async (emoji: EmojiType) => {
    if (!anonymousUserId || isLoading) return;

    setIsLoading(true);
    
    try {
      // Haptic feedback for iOS
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const hasReacted = hasUserReacted(noteId, emoji, anonymousUserId, reactions);
      
      if (hasReacted) {
        await removeReaction(noteId, emoji, anonymousUserId);
      } else {
        await addReaction(noteId, emoji, anonymousUserId);
      }
      
      onReactionChange?.();
    } catch (error) {
      console.error('Error handling reaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalReactions = () => {
    return Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.emojiRow}>
        {EMOJI_OPTIONS.map((emoji) => {
          const count = reactionCounts[emoji] || 0;
          const isActive = userReactions.includes(emoji);
          
          return (
            <Pressable
              key={emoji}
              style={[
                styles.emojiButton,
                isActive && styles.emojiButtonActive,
                count > 0 && styles.emojiButtonWithCount,
              ]}
              onPress={() => handleReactionPress(emoji)}
              disabled={isLoading}
            >
              <Text style={[styles.emoji, isActive && styles.emojiActive]}>
                {emoji}
              </Text>
              {count > 0 && (
                <Text style={[styles.count, isActive && styles.countActive]}>
                  {count}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
      
      {getTotalReactions() > 0 && (
        <Caption style={styles.totalCount}>
          {getTotalReactions()} reaction{getTotalReactions() !== 1 ? 's' : ''}
        </Caption>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  emojiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 36,
    justifyContent: 'center',
  },
  emojiButtonActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  emojiButtonWithCount: {
    paddingHorizontal: 10,
  },
  emoji: {
    fontSize: 16,
    marginRight: 4,
  },
  emojiActive: {
    transform: [{ scale: 1.1 }],
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    minWidth: 12,
    textAlign: 'center',
  },
  countActive: {
    color: '#2196f3',
  },
  totalCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});