import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, TextInput, KeyboardAvoidingView,
  Platform, SafeAreaView,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const glowRef = useRef(null);

  useEffect(() => {
    // Giriş animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 900, useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 900,
        useNativeDriver: true
      }),
    ]).start();

    // Dinamik ada glow döngüsü
    glowRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1, duration: 1000, useNativeDriver: false
        }),
        Animated.timing(glowAnim, {
          toValue: 0.2, duration: 1000, useNativeDriver: false
        }),
      ])
    );
    glowRef.current.start();

    return () => glowRef.current && glowRef.current.stop();
  }, [fadeAnim, slideAnim, glowAnim]);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FF2200", "#FF8800"]
  });

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 26]
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>

      <SafeAreaView style={styles.container}>

        {/* ── Dinamik Ada ── */}
        <Animated.View style={[
          styles.island,
          {
            shadowColor: glowColor,
            shadowOpacity: glowAnim,
            shadowRadius: glowRadius,
            borderColor: glowColor,
            elevation: 16,
          }
        ]}>
          <Text style={styles.islandText}>Consensus AI</Text>
        </Animated.View>

        {/* ── İçerik ── */}
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>

          {/* Başlık */}
          <View style={styles.headerBox}>
            <Text style={styles.title}>Hoş Geldiniz</Text>
            <Text style={styles.subtitle}>
              Devam etmek için giriş yapın
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>

            {/* E-posta */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>E-POSTA</Text>
              <View style={[
                styles.inputBox,
                focused === "email" && styles.inputBoxFocused
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="ornek@email.com"
                  placeholderTextColor="#B0A090"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                />
              </View>
            </View>

            {/* Şifre */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>ŞİFRE</Text>
              <View style={[
                styles.inputBox,
                focused === "password" && styles.inputBoxFocused
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#B0A090"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                />
              </View>
            </View>

            {/* Şifremi unuttum */}
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Şifremi unuttum</Text>
            </TouchableOpacity>

          </View>

          {/* Giriş Butonu */}
          <TouchableOpacity
            style={[
              styles.loginBtn,
              (!email.trim() || !password.trim()) && styles.loginBtnOff
            ]}
            onPress={() => navigation.navigate("Main")}
            disabled={!email.trim() || !password.trim()}
            activeOpacity={0.85}>
            <Text style={styles.loginBtnText}>GİRİŞ YAP →</Text>
          </TouchableOpacity>

          {/* Kayıt ol */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Hesabın yok mu? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>

          {/* Ayraç */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Apple ile Giriş */}
          <TouchableOpacity style={styles.appleBtn} activeOpacity={0.85}>
            <Text style={styles.appleBtnText}> Apple ile Devam Et</Text>
          </TouchableOpacity>

          {/* Google ile Giriş */}
          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
            <Text style={styles.googleBtnText}>G  Google ile Devam Et</Text>
          </TouchableOpacity>

        </Animated.View>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBDD",
    alignItems: "center",
  },

  // ── Dinamik Ada ──
  island: {
    width: 160,
    height: 40,
    backgroundColor: "#0A0A0A",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
  },
  islandText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 1,
  },

  // ── İçerik ──
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 28,
    paddingTop: 44,
  },

  // ── Başlık ──
  headerBox: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#2C1E14",
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#8A7A6A",
    letterSpacing: 0.3,
  },

  // ── Form ──
  form: {
    marginBottom: 28,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#B0A090",
    letterSpacing: 2.5,
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: "#EDE4D8",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#DDD0C0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  inputBoxFocused: {
    borderColor: "#FF2200",
    shadowColor: "#FF2200",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  input: {
    color: "#2C1E14",
    fontSize: 16,
    padding: 16,
    letterSpacing: 0.3,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: 4,
  },
  forgotText: {
    fontSize: 13,
    color: "#8A7A6A",
    fontWeight: "600",
  },

  // ── Giriş Butonu ──
  loginBtn: {
    backgroundColor: "#2C1E14",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#2C1E14",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnOff: {
    opacity: 0.3,
    shadowOpacity: 0,
  },
  loginBtnText: {
    color: "#F5EBDD",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2.5,
  },

  // ── Kayıt ──
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 28,
  },
  registerText: {
    fontSize: 14,
    color: "#8A7A6A",
  },
  registerLink: {
    fontSize: 14,
    color: "#FF2200",
    fontWeight: "700",
  },

  // ── Ayraç ──
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDD0C0",
  },
  dividerText: {
    fontSize: 13,
    color: "#B0A090",
    fontWeight: "600",
  },

  // ── Apple Butonu ──
  appleBtn: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  appleBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // ── Google Butonu ──
  googleBtn: {
    backgroundColor: "#EDE4D8",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#DDD0C0",
  },
  googleBtnText: {
    color: "#2C1E14",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});