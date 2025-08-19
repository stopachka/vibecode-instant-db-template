import React, { useMemo } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { H1, Body, Caption } from '../../components/Typography';
import { db, Note } from '../../lib/instant';
import { Reaction } from '../../lib/reactions';
import { NoteListItem } from '../../components/NoteListItem';
import { useVisitedStore } from '../../state/visited';

export default function ExploreScreen() {
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

  // Sort newest first by createdAt desc
  const notes = useMemo(() => {
    const arr = [...otherUsersNotes];
    arr.sort((a: any, b: any) => (b?.createdAt ?? 0) - (a?.createdAt ?? 0));
    return arr;
  }, [otherUsersNotes]);

  const reactions = (data?.reactions || []) as Reaction[];

  const isVisitedFn = useVisitedStore((s) => s.isVisited);
  const markVisited = useVisitedStore((s) => s.markVisited);

  const handleViewNote = (noteId: string) => {
    markVisited(noteId);
    router.push(`/note-detail?id=${noteId}`);
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

  const renderItem = ({ item }: { item: Note }) => (
    <NoteListItem
      id={item.id}
      createdAt={item.createdAt}
      unlockAt={item.unlockAt}
      content={item.content}
      reactions={reactions}
      isVisited={isVisitedFn(item.id)}
      onPress={() => handleViewNote(item.id)}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={{ flex: 1 }}>
          <H1 style={{ textAlign: 'center', marginBottom: 4, marginTop: 16, paddingHorizontal: 16 }}>
            Explore
          </H1>
          <Caption align="center" style={{ marginBottom: 12 }}>Newest first</Caption>
          
          {notes.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
              <Body style={{ textAlign: 'center', color: '#666' }}>
                No notes from other users yet.{'\n'}
                Check back later to see what others are sharing!
              </Body>
            </View>
          ) : (
          <FlashList
            data={notes}
            renderItem={renderItem}
            keyExtractor={(item: Note) => item.id}
            estimatedItemSize={150}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          />
          )}
      </View>
    </SafeAreaView>
  );
}