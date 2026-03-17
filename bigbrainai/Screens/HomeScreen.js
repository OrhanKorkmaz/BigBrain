import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, SafeAreaView, TextInput,
  KeyboardAvoidingView, Platform,
} from "react-native";

export default function HomeScreen({ navigation }) {
  const [question, setQuestion] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const glowAnim = useRef(new Animated.Value(0)).current;
  const widthAnim = useRef(new Animated.Value(160)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const glowRef = useRef(null);
  const widthRef = useRef(null);

  // Giriş animasyonu
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 900, useNativeDriver: true
    }).start();
  }, [fadeAnim]);

  // Dinamik ada animasyonu
  useEffect(() => {
    if (isThinking) {
      widthRef.current = Animated.spring(widthAnim, {
        toValue: 240, useNativeDriver: false, tension: 50, friction: 8
      });
      widthRef.current.start();

      glowRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1, duration: 700, useNativeDriver: false
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3, duration: 700, useNativeDriver: false
          }),
        ])
      );
      glowRef.current.start();

    } else {
      glowRef.current && glowRef.current.stop();
      widthRef.current && widthRef.current.stop();

      Animated.parallel([
        Animated.spring(widthAnim, {
          toValue: 160, useNativeDriver: false, tension: 50, friction: 8
        }),
        Animated.timing(glowAnim, {
          toValue: 0, duration: 500, useNativeDriver: false
        }),
      ]).start();
    }

    return () => {
      glowRef.current && glowRef.current.stop();
      widthRef.current && widthRef.current.stop();
    };
  }, [isThinking, glowAnim, widthAnim]);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FF2200", "#FF8800"]
  });

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 28]
  });

  const handleAsk = () => {
    if (!question.trim() || isThinking) return;
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      navigation.navigate("Results", { question });
    }, 2500);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>

      <SafeAreaView style={styles.container}>

        {/* Dinamik Ada */}
        <Animated.View style={[
          styles.island,
          {
            width: widthAnim,
            shadowColor: isThinking ? glowColor : "#FF2200",
            shadowOpacity: isThinking ? glowAnim : 0.5,
            shadowRadius: isThinking ? glowRadius : 12,
            elevation: isThinking ? 20 : 8,
            borderColor: isThinking ? glowColor : "#1A1A1A",
          }
        ]}>
          {isThinking ? (
            <View style={styles.islandActive}>
              <Animated.View style={[
                styles.fireDot,
                {
                  backgroundColor: glowColor,
                  shadowColor: glowColor,
                  shadowOpacity: glowAnim,
                  shadowRadius: 8,
                }
              ]} />
              <View style={styles.track}>
                <Animated.View style={[
                  styles.spark,
                  {
                    backgroundColor: glowColor,
                    shadowColor: glowColor,
                    shadowOpacity: 1,
                    shadowRadius: 6,
                  }
                ]} />
              </View>
              <Animated.View style={[
                styles.fireDot,
                {
                  backgroundColor: "#FFAA00",
                  shadowColor: "#FFAA00",
                  shadowOpacity: glowAnim,
                  shadowRadius: 8,
                }
              ]} />
            </View>
          ) : (
            <Text style={styles.islandText}>Consensus AI</Text>
          )}
        </Animated.View>

        {/* İçerik */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

          {/* Konuşma Baloncuğu */}
          <View style={styles.bubbleWrapper}>
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>
                {isThinking
                  ? "Yapay zekalar analiz ediyor..."
                  : "Merhaba! Sana nasıl yardımcı olabilirim?"}
              </Text>
            </View>
            <View style={styles.bubbleTail} />
          </View>

          {/* Soru Kutusu */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>SORUNUZ</Text>
            <View style={[
              styles.inputBox,
              isThinking && styles.inputBoxActive
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Merak ettiğiniz her şeyi sorun..."
                placeholderTextColor="#999"
                value={question}
                onChangeText={setQuestion}
                multiline
                editable={!isThinking}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Buton */}
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={[
                styles.askButton,
                (!question.trim() || isThinking) && styles.askButtonOff
              ]}
              onPress={handleAsk}
              disabled={!question.trim() || isThinking}
              activeOpacity={0.85}>
              <Text style={styles.askText}>
                {isThinking ? "ANALİZ EDİLİYOR..." : "SORU SOR →"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

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

  // Dinamik Ada
  island: {
    height: 40,
    backgroundColor: "#0A0A0A",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    overflow: "hidden",
  },
  islandText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 1,
  },
  islandActive: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    width: "100%",
  },
  fireDot: {
    width: 10, height: 10,
    borderRadius: 5,
    elevation: 6,
  },
  track: {
    flex: 1,
    height: 2,
    backgroundColor: "#1A0A00",
    borderRadius: 1,
    marginHorizontal: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  spark: {
    width: 50, height: 2,
    borderRadius: 1,
  },

  // İçerik
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
  },

  // Baloncuk
  bubbleWrapper: {
    alignItems: "flex-start",
    marginBottom: 32,
  },
  bubble: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  bubbleText: {
    fontSize: 15,
    color: "#3A2E28",
    lineHeight: 22,
  },
  bubbleTail: {
    width: 0, height: 0,
    borderTopWidth: 8,
    borderTopColor: "#FFFFFF",
    borderRightWidth: 10,
    borderRightColor: "transparent",
    marginLeft: 12,
  },

  // Soru Kutusu
  inputSection: {
    flex: 1,
    marginBottom: 20,
  },
  inputLabel: {
    color: "#B0A090",
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "800",
    marginBottom: 10,
  },
  inputBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5D8CC",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  inputBoxActive: {
    borderColor: "#FF2200",
    shadowColor: "#FF2200",
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  input: {
    flex: 1,
    color: "#2A1E18",
    fontSize: 16,
    lineHeight: 26,
    padding: 18,
    textAlignVertical: "top",
  },

  // Buton
  askButton: {
    backgroundColor: "#2C1E14",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#2C1E14",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  askButtonOff: {
    opacity: 0.25,
    shadowOpacity: 0,
  },
  askText: {
    color: "#F5EBDD",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2.5,
  },
});