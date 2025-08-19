import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { H1, Body, H3, Caption } from '../../components/Typography';
import { Button } from '../../components/Button';
import { db } from '../../lib/instant';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user } = db.useAuth();
  const { data: notesData } = db.useQuery({
    notes: {
      $: { where: { authorId: user?.id || '' } }
    }
  });

  const notes = notesData?.notes || [];
  const now = Date.now();
  const lockedNotes = notes.filter((note: any) => note.unlockAt > now);
  const unlockedNotes = notes.filter((note: any) => note.unlockAt <= now);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await db.auth.signOut();
            router.replace('/login');
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Body>Loading...</Body>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <H1 style={{ textAlign: 'center', marginBottom: 20 }}>
          Profile
        </H1>

        <Card style={{ padding: 16, marginBottom: 16 }}>
          <H3 style={{ marginBottom: 8 }}>Account</H3>
          <Body style={{ marginBottom: 4 }}>
            Email: {user?.email}
          </Body>
          <Caption style={{ color: '#666' }}>
            User ID: {user?.id}
          </Caption>
        </Card>

        <Card style={{ padding: 16, marginBottom: 16 }}>
          <H3 style={{ marginBottom: 12 }}>Your Notes</H3>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Body>Total Notes:</Body>
            <Body style={{ fontWeight: '600' }}>{notes.length}</Body>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Body>Locked Notes:</Body>
            <Body style={{ fontWeight: '600', color: '#dc3545' }}>{lockedNotes.length}</Body>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Body>Unlocked Notes:</Body>
            <Body style={{ fontWeight: '600', color: '#28a745' }}>{unlockedNotes.length}</Body>
          </View>
        </Card>

        <Card style={{ padding: 16, marginBottom: 16 }}>
          <H3 style={{ marginBottom: 12 }}>About Future Self</H3>
          <Body style={{ color: '#666', lineHeight: 22 }}>
            Write notes to your future self that unlock after 30 days. 
            Share your thoughts anonymously and discover what others have written.
          </Body>
        </Card>

        <Button
          title="Sign Out"
          variant="danger"
          onPress={handleSignOut}
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
}