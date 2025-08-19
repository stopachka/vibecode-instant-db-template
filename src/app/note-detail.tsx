import React, { useEffect, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Card } from '../components/Card';
import { Body, H3, Caption } from '../components/Typography';
import { Button } from '../components/Button';
import { EmojiReactionBar } from '../components/EmojiReactionBar';
import { db, Note, Comment } from '../lib/instant';
import { Reaction, getTotalReactionCount } from '../lib/reactions';
import { getTimeRemaining, getShortTimeRemaining } from '../lib/timeUtils';
import { useVisitedStore } from '../state/visited';

export default function NoteDetailScreen() {
  const params = useLocalSearchParams();
  const noteId = typeof params.id === 'string' ? params.id : params.id?.[0];
  
  const markVisited = useVisitedStore((s) => s.markVisited);

  // Query all data including the specific note
  const { isLoading, error, data } = db.useQuery({
    notes: {},
    comments: {},
    reactions: {}
  });

  // Find the specific note
  const note = useMemo(() => {
    if (!data?.notes || !noteId) return null;
    return data.notes.find((n: Note) => n.id === noteId);
  }, [data?.notes, noteId]);

  useEffect(() => {
    if (noteId) {
      markVisited(noteId);
    }
  }, [noteId, markVisited]);

  const comments = (data?.comments || []) as Comment[];
  const reactions = (data?.reactions || []) as Reaction[];

  // Filter comments for this note
  const noteComments = useMemo(() => {
    return comments.filter((comment: Comment) => comment.noteId === noteId);
  }, [comments, noteId]);

  const handleAddComment = () => {
    router.push(`/add-comment?noteId=${noteId}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Body>Loading note...</Body>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !note) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Body style={{ color: '#dc3545' }}>
            {error ? `Error: ${error.message}` : 'Note not found'}
          </Body>
          <Button
            title="Go Back"
            variant="outline"
            onPress={() => router.back()}
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const timeInfo = getTimeRemaining(note.unlockAt);
  const totalReactions = getTotalReactionCount(note.id, reactions);

  const renderComment = ({ item }: { item: Comment }) => (
    <Card style={{ padding: 12, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Caption style={{ fontWeight: '600' }}>
          {item.authorName || 'Anonymous'}
        </Caption>
        <Caption style={{ color: '#666' }}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Caption>
      </View>
      <Body>{item.content}</Body>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Note Card */}
        <Card style={{ 
          padding: 16, 
          marginBottom: 20,
          backgroundColor: timeInfo.isLocked ? '#fef7f7' : '#f7fef7',
          borderWidth: 1,
          borderColor: timeInfo.isLocked ? '#fecaca' : '#bbf7d0'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <H3 style={{ flex: 1 }}>Anonymous Note</H3>
            <View style={{ alignItems: 'flex-end' }}>
              <Caption style={{ color: '#666', marginBottom: 4 }}>
                {new Date(note.createdAt).toLocaleDateString()}
              </Caption>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
                backgroundColor: timeInfo.isLocked ? '#fecaca' : '#bbf7d0'
              }}>
                <Caption style={{ 
                  color: timeInfo.isLocked ? '#dc2626' : '#16a34a',
                  fontSize: 10,
                  fontWeight: '600'
                }}>
                  {getShortTimeRemaining(note.unlockAt)}
                </Caption>
              </View>
            </View>
          </View>
          
          <View style={{ 
            backgroundColor: '#fff', 
            padding: 16, 
            borderRadius: 8,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: timeInfo.isLocked ? '#fecaca' : '#bbf7d0'
          }}>
            <Body>{note.content}</Body>
          </View>

          <EmojiReactionBar 
            noteId={note.id} 
            reactions={reactions}
            onReactionChange={() => {
              // Reactions will update automatically via useQuery
            }}
          />
        </Card>

        {/* Comments Section */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <H3>Comments ({noteComments.length})</H3>
            <Button
              title="Add Comment"
              variant="primary"
              size="sm"
              onPress={handleAddComment}
            />
          </View>
          
          {noteComments.length === 0 ? (
            <Card style={{ padding: 16 }}>
              <Body style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                No comments yet. Be the first to comment!
              </Body>
            </Card>
          ) : (
            <View>
              {noteComments.map((comment) => (
                <View key={comment.id}>
                  {renderComment({ item: comment })}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Stats Summary */}
        <Card style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Body style={{ fontWeight: '600' }}>{totalReactions}</Body>
              <Caption>Reaction{totalReactions !== 1 ? 's' : ''}</Caption>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Body style={{ fontWeight: '600' }}>{noteComments.length}</Body>
              <Caption>Comment{noteComments.length !== 1 ? 's' : ''}</Caption>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Body style={{ fontWeight: '600' }}>
                {timeInfo.isLocked ? timeInfo.displayText : 'Unlocked'}
              </Body>
              <Caption>Status</Caption>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}