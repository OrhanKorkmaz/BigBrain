import React, { useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, SafeAreaView, Easing,
} from "react-native";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const glowRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 1000, useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1, tension: 50, friction: 8, useNativeDriver: true
      }),
    ]).start();

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
  }, [fadeAnim, slideAnim, scaleAnim, glowAnim]);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FF2200", "#FF8800"]
  });

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 28]
  });

  return (
    <SafeAreaView style={styles.container}>

      {/* Dinamik Ada */}
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

      {/* Ana İçerik */}
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}>

        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🧠</Text>
          </View>
          <Text style={styles.appName}>BigBrainAI</Text>
          <Text style={styles.tagline}>
            Yapay zekalar cevaplar{"\n"}
            anlaşamazsa hakem devreye girer
          </Text>
        </View>

        {/* Kartlar */}
        <View style={styles.cards}>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>⚖️</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Consensus Sistemi</Text>
              <Text style={styles.cardDesc}>
                Yapay zekalar aynı fikirde mi? Ortak cevap verilir.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>🥊</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Hakem Kararı</Text>
              <Text style={styles.cardDesc}>
                Anlaşmazlıkta üçüncü yapay zeka hakemlik yapar.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>🗳️</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Topluluk Oylaması</Text>
              <Text style={styles.cardDesc}>
                Kullanıcılar doğru cevabı birlikte seçer.
              </Text>
            </View>
          </View>

        </View>

      </Animated.View>

      {/* Alt Butonlar */}
      <Animated.View style={[styles.bottomArea, { opacity: fadeAnim }]}>

        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.85}>
          <Text style={styles.startBtnText}>BAŞLA →</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Zaten hesabın var mı? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.freeNote}>İlk 3 soru ücretsiz</Text>

      </Animated.View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBDD",
    alignItems: "center",
  },
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
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 28,
    paddingTop: 40,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 44,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#EDE4D8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#DDD0C0",
  },
  logoEmoji: {
    fontSize: 44,
  },
  appName: {
    fontSize: 38,
    fontWeight: "800",
    color: "#2C1E14",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 15,
    color: "#8A7A6A",
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  cards: {
    gap: 12,
  },
  card: {
    backgroundColor: "#EDE4D8",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#DDD0C0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2C1E14",
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  cardDesc: {
    fontSize: 13,
    color: "#8A7A6A",
    lineHeight: 20,
  },
  bottomArea: {
    width: "100%",
    paddingHorizontal: 28,
    paddingBottom: 20,
    gap: 14,
  },
  startBtn: {
    backgroundColor: "#2C1E14",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#2C1E14",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  startBtnText: {
    color: "#F5EBDD",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2.5,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#8A7A6A",
  },
  loginLink: {
    fontSize: 14,
    color: "#FF2200",
    fontWeight: "700",
  },
  freeNote: {
    textAlign: "center",
    fontSize: 12,
    color: "#B0A090",
    letterSpacing: 0.5,
  },
});