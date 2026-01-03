import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

  const onOAuthPress = async (oauth: any) => {
    try {
      const { createdSessionId, setActive } =
        await oauth.startOAuthFlow({ redirectUrl });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (e) {
      console.error(e);
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
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      const first = err?.errors?.[0];
      const code = first?.code as string | undefined;
      const message = first?.message as string | undefined;
      if (
        code === "form_identifier_not_found" ||
        code === "form_password_incorrect" ||
        code === "identifier_not_found" ||
        code === "invalid_credentials"
      ) {
        setAuthError("Invalid email or password.");
      } else if (message) {
        setAuthError(message);
      } else {
        setAuthError("Could not sign in. Please try again.");
      }
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {/* Header */}
        <Text style={styles.title}>
          Welcome to{"\n"}SmartNest login now!
        </Text>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordBox}>
          <TextInput
            style={{ flex: 1 }}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

        {/* Remember / Forgot */}
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={styles.remember}
            onPress={() => setRemember(!remember)}
          >
            <Ionicons
              name={remember ? "checkbox" : "square-outline"}
              size={18}
              color="#3B82F6"
            />
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgot}>Forget password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login button */}
        <TouchableOpacity style={styles.primaryBtn} onPress={onSignInPress}>
          <Text style={styles.primaryText}>Login</Text>
        </TouchableOpacity>

        {/* Divider */}
        <Text style={styles.divider}>Or Sign in with</Text>

        {/* OAuth */}
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => onOAuthPress(googleOAuth)}
          >
            <Ionicons name="logo-google" size={22} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => onOAuthPress(microsoftOAuth)}
          >
            <Ionicons name="logo-windows" size={22} />
          </TouchableOpacity>
        </View>

        {oauthError ? <Text style={styles.errorText}>{oauthError}</Text> : null}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Don’t have an account?</Text>
          <Link href="/(auth)/sign-up">
            <Text style={styles.link}> Sign up</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EEF2F7",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  remember: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#6B7280",
  },
  forgot: {
    fontSize: 13,
    color: "#3B82F6",
  },
  primaryBtn: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    textAlign: "center",
    color: "#9CA3AF",
    marginVertical: 18,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
  },
  socialBtn: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  link: {
    color: "#3B82F6",
    fontWeight: "600",
  },
});
