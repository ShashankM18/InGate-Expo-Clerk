import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View style={{ padding: 24, gap: 12 }}>
        <Text style={{ backgroundColor:"white",color: 'red', fontSize: 24, fontWeight: '600' }}>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(v) => setCode(v)}
          style={{ color: 'white', borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }}
        />
        <TouchableOpacity onPress={onVerifyPress} style={{ backgroundColor: '#111', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Verify</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{color:'white', fontSize: 24, fontWeight: '600' }}>Sign up</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(v) => setEmailAddress(v)}
        style={{ color: 'white', borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry
        onChangeText={(v) => setPassword(v)}
        style={{ color: 'white', borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }}
      />
      <TouchableOpacity onPress={onSignUpPress} style={{ backgroundColor: '#111', padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Continue</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Text>Already have an account?</Text>
        <Link href="/(auth)/sign-in">
          <Text style={{ color: '#0a7' }}>Sign in</Text>
        </Link>
      </View>
    </View>
  );
}
