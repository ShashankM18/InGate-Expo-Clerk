import { SignedIn, useUser } from '@clerk/clerk-expo';
import { Text, View } from 'react-native';
import { SignOutButton } from '@/app/components/SignOutButton';

export default function ProfileScreen() {
  const { user } = useUser();

  return (
    <SignedIn>
      <View style={{ padding: 24, gap: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '600' }}>Profile</Text>
        <View style={{ gap: 6 }}>
          <Text style={{ color: '#6B7280' }}>User ID</Text>
          <Text selectable style={{ color:'white',fontFamily: 'monospace' }}>{user?.id}</Text>
        </View>
        <View style={{ gap: 6 }}>
          <Text style={{ color: '#6B7280' }}>Email</Text>
          <Text style={{ color: 'white' }}>{user?.primaryEmailAddress?.emailAddress || user?.emailAddresses[0]?.emailAddress}</Text>
        </View>
        {user?.username ? (
          <View style={{ gap: 6 }}>
            <Text style={{ color: '#6B7280' }}>Username</Text>
            <Text style={{ color: 'white' }}>@{user?.username}</Text>
          </View>
        ) : null}
        <SignOutButton />
      </View>
    </SignedIn>
  );
}
