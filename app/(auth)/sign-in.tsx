import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import type { Href } from 'expo-router';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Sign in</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(v) => setEmailAddress(v)}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry
        onChangeText={(v) => setPassword(v)}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }}
      />
      <TouchableOpacity onPress={onSignInPress} style={{ backgroundColor: '#111', padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Continue</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Text>Don't have an account?</Text>
        <Link href={'/(auth)/sign-up' as Href}>
          <Text style={{ color: '#0a7' }}>Sign up</Text>
        </Link>
      </View>
    </View>
  );
}
