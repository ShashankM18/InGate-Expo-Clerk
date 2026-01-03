import {
  SignedIn,
  SignedOut,
  useUser,
  useAuth,
} from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [loginTime, setLoginTime] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "profile">("home");

  useEffect(() => {
    setLoginTime(new Date().toLocaleTimeString());
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <View style={styles.container}>
      <SignedIn>
        {/* ---------------- TOP TABS ---------------- */}
        <View style={styles.tabs}>
          <TabButton
            label="Home"
            active={activeTab === "home"}
            onPress={() => setActiveTab("home")}
          />
          <TabButton
            label="Profile"
            active={activeTab === "profile"}
            onPress={() => setActiveTab("profile")}
          />
          <TabButton
            label="Sign Out"
            danger
            onPress={handleSignOut}
          />
        </View>

        {/* ---------------- HOME TAB ---------------- */}
        {activeTab === "home" && (
          <>
            {/* Greeting */}
            <View style={styles.greetingCard}>
              <Text style={styles.greeting}>Welcome back!!</Text>
              <Text style={styles.name}>
                {user?.firstName
                  ?  user.firstName
                  : user?.primaryEmailAddress?.emailAddress}

              </Text>
            </View>

            {/* Account Status */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🔐 Account Status</Text>
              <Text style={styles.cardItem}>🟢 Signed in securely</Text>
              <Text style={styles.cardItem}>
                ✔ Protected routes enabled
              </Text>
            </View>

            {/* Session Overview */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📊 Session Overview</Text>
              <Text style={styles.cardItem}>
                Login Time: {loginTime}
              </Text>
              <Text style={styles.cardItem}>
                Auth Provider: Clerk
              </Text>
              <Text style={styles.cardItem}>
                Platform: {Platform.OS}
              </Text>
              <Text style={styles.cardItem}>
                Session: Active
              </Text>
            </View>

            {/* Action */}
            {/* <Link href="/(home)/profile" asChild>
              <TouchableOpacity style={styles.primaryBtn}>
                <Text style={styles.primaryText}>View Profile</Text>
              </TouchableOpacity>
            </Link> */}
          </>
        )}

        {/* ---------------- PROFILE TAB ---------------- */}
        {activeTab === "profile" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>👤 Profile</Text>

            <Text style={styles.profileItem}>
              <Text style={styles.profileLabel}>Name: </Text>
              {user?.firstName ? user.firstName : "Not available"}
            </Text>

            <Text style={styles.profileItem}>
              <Text style={styles.profileLabel}>Email: </Text>
              {user?.primaryEmailAddress?.emailAddress}
            </Text>

            <Text style={styles.profileItem}>
              <Text style={styles.profileLabel}>User ID: </Text>
              <Text style={{color: '#d55757ff'}}>{user?.id}</Text>
            </Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>Built with Expo & Clerk</Text>
      </SignedIn>

      <SignedOut>{/* protected by layout */}</SignedOut>
    </View>
  );
}

/* ---------------- TAB BUTTON ---------------- */

function TabButton({
  label,
  active,
  danger,
  onPress,
}: {
  label: string;
  active?: boolean;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tabBtn,
        active && styles.tabActive,
        danger && styles.tabDanger,
      ]}
    >
      <Text
        style={[
          styles.tabText,
          active && styles.tabTextActive,
          danger && styles.tabTextDanger,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#EEF2F7",
  },

  /* Tabs */
  tabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 6,
    marginBottom: 16,
    marginTop:40,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal:5,
  },
  tabActive: {
    backgroundColor: "#3B82F6",
  },
  tabDanger: {
    backgroundColor: "#FEE2E2",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  tabTextDanger: {
    color: "#DC2626",
  },

  /* Cards */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 26,
    marginBottom: 16,
  },
  greetingCard:{
    padding: 15,
    marginBottom: 16,

  },
  greeting: {
    fontSize: 40,
    fontWeight: "700",
    color: "#111827",
  },
  name: {
    fontSize: 22,
    color: "#3B82F6",
    marginTop: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardItem: {
    fontSize: 14,
    color: "#374151",
    marginTop: 4,
  },

  /* Profile */
  profileItem: {
    fontSize: 15,
    marginBottom: 10,
  },
  profileLabel: {
    fontWeight: "600",
  },

  /* Buttons */
  primaryBtn: {
    backgroundColor: "#3B82F6",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  footer: {
    marginTop: "auto",
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
  },
});
