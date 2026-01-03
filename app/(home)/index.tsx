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
  Animated,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { BlurView } from "expo-blur";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [loginTime, setLoginTime] = useState("");
  const [activeTab, setActiveTab] =
    useState<"home" | "profile">("home");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLoginTime(new Date().toLocaleTimeString());
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <View style={styles.screen}>
      <SignedIn>
        <BlurView intensity={30} tint="dark" style={styles.tabs}>
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
          <TabButton label="Sign Out" danger onPress={handleSignOut} />
        </BlurView>

        <Animated.View style={{ opacity: fadeAnim }}>
          {/* HOME TAB */}
          {activeTab === "home" && (
            <>
              {/* Greeting */}
              <View style={styles.greetingCard}>
                <Text style={styles.greeting}>Welcome back</Text>
                <Text style={styles.name}>
                  {user?.firstName
                    ? user.firstName
                    : user?.primaryEmailAddress?.emailAddress}
                </Text>
              </View>

              {/* Account Status */}
              <GlassCard>
                <Text style={styles.cardTitle}>🔐 Account Status</Text>
                <Text style={styles.cardItem}>🟢 Signed in securely</Text>
                <Text style={styles.cardItem}>
                  ✔ Protected routes enabled
                </Text>
              </GlassCard>

              {/* Session Overview */}
              <GlassCard>
                <Text style={styles.cardTitle}>📊 Session Overview</Text>
                <Text style={styles.cardItem}>Login Time: {loginTime}</Text>
                <Text style={styles.cardItem}>Auth Provider: Clerk</Text>
                <Text style={styles.cardItem}>Platform: {Platform.OS}</Text>
                <Text style={styles.cardItem}>Session: Active</Text>
              </GlassCard>
            </>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <GlassCard>
              <Text style={styles.cardTitle}>👤 Profile</Text>

              <Text style={styles.profileItem}>
                <Text style={styles.profileLabel}>Name: </Text>
                {user?.firstName ?? "Not available"}
              </Text>

              <Text style={styles.profileItem}>
                <Text style={styles.profileLabel}>Email: </Text>
                {user?.primaryEmailAddress?.emailAddress}
              </Text>

              <Text style={styles.profileItem}>
                <Text style={styles.profileLabel}>User ID: </Text>
                <Text style={{ color: "#F87171" }}>{user?.id}</Text>
              </Text>
            </GlassCard>
          )}
        </Animated.View>

        {/* Footer */}
        <Text style={styles.footer}>Built with Expo & Clerk</Text>
      </SignedIn>

      <SignedOut />
    </View>
  );
}


function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <BlurView intensity={30} tint="dark" style={styles.glassCard}>
      {children}
    </BlurView>
  );
}



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


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0A0E17",
    padding: 20,
  },

  tabs: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 6,
    marginTop: 40,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: "#3B82F6",
  },
  tabDanger: {
    backgroundColor: "rgba(248,113,113,0.15)",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  tabTextDanger: {
    color: "#F87171",
  },
  
  greetingCard: {
    marginBottom: 18,
  },
  greeting: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  name: {
    fontSize: 20,
    color: "#60A5FA",
    marginTop: 4,
  },


  glassCard: {
    padding: 22,
    borderRadius: 26,
    marginBottom: 16,
    overflow: "hidden",

    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 12 },
    elevation: 20,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  cardItem: {
    fontSize: 14,
    color: "#CBD5E1",
    marginTop: 4,
  },

  
  profileItem: {
    fontSize: 15,
    marginBottom: 10,
    color: "#E5E7EB",
  },
  profileLabel: {
    fontWeight: "600",
    color: "#FFFFFF",
  },

  footer: {
    marginTop: "auto",
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
  },
});
