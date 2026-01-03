import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

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
    } catch (e) {
      console.error("OAuth error", e);
    }
  };

  const onSignUpPress = async () => {
    if (!isLoaded || !agree) return;

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
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !signUp) return;
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- VERIFY EMAIL ---------------- */
  if (pendingVerification) {
    return (
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Verify your email</Text>
          <TextInput
            style={styles.input}
            placeholder="Verification code"
            onChangeText={setCode}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={onVerifyPress}>
            <Text style={styles.primaryText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* ---------------- SIGN UP ---------------- */
  return (
    <View style={styles.screen}>
      <Text style={styles.appName}>SmartNest</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Create an Account?</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordBox}>
          <TextInput
            style={{ flex: 1 }}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.requirements}>
          <Text style={styles.requirementTitle}>Your Password must have:</Text>
          <View style={styles.requirementRow}>
            <Ionicons name={hasMinLength ? "checkmark-circle" : "close-circle"} size={16} color={hasMinLength ? "#10B981" : "#9CA3AF"} />
            <Text style={[styles.requirementText, hasMinLength && styles.requirementMet]}>At least 8 characters</Text>
          </View>
          <View style={styles.requirementRow}>
            <Ionicons name={hasUpper ? "checkmark-circle" : "close-circle"} size={16} color={hasUpper ? "#10B981" : "#9CA3AF"} />
            <Text style={[styles.requirementText, hasUpper && styles.requirementMet]}>At least one uppercase letter</Text>
          </View>
          <View style={styles.requirementRow}>
            <Ionicons name={hasNumber ? "checkmark-circle" : "close-circle"} size={16} color={hasNumber ? "#10B981" : "#9CA3AF"} />
            <Text style={[styles.requirementText, hasNumber && styles.requirementMet]}>At least one number</Text>
          </View>
          <View style={styles.requirementRow}>
            <Ionicons name={hasSpecial ? "checkmark-circle" : "close-circle"} size={16} color={hasSpecial ? "#10B981" : "#9CA3AF"} />
            <Text style={[styles.requirementText, hasSpecial && styles.requirementMet]}>At least one special character</Text>
          </View>
        </View>

        <View style={styles.terms}>
          <TouchableOpacity onPress={() => setAgree(!agree)} activeOpacity={1}>
            <Ionicons
              name={agree ? "checkbox" : "square-outline"}
              size={18}
              color="#2563EB"
            />
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.link}>Terms of Service</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={onSignUpPress}>
          <Text style={styles.primaryText}>Create account</Text>
        </TouchableOpacity>

        <Text style={styles.divider}>Or Sign in with</Text>

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

        <View style={styles.footer}>
          <Text>Already have an account?</Text>
          <Link href="/(auth)/sign-in">
            <Text style={styles.link}> Sign in</Text>
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
    padding: 24,
    justifyContent: "center",
  },
  appName: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    color: "#3B82F6",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  requirements: {
    marginBottom: 12,
    gap: 6,
  },
  requirementTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requirementText: {
    fontSize: 12,
    color: "#6B7280",
  },
  requirementMet: {
    color: "#10B981",
  },
  terms: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  termsText: {
    marginLeft: 8,
    fontSize: 13,
  },
  primaryBtn: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  divider: {
    textAlign: "center",
    color: "#9CA3AF",
    marginVertical: 16,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
  },
  socialBtn: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  link: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
