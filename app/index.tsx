import { Redirect } from 'expo-router';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import type { Href } from 'expo-router';

export default function Index() {
  return (
    <>
      <SignedIn>
        <Redirect href={'/(home)' as Href} />
      </SignedIn>
      <SignedOut>
        <Redirect href={'/(auth)/sign-in' as Href} />
      </SignedOut>
    </>
  );
}


