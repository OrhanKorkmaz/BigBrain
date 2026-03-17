import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Animated, Easing,
} from "react-native";

const VERDICT_DATA = {
  consensus: {
    type: "consensus",
    title: "Konsensüs Sağlandı",
    emoji: "⚖️",
    desc: "Yapay zekalar bu konuda hemfikir. Aşağıdaki ortak karar güvenilir kabul edilebilir.",
    answer: "Yapılan analizler sonucunda yapay zekaların büyük çoğunluğu aynı sonuca ulaştı. Bu konu hakkında en doğru yaklaşım şudur: Temel prensipleri kavrayarak ilerlemek, pratik deneyimle desteklemek ve güvenilir kaynaklardan bilgi edinmek en sağlıklı yoldur. Bu görüş bilimsel verilerle de örtüşmektedir.",
    score: 92,
    color: "#2E7D32",
    bgColor: "#EAF7EE",
    borderColor: "#C8E6C9",
  },
  disagreement: {
    type: "disagreement",
    title: "Anlaşmazlık Tespit Edildi",
    emoji: "🥊",
    desc: "Yapay zekalar bu konuda farklı görüşlere sahip. Hakem kararı için devam edin.",
    answer: "Bu konu tartışmalı bir alan olup yapay zekalar farklı sonuçlara ulaştı. Bir taraf teorik yaklaşımı savunurken diğer taraf pratik deneyimi ön plana çıkardı. Kesin bir karar için hakem değerlendirmesi önerilir.",
    score: 44,
    color: "#E53935",
    bgColor: "#FDECEA",
    borderColor: "#FFCDD2",
  },
};

function ScoreRing({ score, color }) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: score,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [animValue, score]);

  const displayScore = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
  });

  return (
    <View style={ringStyles.wrapper}>
      <View style={[ringStyles.ring, { borderColor: color + "33" }]}>
        <View style={[ringStyles.innerRing, { borderColor: color }]}>
          <Animated.Text style={[ringStyles.scoreText, { color }]}>
            {score}%
          </Animated.Text>
          <Text style={[ringStyles.scoreLabel, { color }]}>skor</Text>
        </View>
      </View>
    </View>
  );
}

