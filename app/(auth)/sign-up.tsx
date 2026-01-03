import * as React from "react";
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
import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { makeRedirectUri } from "expo-auth-session";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const googleOAuth = useOAuth({ strategy: "oauth_google" });
  const microsoftOAuth = useOAuth({ strategy: "oauth_microsoft" });

  const redirectUrl = makeRedirectUri({
    scheme: "myapp",
    path: "/oauth-native-callback",
  });

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [agree, setAgree] = React.useState(true);
  const [signUpError, setSignUpError] = React.useState<string | null>(null);
  const [verifyError, setVerifyError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const onOAuthPress = async (oauth: any) => {
    try {
      const { createdSessionId, setActive } =
        await oauth.startOAuthFlow({ redirectUrl });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch {}
  };

  const onSignUpPress = async () => {
    if (!isLoaded || !agree || submitting) return;
    setSignUpError(null);
    setSubmitting(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: name,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (e: any) {
      const msg = e?.errors?.[0]?.message || e?.message || "Sign up failed";
      setSignUpError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !signUp || verifying || !code) return;
    setVerifyError(null);
    setVerifying(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      }
    } catch (e: any) {
      const msg = e?.errors?.[0]?.message || e?.message || "Verification failed";
      setVerifyError(msg);
    } finally {
      setVerifying(false);
    }
  };

  /*VERIFY EMAIL*/
  if (pendingVerification) {
    return (
      <View style={styles.screen}>
        <Animated.View style={[styles.glassCard, { opacity: fadeAnim }]}>
          <BlurView intensity={35} tint="dark" style={styles.blurInner}>
            <Text style={styles.title}>Verify your email</Text>

            <TextInput
              style={styles.glassInput}
              placeholder="Verification code"
              placeholderTextColor="#94A3B8"
              onChangeText={setCode}
            />

            {verifyError && (
              <Text style={styles.errorText}>{verifyError}</Text>
            )}

            <TouchableOpacity style={styles.primaryBtn} onPress={onVerifyPress}>
              <Text style={styles.primaryText}>Verify</Text>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </View>
    );
  }

  /* SIGN UP */
  return (
    <View style={styles.screen}>
      <View style={styles.background}>
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <View style={styles.blob3} />
      </View>
      <Animated.View style={[styles.glassCard, { opacity: fadeAnim }]}>
        <BlurView intensity={35} tint="dark" style={styles.blurInner}>
          <Text style={styles.title}>Create Account</Text>

          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.glassInput}
            value={name}
            onChangeText={setName}
            placeholderTextColor="#94A3B8"
          />

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

          {/* Password rules */}
          <View style={styles.requirements}>
            {[
              ["At least 8 characters", hasMinLength],
              ["One uppercase letter", hasUpper],
              ["One number", hasNumber],
              ["One special character", hasSpecial],
            ].map(([label, ok], i) => (
              <View key={i} style={styles.requirementRow}>
                <Ionicons
                  name={ok ? "checkmark-circle" : "close-circle"}
                  size={16}
                  color={ok ? "#22D3EE" : "#64748B"}
                />
                <Text
                  style={[
                    styles.requirementText,
                    ok && styles.requirementMet,
                  ]}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {signUpError && (
            <Text style={styles.errorText}>{signUpError}</Text>
          )}

          {/* Terms */}
          <TouchableOpacity
            style={styles.remember}
            onPress={() => setAgree(!agree)}
          >
            <Ionicons
              name={agree ? "checkbox" : "square-outline"}
              size={18}
              color="#22D3EE"
            />
            <Text style={styles.rememberText}>
              I agree to the Terms of Service
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn} onPress={onSignUpPress}>
            <Text style={styles.primaryText}>Create account</Text>
          </TouchableOpacity>

          <Text style={styles.divider}>Or sign up with</Text>

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

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/(auth)/sign-in">
              <Text style={styles.link}>Sign in</Text>
            </Link>
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
}

/* Styling*/

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
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 12 },
    elevation: 20,
  },

  blurInner: {
    paddingHorizontal: 32,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
    marginTop:10
  },

  label: {
    fontSize: 14,
    color: "#D1D5DB",
    marginBottom: 8,
    fontWeight: "500",
  },

  glassInput: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    color: "#F9FAFB",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    fontSize: 16,
  },

  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  passwordInput: {
    flex: 1,
    color: "#F9FAFB",
    fontSize: 16,
  },

  requirements: {
    marginBottom: 16,
    gap: 6,
  },

  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  requirementText: {
    fontSize: 13,
    color: "#94A3B8",
  },

  requirementMet: {
    color: "#22D3EE",
  },

  errorText: {
    color: "#F87171",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },

  remember: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  rememberText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#CBD5E1",
  },

  primaryBtn: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 8,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },

  divider: {
    textAlign: "center",
    color: "#9CA3AF",
    marginVertical: 12,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },

  socialBtn: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom:10
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
