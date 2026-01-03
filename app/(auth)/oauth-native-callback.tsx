import { View, ActivityIndicator, Text } from "react-native";

export default function OAuthNativeCallback() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0A0E17",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={{ marginTop: 10, color: "#F9FAFB" }}>
        Signing you in…
      </Text>
    </View>
  );
}