export default function VerdictScreen({ navigation, route }) {
  const question = route?.params?.question || "Örnek soru";
  const [verdictType] = useState("consensus"); // "consensus" veya "disagreement"
  const verdict = VERDICT_DATA[verdictType];

  const glowAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const glowRef = useRef(null);

  useEffect(() => {
    // Giriş animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 700, useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1, tension: 50, friction: 8, useNativeDriver: true
      }),
      Animated.timing(cardAnim, {
        toValue: 1, duration: 900,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Dinamik ada glow
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
  }, [fadeAnim, scaleAnim, cardAnim, glowAnim]);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FF2200", "#FF8800"]
  });

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 28]
  });

  const cardSlide = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Geri */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Geri</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Soru */}
        <Animated.View style={[styles.questionBox, { opacity: fadeAnim }]}>
          <Text style={styles.questionLabel}>SORUNUZ</Text>
          <Text style={styles.questionText}>"{question}"</Text>
        </Animated.View>

        {/* Karar Kartı */}
        <Animated.View style={[
          styles.verdictCard,
          {
            backgroundColor: verdict.bgColor,
            borderColor: verdict.borderColor,
            opacity: cardAnim,
            transform: [
              { translateY: cardSlide },
              { scale: scaleAnim },
            ],
          }
        ]}>
          {/* Üst */}
          <View style={styles.verdictTop}>
            <Text style={styles.verdictEmoji}>{verdict.emoji}</Text>
            <View style={styles.verdictTitleBox}>
              <Text style={[styles.verdictTitle, { color: verdict.color }]}>
                {verdict.title}
              </Text>
              <Text style={styles.verdictDesc}>{verdict.desc}</Text>
            </View>
          </View>

          {/* Ayraç */}
          <View style={[styles.divider, { backgroundColor: verdict.borderColor }]} />

          {/* Skor + Cevap */}
          <View style={styles.verdictBody}>
            <ScoreRing score={verdict.score} color={verdict.color} />
            <Text style={styles.verdictAnswer}>{verdict.answer}</Text>
          </View>

        </Animated.View>

        {/* Güven Göstergeleri */}
        <Animated.View style={[styles.metricsBox, { opacity: cardAnim }]}>
          <Text style={styles.metricsTitle}>ANALİZ METRİKLERİ</Text>
          <View style={styles.metricsRow}>

            <View style={styles.metric}>
              <Text style={styles.metricValue}>3</Text>
              <Text style={styles.metricLabel}>Yapay Zeka</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metric}>
              <Text style={[styles.metricValue, { color: verdict.color }]}>
                {verdict.score}%
              </Text>
              <Text style={styles.metricLabel}>Uyum</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metric}>
              <Text style={styles.metricValue}>2.4s</Text>
              <Text style={styles.metricLabel}>Süre</Text>
            </View>

          </View>
        </Animated.View>

        {/* Alt Butonlar */}
        <Animated.View style={[styles.bottomBtns, { opacity: cardAnim }]}>

          {/* Anlaşmazlık varsa Hakem butonu */}
          {verdictType === "disagreement" && (
            <TouchableOpacity
              style={styles.juryBtn}
              onPress={() => navigation.navigate("Jury", { question })}
              activeOpacity={0.85}>
              <Text style={styles.juryBtnText}>🥊  Hakem Kararı İste</Text>
            </TouchableOpacity>
          )}

          {/* Paylaş */}
          <TouchableOpacity
            style={styles.shareBtn}
            activeOpacity={0.85}>
            <Text style={styles.shareBtnText}>↗  Sonucu Paylaş</Text>
          </TouchableOpacity>

          {/* Yeni Soru */}
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => navigation.navigate("Main")}
            activeOpacity={0.85}>
            <Text style={styles.newBtnText}>Yeni Soru Sor →</Text>
          </TouchableOpacity>

        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const ringStyles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  ring: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  innerRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 26,
    fontWeight: "800",
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    opacity: 0.7,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBDD",
    alignItems: "center",
  },

  // Dinamik Ada
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

  // Scroll
  scroll: { flex: 1, width: "100%" },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // Geri
  backBtn: { marginBottom: 16 },
  backText: {
    fontSize: 15,
    color: "#FF2200",
    fontWeight: "700",
  },

  // Soru
  questionBox: {
    backgroundColor: "#EDE4D8",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DDD0C0",
  },
  questionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#B0A090",
    letterSpacing: 2.5,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    color: "#2C1E14",
    fontStyle: "italic",
    lineHeight: 24,
    fontWeight: "500",
  },

  // Karar Kartı
  verdictCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  verdictTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 20,
  },
  verdictEmoji: {
    fontSize: 36,
  },
  verdictTitleBox: { flex: 1 },
  verdictTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  verdictDesc: {
    fontSize: 14,
    color: "#6A5A4A",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  verdictBody: {
    alignItems: "center",
  },
  verdictAnswer: {
    fontSize: 15,
    color: "#3A2E28",
    lineHeight: 26,
    textAlign: "center",
  },

  // Metrikler
  metricsBox: {
    backgroundColor: "#EDE4D8",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DDD0C0",
  },
  metricsTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#B0A090",
    letterSpacing: 2.5,
    marginBottom: 16,
    textAlign: "center",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  metric: {
    alignItems: "center",
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C1E14",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: "#8A7A6A",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#DDD0C0",
  },

  // Alt Butonlar
  bottomBtns: { gap: 12 },
  juryBtn: {
    backgroundColor: "#E53935",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#E53935",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  juryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },
  shareBtn: {
    backgroundColor: "#2C1E14",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#2C1E14",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  shareBtnText: {
    color: "#F5EBDD",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },
  newBtn: {
    backgroundColor: "#EDE4D8",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD0C0",
  },
  newBtnText: {
    color: "#2C1E14",
    fontSize: 15,
    fontWeight: "700",
  },
});