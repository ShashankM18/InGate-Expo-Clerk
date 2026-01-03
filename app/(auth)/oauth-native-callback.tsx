import { View, ActivityIndicator, Text } from "react-native";

export default function OAuthNativeCallback() {
  // ⛔ NO router.replace here
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#EEF2F7",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={{ marginTop: 10, color: "#6B7280" }}>
        Signing you in…
      </Text>
    </View>
  );
}
