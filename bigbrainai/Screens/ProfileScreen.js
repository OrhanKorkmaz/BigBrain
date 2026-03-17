import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ScrollView,
} from 'react-native';

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Başlık */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
          <Text style={styles.headerSub}>Ruhunu tanımaya hazır mısın?</Text>
        </View>

        {/* Beni Yargıla Kartı */}
        <TouchableOpacity
          style={styles.judgeCard}
          onPress={() => navigation.navigate('JudgeMe')}
          activeOpacity={0.85}>
          <View style={styles.judgeCardInner}>
            <Text style={styles.judgeEye}>𓂀</Text>
            <View style={styles.judgeTextWrap}>
              <Text style={styles.judgeTitle}>Beni Yargıla</Text>
              <Text style={styles.judgeSub}>
                Numeroloji · Astroloji · Psikoloji · İlişki Analizi
              </Text>
            </View>
            <Text style={styles.judgeArrow}>→</Text>
          </View>
          <View style={styles.judgeTags}>
            <View style={styles.tag}><Text style={styles.tagText}>12 Soru</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>~3 Dakika</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>Paylaşılabilir</Text></View>
          </View>
        </TouchableOpacity>

        {/* Yakında */}
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonLabel}>YAKINDA</Text>
          <View style={styles.comingSoonRow}>
            <View style={styles.comingSoonItem}>
              <Text style={styles.comingSoonIcon}>🏆</Text>
              <Text style={styles.comingSoonText}>Rozetler</Text>
            </View>
            <View style={styles.comingSoonItem}>
              <Text style={styles.comingSoonIcon}>📊</Text>
              <Text style={styles.comingSoonText}>İstatistikler</Text>
            </View>
            <View style={styles.comingSoonItem}>
              <Text style={styles.comingSoonIcon}>⚙️</Text>
              <Text style={styles.comingSoonText}>Ayarlar</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5EBDD',
  },
  container: {
    padding: 24,
    paddingBottom: 60,
  },

  // Header
  header: {
    marginBottom: 28,
    marginTop: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C1E14',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 14,
    color: '#8A7A6A',
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Yargıla Kartı
  judgeCard: {
    backgroundColor: '#1A0F0A',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#3D2A1A',
  },
  judgeCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  judgeEye: {
    fontSize: 36,
  },
  judgeTextWrap: {
    flex: 1,
  },
  judgeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#C9A84C',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  judgeSub: {
    fontSize: 12,
    color: '#6B5D52',
    letterSpacing: 0.3,
  },
  judgeArrow: {
    fontSize: 22,
    color: '#C9A84C',
    fontWeight: '700',
  },
  judgeTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 11,
    color: '#C9A84C',
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Yakında
  comingSoon: {
    backgroundColor: '#EDE4D8',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DDD0C0',
  },
  comingSoonLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B0A090',
    letterSpacing: 2.5,
    marginBottom: 16,
  },
  comingSoonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  comingSoonItem: {
    alignItems: 'center',
    gap: 8,
  },
  comingSoonIcon: {
    fontSize: 28,
    opacity: 0.4,
  },
  comingSoonText: {
    fontSize: 12,
    color: '#B0A090',
    fontWeight: '600',
  },
});