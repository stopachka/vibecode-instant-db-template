import React from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { H1, Body, H3, Caption } from '../../components/Typography';
import { db, Note } from '../../lib/instant';

export default function MyNotesScreen() {
  const { user } = db.useAuth();
  const { isLoading, error, data } = db.useQuery({
    notes: {
      $: { where: { authorId: user?.id || '' } }
    }
  });

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Body>Loading your notes...</Body>
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

  const notes = data?.notes || [];
  const now = Date.now();

  const renderNote = ({ item }: { item: Note }) => {
    const isLocked = item.unlockAt > now;
    const daysLeft = Math.ceil((item.unlockAt - now) / (1000 * 60 * 60 * 24));
    
    return (
      <Card style={{ marginBottom: 16, padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <H3 style={{ flex: 1 }}>
            {isLocked ? 'Locked Note' : 'Unlocked Note'}
          </H3>
          <Caption style={{ color: isLocked ? '#dc3545' : '#28a745' }}>
            {isLocked ? `${daysLeft} days left` : 'Unlocked'}
          </Caption>
        </View>
        
        <Caption style={{ marginBottom: 12, color: '#666' }}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Caption>
        
        {isLocked ? (
          <View style={{ 
            backgroundColor: '#f8f9fa', 
            padding: 16, 
            borderRadius: 8, 
            borderWidth: 2, 
            borderColor: '#e9ecef',
            borderStyle: 'dashed'
          }}>
            <Body style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
              🔒 This note will unlock on {new Date(item.unlockAt).toLocaleDateString()}
            </Body>
          </View>
        ) : (
          <View style={{ 
            backgroundColor: '#f8f9fa', 
            padding: 16, 
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#28a745'
          }}>
            <Body>{item.content}</Body>
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={{ flex: 1, padding: 16 }}>
        <H1 style={{ textAlign: 'center', marginBottom: 20 }}>
          My Notes
        </H1>
        
        {notes.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Body style={{ textAlign: 'center', color: '#666' }}>
              You haven't created any notes yet.{'\n'}
              Go to the Create tab to write your first note!
            </Body>
          </View>
        ) : (
          <FlatList
            data={notes}
            renderItem={renderNote}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}