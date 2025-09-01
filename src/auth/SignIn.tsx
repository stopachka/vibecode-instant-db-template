import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../lib/db";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { SplashScreen } from "expo-router";

export default function SignIn() {
  useLayoutEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  const [sentEmail, setSentEmail] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            {!sentEmail ? (
              <EmailStep onSendEmail={setSentEmail} />
            ) : (
              <CodeStep sentEmail={sentEmail} />
            )}
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

function EmailStep({ onSendEmail }: { onSendEmail: (email: string) => void }) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) return;

    onSendEmail(email.trim());

    db.auth.sendMagicCode({ email: email.trim() }).catch((err: any) => {
      console.log("hello!", err);
      Alert.alert("Uh oh: " + err.body?.message);
      onSendEmail("");
    });
  };

  return (
    <View>
      <Text style={styles.emoji}>👋</Text>
      <Text style={styles.title}>Let's log you in</Text>
      <Text style={styles.description}>
        Enter your email and we'll send you a verification code (we'll create an
        account if you don't have one).
      </Text>
      <TextInput
        autoFocus
        value={email}
        onChangeText={setEmail}
        textContentType="emailAddress"
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        placeholder="you@example.com"
      />
      <Button onPress={handleSubmit} variant="primary">
        Send code
      </Button>
    </View>
  );
}

/* --- Step 2: verify code --- */
function CodeStep({ sentEmail }: { sentEmail: string }) {
  const [code, setCode] = useState("");

  const handleVerify = () => {
    if (!code.trim()) return;

    db.auth
      .signInWithMagicCode({ email: sentEmail, code: code.trim() })
      .catch((err: any) => {
        alert("Uh oh: " + err.body?.message);
        setCode("");
      });
  };

  return (
    <View>
      <Text style={styles.emoji}>✉️</Text>
      <Text style={styles.title}>Enter your code</Text>
      <Text style={styles.description}>
        We emailed&nbsp;
        <Text style={styles.semibold}>{sentEmail}</Text>. Paste the six-digit
        code here.
      </Text>
      <TextInput
        autoFocus
        value={code}
        onChangeText={setCode}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
      />

      <Button onPress={handleVerify} variant="primary">
        Verify code
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    padding: 16,
  },
  emoji: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    color: "#374151",
    marginBottom: 16,
    lineHeight: 20,
  },
  semibold: {
    fontWeight: "600",
  },
});
