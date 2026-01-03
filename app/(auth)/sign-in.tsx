import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSignIn, useOAuth } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { makeRedirectUri } from "expo-auth-session";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const googleOAuth = useOAuth({ strategy: "oauth_google" });
  const microsoftOAuth = useOAuth({ strategy: "oauth_microsoft" });

  const redirectUrl = makeRedirectUri({
    scheme: "myapp",
    path: "/oauth-native-callback",
  });

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [oauthError, setOauthError] = React.useState<string | null>(null);
  const [forgotMode, setForgotMode] = React.useState(false);
  const [resetRequested, setResetRequested] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState("");
  const [resetCode, setResetCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);
  const [requesting, setRequesting] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);

  // Animation for subtle entrance
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const onOAuthPress = async (oauth: any) => {
    try {
      const { createdSessionId, setActive } =
        await oauth.startOAuthFlow({ redirectUrl });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch {
      setOauthError("Sign in with provider failed. Please try again.");
    }
  };

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      setAuthError(null);
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      }
    } catch {
      setAuthError("Invalid email or password.");
    }
  };

  const onRequestReset = async () => {
    if (!isLoaded || requesting) return;
    setResetError(null);
    setRequesting(true);
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: (resetEmail || email).trim(),
      });
      setResetRequested(true);
    } catch (e: any) {
      const msg = e?.errors?.[0]?.message || e?.message || "Failed to send reset code";
      setResetError(msg);
    } finally {
      setRequesting(false);
    }
  };

  const onResetPassword = async () => {
    if (!isLoaded || resetting) return;
    setResetError(null);
    setResetting(true);
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode.trim(),
        password: newPassword,
      });

      if (result?.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setForgotMode(false);
        setResetRequested(false);
        setResetEmail("");
        setResetCode("");
        setNewPassword("");
        router.replace("/");
      }
    } catch (e: any) {
      const msg = e?.errors?.[0]?.message || e?.message || "Password reset failed";
      setResetError(msg);
    } finally {
      setResetting(false);
    }
  };

  // Forgot password screen
  if (forgotMode) {
    return (
      <View style={styles.screen}>
        <View style={styles.background}>
          <View style={styles.blob1} />
          <View style={styles.blob2} />
          <View style={styles.blob3} />
        </View>
        <Animated.View style={[styles.glassCardContainer, { opacity: fadeAnim }]}>
          <BlurView intensity={35} tint="dark" style={styles.glassCard}>
            <Text style={styles.title}>{resetRequested ? "Verify code" : "Reset password"}</Text>

            {!resetRequested ? (
              <>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.glassInput}
                  autoCapitalize="none"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  placeholderTextColor="#94A3B8"
                />
                {resetError && <Text style={styles.errorText}>{resetError}</Text>}
                <TouchableOpacity style={styles.primaryBtn} onPress={onRequestReset}>
                  <Text style={styles.primaryText}>{requesting ? "Sending..." : "Send reset code"}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.label}>Verification code</Text>
                <TextInput
                  style={styles.glassInput}
                  autoCapitalize="none"
                  value={resetCode}
                  onChangeText={setResetCode}
                  placeholderTextColor="#94A3B8"
                />
                <Text style={styles.label}>New password</Text>
                <View style={styles.passwordBox}>
                  <TextInput
                    style={styles.passwordInput}
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholderTextColor="#94A3B8"
                  />
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Ionicons
                      name={showNewPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#E2E8F0"
                    />
                  </TouchableOpacity>
                </View>
                {resetError && <Text style={styles.errorText}>{resetError}</Text>}
                <TouchableOpacity style={styles.primaryBtn} onPress={onResetPassword}>
                  <Text style={styles.primaryText}>{resetting ? "Resetting..." : "Set new password"}</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Remembered it?</Text>
              <TouchableOpacity onPress={() => { setForgotMode(false); setResetRequested(false); setResetError(null); }}>
                <Text style={styles.link}>Back to sign in</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* 🎨 Enhanced gradient background with subtle blobs */}
      <View style={styles.background}>
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <View style={styles.blob3} />
      </View>

      {/* Glass card with enhanced blur & glow */}
      <Animated.View style={[styles.glassCardContainer, { opacity: fadeAnim }]}>
        <BlurView intensity={35} tint="dark" style={styles.glassCard}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.subtitle}>InGate</Text>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.glassInput}
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#94A3B8"
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#E2E8F0"
              />
            </TouchableOpacity>
          </View>

          {authError && <Text style={styles.errorText}>{authError}</Text>}

          {/* Forgot password link */}
          <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 12 }} onPress={() => { setForgotMode(true); setResetEmail(email); }}>
            <Text style={{ color: "#60A5FA", fontWeight: "600" }}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Remember */}
          <TouchableOpacity
            style={styles.remember}
            onPress={() => setRemember(!remember)}
          >
            <Ionicons
              name={remember ? "checkbox" : "square-outline"}
              size={18}
              color="#22D3EE"
            />
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>

          {/* Login - Enhanced gradient button */}
          <TouchableOpacity style={styles.primaryBtn} onPress={onSignInPress}>
            <Text style={styles.primaryText}>Login</Text>
          </TouchableOpacity>

          {/* Divider */}
          <Text style={styles.divider}>Or sign in with</Text>

          {/* OAuth - Glass social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => onOAuthPress(googleOAuth)}
            >
              <Ionicons name="logo-google" size={22} color="#DB4437" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => onOAuthPress(microsoftOAuth)}
            >
              <Ionicons name="logo-windows" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {oauthError && <Text style={styles.errorText}>{oauthError}</Text>}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>No account?</Text>
            <Link href="/(auth)/sign-up">
              <Text style={styles.link}>Sign up</Text>
            </Link>
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
}




const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0A0E17",
  },

  glassCardContainer: {
    borderRadius: 24,
  },

  blob1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(37, 99, 235, 0.25)",
    top: -40,
    left: -40,
  },

  blob2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(99, 102, 241, 0.22)",
    top: 60,
    right: -30,
  },

  blob3: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(56, 189, 248, 0.18)",
    bottom: -60,
    alignSelf: "center",
  },

  glassCard: {
    borderRadius: 24,
    padding: 32,
    overflow: "hidden",

  
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 12 },
    elevation: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 2,
  },


  subtitle: {
    fontSize: 40,
    fontWeight: "800",
    color: "#3198beff",
    textAlign: "center",
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    color: "#D1D5DB", 
    marginBottom: 8,
    fontWeight: "500",
  },

  glassInput: {
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    color: "#F9FAFB",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    fontSize: 16,
  },

  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    height: 56,
  },

  passwordInput: {
    flex: 1,
    color: "#F9FAFB",
    fontSize: 16,
  },

  errorText: {
    color: "#F87171",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },

  remember: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  rememberText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#D1D5DB",
  },

  primaryBtn: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#2563EB",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },

  divider: {
    textAlign: "center",
    color: "#9CA3AF",
    marginVertical: 24,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },

  socialBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#9CA3AF",
  },
  link: {
    color: "#60A5FA",
    fontWeight: "600",
    marginLeft: 4,
  },
});

