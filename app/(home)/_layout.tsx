import { Stack } from 'expo-router/stack';
import { Redirect } from 'expo-router';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';

export default function Layout() {
  return (
    <>
      <SignedIn>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ title: 'Profile' }} />
        </Stack>
      </SignedIn>
      <SignedOut>
        <Redirect href="/(auth)/sign-in" />
      </SignedOut>
    </>
  );
}
