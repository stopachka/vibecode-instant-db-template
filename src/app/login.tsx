import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H1, Body, H3, Caption } from '../components/Typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { db } from '../lib/instant';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [sentEmail, setSentEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const codeRef = useRef<TextInput | null>(null);

  // Check if user is already authenticated
  const { user } = db.useAuth();
  
  useEffect(() => {
    if (user) {
      console.log('User already authenticated, redirecting');
      router.replace('/(tabs)');
    }
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
          <H1 style={{ textAlign: 'center', marginBottom: 20 }}>Welcome</H1>
          <Card style={{ padding: 16 }}>
            {!sentEmail ? (
              <View>
                <H3 style={{ marginBottom: 12 }}>Sign in with email</H3>
                <Body style={{ marginBottom: 12, color: '#666' }}>
                  Enter your email, we will send you a one-time code.
                 </Body>
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
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                />
                <Button
                  title={loading ? 'Sending...' : 'Send Code'}
                  onPress={async () => {
                    if (!email) return;
                    setLoading(true);
                    setError('');
                    try {
                      await db.auth.sendMagicCode({ email });
                      setSentEmail(email);
                      setTimeout(() => codeRef.current?.focus?.(), 50);
                    } catch (e: any) {
                      console.error('Send code error:', e);
                      setError(e?.body?.message || 'Failed to send code');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  fullWidth
                />
                {error ? (
                  <Caption style={{ color: '#dc3545', textAlign: 'center', marginTop: 8 }}>
                    {error}
                  </Caption>
                ) : null}
              </View>
            ) : (
              <View>
                <H3 style={{ marginBottom: 12 }}>Enter the code</H3>
                <Caption style={{ marginBottom: 12, color: '#666' }}>
                  We sent a code to {sentEmail}
                </Caption>
                <TextInput
                  ref={codeRef}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#e9ecef',
                    padding: 12,
                    marginBottom: 12,
                    fontSize: 16,
                    letterSpacing: 4,
                    textAlign: 'center',
                  }}
                  placeholder="123456"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  value={code}
                  onChangeText={(text) => {
                    setCode(text);
                    setError('');
                  }}
                />
                <Button
                  title={loading ? 'Verifying...' : 'Verify Code'}
                  onPress={async () => {
                    if (!code) return;
                    setLoading(true);
                    setError('');
                    try {
                      const result = await db.auth.signInWithMagicCode({ email: sentEmail, code });
                      console.log('Auth success:', result);
                      // Force navigation after successful auth
                      router.replace('/(tabs)');
                    } catch (e: any) {
                      console.error('Auth error:', e);
                      setError(e?.body?.message || 'Invalid code');
                      setCode('');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  fullWidth
                />
                {error ? (
                  <Caption style={{ color: '#dc3545', textAlign: 'center', marginTop: 8 }}>
                    {error}
                  </Caption>
                ) : null}
                <Button
                  title="Back"
                  variant="ghost"
                  size="sm"
                  onPress={() => setSentEmail('')}
                />
              </View>
            )}
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
