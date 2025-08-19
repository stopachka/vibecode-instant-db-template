import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { db } from '../lib/instant';

export default function HomeScreen() {
  const { isLoading, user, error } = db.useAuth();

  useEffect(() => {
    console.log('Auth state:', { isLoading, user: !!user, error });
  }, [isLoading, user, error]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    console.error('Auth error:', error);
    return <Redirect href="/login" />;
  }

  if (user) {
    console.log('User authenticated, redirecting to tabs');
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}