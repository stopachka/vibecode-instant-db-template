import React, { useState } from 'react';
import { View, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { TextInput } from '../../components/TextInput';
import { H1, Body, H3, Caption } from '../../components/Typography';
import { db, id } from '../../lib/instant';

export default function CreateNoteScreen() {
  const [noteContent, setNoteContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = db.useAuth();

  const handleCreateNote = async () => {
    if (!noteContent.trim()) {
      Alert.alert('Error', 'Please write something in your note');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const now = Date.now();
      const unlockDate = now + (30 * 24 * 60 * 60 * 1000); // 30 days from now
      
      await db.transact(
        db.tx.notes[id()].update({
          content: noteContent.trim(),
          createdAt: now,
          unlockAt: unlockDate,
          authorId: user?.id || 'anonymous',
          isAnonymous: false,
        })
      );

      Alert.alert(
        'Note Created!', 
        `Your note has been locked and will be available to read in 30 days (${new Date(unlockDate).toLocaleDateString()}).`,
        [{ text: 'OK', onPress: () => setNoteContent('') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create note. Please try again.');
      console.error('Error creating note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
          <View style={{ flex: 1, gap: 20 }}>
            <View>
              <H1 style={{ textAlign: 'center', marginBottom: 8 }}>
                Future Self
              </H1>
              <Body style={{ textAlign: 'center', color: '#666' }}>
                Write a note to your future self. It will be locked for 30 days.
              </Body>
            </View>

            <Card style={{ flex: 1, padding: 16 }}>
              <H3 style={{ marginBottom: 12 }}>
                Your Note
              </H3>
              
              <TextInput
                style={{
                  flex: 1,
                }}
                textStyle={{
                  minHeight: 200,
                }}
                multiline
                placeholder="Dear future me..."
                value={noteContent}
                onChangeText={setNoteContent}
                maxLength={2000}
                showCharacterCount={true}
                autoFocus={true}
              />
              
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }}>
                <Caption style={{ color: '#666' }}>
                  Unlocks in 30 days
                </Caption>
              </View>
            </Card>

            <Button
              title={isSubmitting ? 'Creating Note...' : 'Lock Note for 30 Days'}
              onPress={handleCreateNote}
              disabled={isSubmitting || !noteContent.trim()}
              fullWidth
              style={{ 
                opacity: (isSubmitting || !noteContent.trim()) ? 0.5 : 1 
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}