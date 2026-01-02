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
// import { View, Text } from "react-native";

// export default function Index() {
//   return (
//     <View style={{backgroundColor: '#ffffff', flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: 20, color: '#000000' }}>Hello from Expo 👋</Text>
//     </View>
//   );
// }

