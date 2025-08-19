import React, { useMemo, useState } from 'react';
import { View, FlatList, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { H1, Body, H3, Caption } from '../../components/Typography';
import { Button } from '../../components/Button';
import { EmojiReactionBar } from '../../components/EmojiReactionBar';
import { db, Note, Comment, id } from '../../lib/instant';
import { Reaction, getTotalReactionCount } from '../../lib/reactions';
import { getTimeRemaining, getShortTimeRemaining } from '../../lib/timeUtils';

export default function ExploreScreen() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [anonymousName, setAnonymousName] = useState<string>('');
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  const { user } = db.useAuth();
  
  // Query all data including reactions
  const { isLoading, error, data } = db.useQuery({
    notes: {},
    comments: {},
    reactions: {}
  });
  
  // Filter to show all notes from other users (both locked and unlocked)
  const otherUsersNotes = useMemo(() => {
    if (!data?.notes || !user?.id) return [];
    return data.notes.filter((note: any) => note.authorId !== user.id);
  }, [data?.notes, user?.id]);

  const handleAddComment = async () => {
    if (!selectedNote || !commentText.trim()) {
      Alert.alert('Error', 'Please write a comment');
      return;
    }

    if (!anonymousName.trim()) {
      Alert.alert('Error', 'Please enter a display name');
      return;
    }

    setIsSubmittingComment(true);
    
    try {
      await db.transact(
        db.tx.comments[id()].update({
          content: commentText.trim(),
          noteId: selectedNote.id,
          createdAt: Date.now(),
          authorName: anonymousName.trim(),
        })
      );

      setCommentText('');
      Alert.alert('Success', 'Comment added!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment. Please try again.');
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Body>Loading notes...</Body>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Body style={{ color: '#dc3545' }}>Error loading notes: {error.message}</Body>
        </View>
      </SafeAreaView>
    );
  }

  const notes = otherUsersNotes;
  const comments = data?.comments || [];
  const reactions = (data?.reactions || []) as Reaction[];

  const getCommentsForNote = (noteId: string) => {
    return comments.filter((comment: Comment) => comment.noteId === noteId);
  };

  const renderNote = ({ item }: { item: Note }) => {
    const noteComments = getCommentsForNote(item.id);
    const timeInfo = getTimeRemaining(item.unlockAt);
    const totalReactions = getTotalReactionCount(item.id, reactions);
    
    return (
      <Card style={{ 
        marginBottom: 16, 
        padding: 16,
        backgroundColor: timeInfo.isLocked ? '#fef7f7' : '#f7fef7',
        borderWidth: 1,
        borderColor: timeInfo.isLocked ? '#fecaca' : '#bbf7d0'
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <H3 style={{ flex: 1 }}>Anonymous Note</H3>
          <View style={{ alignItems: 'flex-end' }}>
            <Caption style={{ color: '#666', marginBottom: 4 }}>
              {new Date(item.createdAt).toLocaleDateString()}
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
                {getShortTimeRemaining(item.unlockAt)}
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
          <Body>{item.content}</Body>
        </View>

        <EmojiReactionBar 
          noteId={item.id} 
          reactions={reactions}
          onReactionChange={() => {
            // Trigger a re-render by updating state
            // The useQuery will automatically update
          }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {totalReactions > 0 && (
              <Caption style={{ color: '#666' }}>
                {totalReactions} reaction{totalReactions !== 1 ? 's' : ''}
              </Caption>
            )}
            <Caption style={{ color: '#666' }}>
              {noteComments.length} comment{noteComments.length !== 1 ? 's' : ''}
            </Caption>
          </View>
          <Button
            title="View & Comment"
            variant="outline"
            size="sm"
            onPress={() => setSelectedNote(item)}
          />
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={{ flex: 1 }}>
        <H1 style={{ textAlign: 'center', marginBottom: 20, marginTop: 16, paddingHorizontal: 16 }}>
          Explore Notes
        </H1>
        
        {notes.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
            <Body style={{ textAlign: 'center', color: '#666' }}>
              No notes from other users yet.{'\n'}
              Check back later to see what others are sharing!
            </Body>
          </View>
        ) : (
          <FlatList
            data={notes}
            renderItem={renderNote}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          />
        )}
      </View>

      {/* Note Detail Modal */}
      <Modal
        visible={selectedNote !== null}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
          <View style={{ flex: 1, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <H1>Note & Comments</H1>
              <Button
                title="Close"
                variant="ghost"
                size="sm"
                onPress={() => setSelectedNote(null)}
              />
            </View>

            {selectedNote && (
              <View style={{ flex: 1 }}>
                <Card style={{ 
                  padding: 16, 
                  marginBottom: 20,
                  backgroundColor: getTimeRemaining(selectedNote.unlockAt).isLocked ? '#fef7f7' : '#f7fef7',
                  borderWidth: 1,
                  borderColor: getTimeRemaining(selectedNote.unlockAt).isLocked ? '#fecaca' : '#bbf7d0'
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <Caption style={{ color: '#666' }}>
                      Posted: {new Date(selectedNote.createdAt).toLocaleDateString()}
                    </Caption>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 12,
                      backgroundColor: getTimeRemaining(selectedNote.unlockAt).isLocked ? '#fecaca' : '#bbf7d0'
                    }}>
                      <Caption style={{ 
                        color: getTimeRemaining(selectedNote.unlockAt).isLocked ? '#dc2626' : '#16a34a',
                        fontSize: 10,
                        fontWeight: '600'
                      }}>
                        {getShortTimeRemaining(selectedNote.unlockAt)}
                      </Caption>
                    </View>
                  </View>
                  <Body style={{ marginBottom: 12 }}>{selectedNote.content}</Body>
                  
                  <EmojiReactionBar 
                    noteId={selectedNote.id} 
                    reactions={reactions}
                    onReactionChange={() => {
                      // Reactions will update automatically via useQuery
                    }}
                  />
                </Card>

                <H3 style={{ marginBottom: 12 }}>Comments</H3>
                
                <FlatList
                  data={getCommentsForNote(selectedNote.id)}
                  keyExtractor={(item) => item.id}
                  style={{ flex: 1, marginBottom: 20 }}
                  renderItem={({ item }) => (
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
                  )}
                  ListEmptyComponent={
                    <Body style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                      No comments yet. Be the first to comment!
                    </Body>
                  }
                />

                <Card style={{ padding: 16 }}>
                  <H3 style={{ marginBottom: 12 }}>Add Comment</H3>
                  
                  <TextInput
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#e9ecef',
                      padding: 12,
                      marginBottom: 12,
                      fontSize: 16,
                    }}
                    placeholder="Display name (anonymous)"
                    value={anonymousName}
                    onChangeText={setAnonymousName}
                    maxLength={50}
                  />
                  
                  <TextInput
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#e9ecef',
                      padding: 12,
                      marginBottom: 12,
                      fontSize: 16,
                      minHeight: 80,
                      textAlignVertical: 'top',
                    }}
                    multiline
                    placeholder="Write your comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                    maxLength={500}
                  />
                  
                  <Button
                    title={isSubmittingComment ? 'Adding Comment...' : 'Add Comment'}
                    onPress={handleAddComment}
                    disabled={isSubmittingComment || !commentText.trim() || !anonymousName.trim()}
                    fullWidth
                  />
                </Card>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}