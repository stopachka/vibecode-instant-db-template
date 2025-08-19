import React, { useState } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Card } from '../components/Card';
import { TextInput } from '../components/TextInput';
import { H1, Body, H3, Caption } from '../components/Typography';
import { Button } from '../components/Button';
import { db, id } from '../lib/instant';

export default function AddCommentScreen() {
  const params = useLocalSearchParams();
  const noteId = typeof params.noteId === 'string' ? params.noteId : params.noteId?.[0];
  const [commentText, setCommentText] = useState<string>('');
  const [anonymousName, setAnonymousName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto-focus is handled by the TextInput component

  const handleSubmitComment = async () => {
    if (!noteId || !commentText.trim() || !anonymousName.trim()) {
      Alert.alert('Error', 'Please fill in both your name and comment');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await db.transact(
        db.tx.comments[id()].update({
          content: commentText.trim(),
          noteId: noteId,
          createdAt: Date.now(),
          authorName: anonymousName.trim(),
        })
      );

      Alert.alert('Success', 'Comment added!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment. Please try again.');
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!noteId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Body style={{ color: '#dc3545' }}>Invalid note ID</Body>
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, gap: 20 }}>
            <View>
              <H1 style={{ textAlign: 'center', marginBottom: 8 }}>
                Add Your Comment
              </H1>
              <Body style={{ textAlign: 'center', color: '#666' }}>
                Share your thoughts on this note anonymously
              </Body>
            </View>

            <Card style={{ padding: 16, flex: 1 }}>
              <H3 style={{ marginBottom: 16 }}>Comment Details</H3>
              
              <View style={{ marginBottom: 16 }}>
                <Caption style={{ marginBottom: 8, fontWeight: '600' }}>
                  Display Name
                </Caption>
                <TextInput
                  value={anonymousName}
                  onChangeText={setAnonymousName}
                  placeholder="Enter your anonymous name"
                  maxLength={50}
                  showCharacterCount={true}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    // Focus on comment text input (would need ref)
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Caption style={{ marginBottom: 8, fontWeight: '600' }}>
                  Your Comment
                </Caption>
                <TextInput
                  style={{ flex: 1 }}
                  textStyle={{ minHeight: 120 }}
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Write your comment here..."
                  multiline={true}
                  maxLength={500}
                  showCharacterCount={true}
                  autoFocus={true}
                />
              </View>
            </Card>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => router.back()}
                style={{ flex: 1 }}
              />
              <Button
                title={isSubmitting ? 'Posting...' : 'Post Comment'}
                variant="primary"
                onPress={handleSubmitComment}
                disabled={isSubmitting || !commentText.trim() || !anonymousName.trim()}
                style={{ flex: 2 }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}