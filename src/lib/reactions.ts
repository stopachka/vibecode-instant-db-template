import { db, id } from './instant';

export type EmojiType = '👍' | '❤️' | '😂' | '😮' | '😢' | '😡';

export const EMOJI_OPTIONS: EmojiType[] = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export interface Reaction {
  id: string;
  noteId: string;
  emoji: EmojiType;
  userId: string;
  createdAt: number;
}

export interface ReactionCounts {
  [emoji: string]: number;
}

/**
 * Adds a reaction to a note
 */
export async function addReaction(noteId: string, emoji: EmojiType, userId: string): Promise<void> {
  try {
    await db.transact(
      db.tx.reactions[id()].update({
        noteId,
        emoji,
        userId,
        createdAt: Date.now(),
      })
    );
  } catch (error) {
    console.error('Error adding reaction:', error);
    throw error;
  }
}

/**
 * Removes a reaction from a note
 */
export async function removeReaction(noteId: string, emoji: EmojiType, userId: string): Promise<void> {
  try {
    // Find the reaction to remove
    const { data } = await db.queryOnce({
      reactions: {
        $: {
          where: {
            noteId,
            emoji,
            userId,
          }
        }
      }
    });

    const reaction = data?.reactions?.[0];
    if (reaction) {
      await db.transact(db.tx.reactions[reaction.id].delete());
    }
  } catch (error) {
    console.error('Error removing reaction:', error);
    throw error;
  }
}

/**
 * Gets all reactions for a specific user on a specific note
 */
export function getUserReactions(noteId: string, userId: string, allReactions: Reaction[]): EmojiType[] {
  return allReactions
    .filter(reaction => reaction.noteId === noteId && reaction.userId === userId)
    .map(reaction => reaction.emoji);
}

/**
 * Calculates reaction counts for a specific note
 */
export function getReactionCounts(noteId: string, allReactions: Reaction[]): ReactionCounts {
  const counts: ReactionCounts = {};
  
  allReactions
    .filter(reaction => reaction.noteId === noteId)
    .forEach(reaction => {
      counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
    });
  
  return counts;
}

/**
 * Gets the total number of reactions for a note
 */
export function getTotalReactionCount(noteId: string, allReactions: Reaction[]): number {
  return allReactions.filter(reaction => reaction.noteId === noteId).length;
}

/**
 * Checks if a user has reacted with a specific emoji to a note
 */
export function hasUserReacted(noteId: string, emoji: EmojiType, userId: string, allReactions: Reaction[]): boolean {
  return allReactions.some(
    reaction => reaction.noteId === noteId && reaction.emoji === emoji && reaction.userId === userId
  );
}