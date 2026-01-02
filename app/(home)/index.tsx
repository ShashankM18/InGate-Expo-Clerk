import { SignedIn, SignedOut, useUser, useAuth } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import type { Href } from "expo-router";
import { Text, View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [loginTime, setLoginTime] = useState("");

  useEffect(() => {
    setLoginTime(new Date().toLocaleTimeString());
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <SignedIn>
        {/* Greeting */}
        <Text style={styles.greeting}>👋 Welcome back</Text>
        <Text style={styles.email}>
          {user?.emailAddresses[0]?.emailAddress}
        </Text>

        {/* Account Status */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔐 Account Status</Text>
          <Text style={styles.cardItem}>🟢 Signed in securely</Text>
          <Text style={styles.cardItem}>✔ Protected routes enabled</Text>
        </View>

        {/* Session Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Session Overview</Text>
          <Text style={styles.cardItem}>Login Time: {loginTime}</Text>
          <Text style={styles.cardItem}>Auth Provider: Clerk</Text>
          <Text style={styles.cardItem}>Platform: {Platform.OS}</Text>
          <Text style={styles.cardItem}>Session: Active</Text>
        </View>

        {/* Actions */}
        <Link href="/(home)/profile" asChild>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryText}>View Profile</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>Built with Expo & Clerk</Text>
      </SignedIn>

      <SignedOut>
        {/* Protected by (home)/_layout */}
      </SignedOut>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9FAFB",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    color: "#111827",
  },
  email: {
    fontSize: 16,
    color: "#2563EB",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardItem: {
    fontSize: 14,
    color: "#374151",
    marginTop: 4,
  },
  primaryBtn: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  logoutText: {
    textAlign: "center",
    color: "#DC2626",
    fontWeight: "500",
    marginTop: 4,
  },
  footer: {
    marginTop: "auto",
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
  },
});
