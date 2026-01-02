import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { Text, View } from 'react-native';
import { SignOutButton } from '@/app/components/SignOutButton';

export default function Page() {
  const { user } = useUser();

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <SignedIn>
        <Text style={{ color:"red",fontSize: 18 }}>Hello {user?.emailAddresses[0]?.emailAddress}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href={'/(auth)/sign-in' as Href}>
          <Text style={{ color: '#0a7' }}>Sign in</Text>
        </Link>
        <Link href={'/(auth)/sign-up' as Href}>
          <Text style={{ color: '#0a7' }}>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  );
}
