import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Animated, Easing, TextInput,
} from 'react-native';

const LP_DATA = {
  1:{name:'Lider',desc:'Bağımsız, güçlü iradeli, öncü ruh.'},
  2:{name:'Arabulucu',desc:'Duyarlı, uyumlu, ilişkiye açık.'},
  3:{name:'Yaratıcı',desc:'Neşeli, ifade özgürlüğüne tutkun.'},
  4:{name:'İnşaatçı',desc:'Disiplinli, güvenilir, pratik zekalı.'},
  5:{name:'Özgür Ruh',desc:'Maceraperest, değişim seven.'},
  6:{name:'Bakıcı',desc:'Sevgi dolu, sorumluluğunu taşıyan.'},
  7:{name:'Gizemci',desc:'Derin düşünceli, içe dönük, analitik.'},
  8:{name:'Güç',desc:'Hırslı, başarıya odaklı, kontrolcü.'},
  9:{name:'İnsanlık Sever',desc:'İdealist, fedakâr, bazen naif.'},
  11:{name:'Aydınlanmış',desc:'Sezgisel deha — ya çok yükselir ya çöker.'},
  22:{name:'Usta İnşaatçı',desc:'Büyük vizyonlar, ağır sorumluluklar.'},
  33:{name:'Usta Öğretmen',desc:'Şefkat ve bilgelik dorukta.'},
};

const ZODIAC_DATA = {
  'Koç':{match:'Aslan veya Yay',trait:'ateşli ve kararlı',where:'spor salonunda ya da yarışma ortamında'},
  'Boğa':{match:'Başak veya Oğlak',trait:'sadık ve güvenilir',where:'kültür-sanat etkinliklerinde'},
  'İkizler':{match:'Terazi veya Kova',trait:'zeki ve çok yönlü',where:'kitap fuarında ya da sosyal etkinliklerde'},
  'Yengeç':{match:'Akrep veya Balık',trait:'duygusal ve koruyucu',where:'yakın arkadaş ortamında'},
  'Aslan':{match:'Koç veya Yay',trait:'karizmatik ve lider ruhlu',where:'sahneli etkinliklerde'},
  'Başak':{match:'Boğa veya Oğlak',trait:'analitik ve güvenilir',where:'iş veya entelektüel ortamlarda'},
  'Terazi':{match:'İkizler veya Kova',trait:'dengeli ve estetik',where:'sanat galerilerinde'},
  'Akrep':{match:'Yengeç veya Balık',trait:'tutkulu ve derin',where:'gece dışarı çıkmalarda'},
  'Yay':{match:'Koç veya Aslan',trait:'özgür ve iyimser',where:'seyahat ederken'},
  'Oğlak':{match:'Boğa veya Başak',trait:'hırslı ve istikrarlı',where:'iş çevresinde'},
  'Kova':{match:'İkizler veya Terazi',trait:'yenilikçi ve bağımsız',where:'teknoloji etkinliklerinde'},
  'Balık':{match:'Yengeç veya Akrep',trait:'sezgisel ve romantik',where:'sanat veya ruhsal ortamlarda'},
};

function calcLP(dateStr) {
  const digits = dateStr.replace(/\D/g, '').split('').map(Number);
  if (digits.length < 6) return 5;
  let s = digits.reduce((a, b) => a + b, 0);
  while (s > 9 && s !== 11 && s !== 22 && s !== 33) {
    s = String(s).split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return s;
}

function getZodiac(dateStr) {
  const parts = dateStr.split('.');
  if (parts.length < 2) return 'Terazi';
  const day = parseInt(parts[0]), m = parseInt(parts[1]);
  if((m===3&&day>=21)||(m===4&&day<=19))return'Koç';
  if((m===4&&day>=20)||(m===5&&day<=20))return'Boğa';
  if((m===5&&day>=21)||(m===6&&day<=20))return'İkizler';
  if((m===6&&day>=21)||(m===7&&day<=22))return'Yengeç';
  if((m===7&&day>=23)||(m===8&&day<=22))return'Aslan';
  if((m===8&&day>=23)||(m===9&&day<=22))return'Başak';
  if((m===9&&day>=23)||(m===10&&day<=22))return'Terazi';
  if((m===10&&day>=23)||(m===11&&day<=21))return'Akrep';
  if((m===11&&day>=22)||(m===12&&day<=21))return'Yay';
  if((m===12&&day>=22)||(m===1&&day<=19))return'Oğlak';
  if((m===1&&day>=20)||(m===2&&day<=18))return'Kova';
  return 'Balık';
}

const QUESTIONS = [
  {
    id:'birth', type:'date',
    tag:'KADER KAPISI',
    q:'Doğduğun günü söyle.',
    hint:'GG.AA.YYYY formatında yaz  (örn: 15.06.1995)',
  },
  { id:'rev', type:'reveal', tag:'SAYINI AÇIKLIYORUM', q:'', hint:'' },
  {
    id:'energy', type:'opts', tag:'SORU 1',
    q:'Sabah uyandığında içindeki ilk his nedir?',
    hint:'Bilinçaltın konuşuyor.',
    opts:[
      {t:'Heyecan — ne yapacağım diye sabırsızlanıyorum.',s:8},
      {t:'Yorgunluk — biraz daha uyusam.',s:4},
      {t:'Kaygı — bugün ne olacak?',s:3},
      {t:'Huzur — bugün de geçecek.',s:6},
    ],
  },
  {
    id:'social', type:'opts', tag:'SORU 2',
    q:'Bir arkadaşın sana ihtiyacı olduğunu söylüyor. Ne yaparsın?',
    hint:'İlk içgüdün...',
    opts:[
      {t:'Her şeyi bırakır, yanına koşarım.',s:9},
      {t:'Müsaitsem yardım ederim.',s:6},
      {t:'"Ne zaman?" derim, takvimime bakarım.',s:4},
      {t:'Sonra ararım — önce kendim.',s:2},
    ],
  },
  {
    id:'conflict', type:'opts', tag:'SORU 3',
    q:'Haklı olduğunu biliyorsun ama karşındaki ısrar ediyor. Ne yaparsın?',
    hint:'Ego mu, huzur mu?',
    opts:[
      {t:'Sonuna kadar savaşırım, geri adım atmam.',s:2},
      {t:'Kanıtlarımı sabırla sunarım.',s:9},
      {t:'Bırakırım, tartışmaya değmez.',s:5},
      {t:'Sinirlenip susmayı tercih ederim.',s:3},
    ],
  },
  {
    id:'love', type:'opts', tag:'SORU 4',
    q:'Bir ilişkide seni en çok yoran şey nedir?',
    hint:'Kalbinin sınavı...',
    opts:[
      {t:'Karşılıksız vermek.',s:5},
      {t:'Sürekli kendimi açıklamak.',s:7},
      {t:'Kısıtlanmak, nefes alamamak.',s:6},
      {t:'Yeterince önemsenmemek.',s:8},
    ],
  },
  {
    id:'attach', type:'opts', tag:'SORU 5',
    q:'İlişkide nasıl bir bağlanma şekline sahipsin?',
    hint:'Dürüst ol kendine...',
    opts:[
      {t:'Güvenli — veririm, alırım, dengeli.',s:9},
      {t:'Kaygılı — kaybedeceğimden korkuyorum.',s:4},
      {t:'Kaçınan — çok yaklaşılırsa rahatsız olurum.',s:3},
      {t:'Bilmiyorum — duruma göre değişiyor.',s:6},
    ],
  },
  {
    id:'alone', type:'range', tag:'SORU 6',
    q:'Yalnızlığa ne kadar toleransın var?',
    hint:'1 = Tek başıma duramam  ·  10 = Adaya çekilebilirim',
    min:1, max:10, minL:'Sosyal bağımlı', maxL:'Münzevi ruh',
  },
  {
    id:'betrayal', type:'opts', tag:'SORU 7',
    q:'Güvendiğin biri seni ihanet etti. İlk tepkin ne olur?',
    hint:'Gerçek tepkin...',
    opts:[
      {t:'Bir daha görmem, silerim.',s:4},
      {t:'Neden yaptığını anlamaya çalışırım.',s:8},
      {t:'İntikam düşünürüm, zamanını beklerim.',s:1},
      {t:'Acıyı içime gömer, kimseye söylemem.',s:3},
    ],
  },
  {
    id:'future', type:'opts', tag:'SORU 8',
    q:'5 yıl sonra nerede olmak istiyorsun?',
    hint:'Gerçek isteğin...',
    opts:[
      {t:'Net bir planım var, adım adım ilerliyorum.',s:9},
      {t:'Umutlarım var ama plan belirsiz.',s:6},
      {t:'Düşünmek bile bunaltıcı geliyor.',s:3},
      {t:'Şu an mutluysam yeterli.',s:5},
    ],
  },
  {
    id:'partner', type:'opts', tag:'SORU 9',
    q:'Bir partnerden en çok beklediğin şey nedir?',
    hint:'Gerçek önceliğin...',
    opts:[
      {t:'Güven ve sadakat — her şey bunun üstüne.',s:8},
      {t:'Tutku ve heyecan — rutin öldürür.',s:6},
      {t:'Özgürlük — bana alan tanıyan biri.',s:5},
      {t:'Gelişim — beraber büyüyelim.',s:9},
    ],
  },
];

// ─── Skor Halkası ────────────────────────────────────
function ScoreRing({ score }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: score, duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [score]);

  const color = score >= 70 ? '#C9A84C' : score >= 45 ? '#D4935A' : '#8B1A1A';

  return (
    <View style={ringS.wrap}>
      <View style={[ringS.ring, { borderColor: color + '33' }]}>
        <View style={[ringS.inner, { borderColor: color }]}>
          <Text style={[ringS.num, { color }]}>{score}</Text>
          <Text style={[ringS.sub, { color }]}>/ 100</Text>
        </View>
      </View>
    </View>
  );
}

const ringS = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 20 },
  ring: { width: 120, height: 120, borderRadius: 60, borderWidth: 10, alignItems: 'center', justifyContent: 'center' },
  inner: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 30, fontWeight: '900' },
  sub: { fontSize: 12, fontWeight: '600', opacity: 0.7 },
});

// ─── Ana Ekran ────────────────────────────────────────
export default function JudgeMeScreen({ navigation }) {
  const [phase, setPhase] = useState('landing'); // landing | quiz | result
  const [curQ, setCurQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [dateInput, setDateInput] = useState('');
  const [rangeVal, setRangeVal] = useState(5);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [lp, setLp] = useState(null);
  const [zodiac, setZodiac] = useState(null);
  const [totalSc, setTotalSc] = useState(0);
  const [maxSc, setMaxSc] = useState(0);
  const [result, setResult] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const animateIn = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => { animateIn(); }, [phase, curQ]);

  const q = QUESTIONS[curQ];
  const progress = Math.round((curQ / QUESTIONS.length) * 100);

  const canNext = () => {
    if (q.type === 'date') return dateInput.length >= 8;
    if (q.type === 'reveal') return true;
    if (q.type === 'opts') return selectedOpt !== null;
    if (q.type === 'range') return true;
    return false;
  };

  const handleNext = () => {
    let newTotal = totalSc;
    let newMax = maxSc;
    let newAnswers = { ...answers };

    if (q.type === 'date') {
      const computedLp = calcLP(dateInput);
      const computedZ = getZodiac(dateInput);
      setLp(computedLp);
      setZodiac(computedZ);
      newAnswers.birth = dateInput;
    } else if (q.type === 'opts' && selectedOpt !== null) {
      newTotal += selectedOpt;
      newMax += 9;
    } else if (q.type === 'range') {
      const ps = rangeVal <= 3 ? 3 : rangeVal >= 8 ? 5 : 8;
      newTotal += ps;
      newMax += 9;
    }

    setTotalSc(newTotal);
    setMaxSc(newMax);
    setAnswers(newAnswers);
    setSelectedOpt(null);

    const nextQ = curQ + 1;
    if (nextQ >= QUESTIONS.length) {
      buildResult(newTotal, newMax, newAnswers);
    } else {
      setCurQ(nextQ);
    }
  };

  const buildResult = (total, max, ans) => {
    const lpBonus = {1:2,2:5,3:4,4:6,5:3,6:7,7:4,8:3,9:8,11:6,22:7,33:9};
    const finalTotal = total + (lpBonus[lp] || 4);
    const finalMax = max + 9;
    const pct = Math.min(100, Math.round((finalTotal / finalMax) * 100));

    let verdict, summary, traits;
    if (pct >= 80) {
      verdict = 'Evren Seni Affetti';
      summary = 'Ruhun nadir bir parlaklık taşıyor. Verme kapasiten güçlü ama bedelini ödüyorsun. Sınır çizmek güçsüzlük değil, bilgeliktir.';
      traits = ['Derin Empati', 'Vicdanlı', 'Fedakâr', 'Bağlı'];
    } else if (pct >= 60) {
      verdict = 'Karar Askıda';
      summary = 'İçinde çelişen iki doğa var: biri bağlanmak istiyor, diğeri kaçmak. Bu gerilimi kabul edersen gerçek potansiyelini bulursun.';
      traits = ['Çelişkili', 'Potansiyel Yüklü', 'Seçici', 'Savunmacı'];
    } else if (pct >= 40) {
      verdict = 'Şüphe Altında';
      summary = 'Kendini korumak için bazı kapıları kapattın. Güvende tutuyorsun ama aynı zamanda hapsetmiş olabilirsin.';
      traits = ['Ketum', 'Pragmatik', 'Mesafeli', 'Hesaplı'];
    } else {
      verdict = 'Suçlu Bulundu';
      summary = 'Sertliğin bir zırh olduğunu biliyorsun. Yargı ağır ama hayatın sana yaptıklarıyla ilgili. Hâlâ zaman var.';
      traits = ['Zırhlı Ruh', 'Kontrolcü', 'Korunaklı', 'Dürüst'];
    }

    const z = zodiac || 'Terazi';
    const zc = ZODIAC_DATA[z] || { match: 'Terazi veya İkizler', trait: 'dengeli', where: 'sanat etkinliklerinde' };
    const attachSc = ans.attach || 6;
    const matchPct = Math.min(97, Math.max(58, Math.round(55 + (pct * 0.25) + (attachSc * 1.8))));

    const numTexts = {
      1:'Yaşam yolu 1 — Liderlik çağrısı. Güçlü bağımsız enerjin var ama bu özgürlük bazen yalnızlıkla bedel ödetiyor.',
      2:'Yaşam yolu 2 — İlişkilerin çocuğusun. Empatin hem gücün hem açığın. Kendini ihmal etme.',
      3:'Yaşam yolu 3 — İfade etmek yaşam amacın. O iç sesin susmasına izin verme.',
      4:'Yaşam yolu 4 — Düzen ve güven arıyorsun. Belirsizliğe teslim olmayı öğrenirsen çok hafiflersin.',
      5:'Yaşam yolu 5 — Özgürlük alfabenin tamamı. Bağlanmaktan değil, kaybolmaktan korkuyorsun.',
      6:'Yaşam yolu 6 — Herkesi taşıyorsun, ama kendini taşıyan var mı?',
      7:'Yaşam yolu 7 — Gizemler seni çekiyor çünkü sen de bir gizem taşıyorsun.',
      8:'Yaşam yolu 8 — Güç arayışı aslında güvende hissetme ihtiyacı. İkisi aynı şey değil.',
      9:'Yaşam yolu 9 — İnsanlık için yanıyorsun. Kendi acılarını hep en sona bırakıyorsun.',
      11:'Usta sayı 11 — Sezgin keskin, vizyonun büyük. Bu hassasiyet seni hem güçlü hem kırılgan yapıyor.',
      22:'Usta sayı 22 — Büyük yapılar kurma potansiyelisin. Mükemmeliyetçilik seni başlamadan durdurmasın.',
      33:'Usta sayı 33 — Şefkat dorukta. Herkesi kurtarmaya çalışırken kendi ruhunu ihmal etme.',
    };

    const astTexts = {
      'Koç':'Ateş enerjin seni öne iter ama sabırsızlığın ilişkilerde fatura keser. Hızına ayak uyduracak, özgürlüğüne saygı duyan biri şart.',
      'Boğa':'Güven ve istikrar senin için pazarlık konusu değil. Bir kez karar verince kayadan güçlüsün.',
      'İkizler':'Zihinin sürekli hareket halinde. Seni entelektüel olarak takip edebilecek biri arıyorsun.',
      'Yengeç':'Duygusal derinliğin hem gücün hem savunmasızlığın. Seni gerçekten görecek biri.',
      'Aslan':'Sahneye ihtiyacın var ama karanlıkta da sevilmek istiyorsun.',
      'Başak':'Detaycısın, mükemmeliyetçisin. Kaosunu kabul edecek biri.',
      'Terazi':'Denge ve estetik önceliğin. Çatışmadan kaçınıyorsun ama bu bazen kendi ihtiyaçlarını bastırıyor.',
      'Akrep':'Derin, tutkulu. Yüzeysel ilişkiler seni öldürür. Ya her şey ya hiçbir şey.',
      'Yay':'Özgürlük ve anlam arıyorsun. Seni küçük bir hayata mahkûm etmeyecek biri.',
      'Oğlak':'Uzun vadeli düşünürsün. Hırsına ortak olan ama seni dinleyecek biri.',
      'Kova':'Sıradışısın. Seni anlamak için çabalamayan değil, zaten anlayan biri.',
      'Balık':'Sezgisel ve romantiksin. Hayal kurmana izin veren ama seni gerçeğe bağlayan biri.',
    };

    setResult({
      pct, verdict, summary, traits, matchPct,
      matchPerson: `${z} + ${LP_DATA[lp]?.name || 'Gizemli'} enerjisi → ${zc.trait} yapıda biri`,
      matchWhere: `Büyük ihtimalle onu ${zc.where} bulacaksın.`,
      numText: numTexts[lp] || `Yaşam yolu ${lp} — Eşsiz bir titreşim.`,
      astText: `${z} burcu: ${astTexts[z] || 'Eşsiz bir burç enerjisi.'}`,
      relText: (ans.love >= 7 || ans.attach >= 7)
        ? 'İlişkide derin bağ kurmayı başarıyorsun. Ama biraz çok veriyorsun — karşındakinin hazır olup olmadığını kontrol et.'
        : (ans.attach <= 3)
        ? 'Geçmişte yeterince incindin, duvarların kalın. Doğru birini bulmak daha uzun sürüyor — bu kötü değil.'
        : 'Hem bağlanmak hem özgür kalmak istiyorsun. Kendi ihtiyaçlarına dürüst olmak ilk adım.',
    });
    setPhase('result');
  };

  const restart = () => {
    setCurQ(0); setAnswers({}); setDateInput(''); setRangeVal(5);
    setSelectedOpt(null); setLp(null); setZodiac(null);
    setTotalSc(0); setMaxSc(0); setResult(null);
    setPhase('landing');
  };

  // ── LANDING ──────────────────────────────────────────
  if (phase === 'landing') {
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.landingWrap}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backText}>← Geri</Text>
          </TouchableOpacity>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <Text style={s.landingEye}>𓂀</Text>
            <Text style={s.landingTitle}>Beni Yargıla</Text>
            <Text style={s.landingTagline}>Numeroloji · Astroloji · Psikoloji</Text>
            <Text style={s.landingDesc}>
              Doğduğun günden ilişkilerine, gizli korkularından ruh eşi profiline kadar — her şeyi biliyoruz. Hazırsan.
            </Text>
            <View style={s.pillRow}>
              {['Numeroloji','Astroloji','Psikoloji','İlişki'].map(p => (
                <View key={p} style={s.pill}><Text style={s.pillText}>{p}</Text></View>
              ))}
            </View>
            <TouchableOpacity style={s.mainBtn} onPress={() => setPhase('quiz')} activeOpacity={0.85}>
              <Text style={s.mainBtnText}>Beni Yargıla →</Text>
            </TouchableOpacity>
            <Text style={s.landingHint}>12 soru · ~3 dakika · Paylaşılabilir sonuç</Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── QUIZ ─────────────────────────────────────────────
  if (phase === 'quiz') {
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.quizWrap} keyboardShouldPersistTaps="handled">

          {/* Progress */}
          <View style={s.progWrap}>
            <View style={s.progMeta}>
              <Text style={s.progLabel}>Soru {curQ} / {QUESTIONS.length}</Text>
              <Text style={s.progLabel}>{progress}%</Text>
            </View>
            <View style={s.progBar}>
              <View style={[s.progFill, { width: `${progress}%` }]} />
            </View>
          </View>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* Kart */}
            <View style={s.qCard}>
              <Text style={s.qTag}>{q.tag}</Text>
              {q.q ? <Text style={s.qText}>{q.q}</Text> : null}
              {q.hint ? <Text style={s.qHint}>{q.hint}</Text> : null}

              {/* Date */}
              {q.type === 'date' && (
                <TextInput
                  style={s.dateInput}
                  value={dateInput}
                  onChangeText={setDateInput}
                  placeholder="15.06.1995"
                  placeholderTextColor="#4A3F35"
                  keyboardType="numeric"
                  maxLength={10}
                />
              )}

              {/* Reveal */}
              {q.type === 'reveal' && lp && (
                <View style={s.revealBox}>
                  <Text style={s.revealNum}>{lp}</Text>
                  <Text style={s.revealName}>Yaşam Yolu: {LP_DATA[lp]?.name}</Text>
                  <Text style={s.revealDesc}>{LP_DATA[lp]?.desc}</Text>
                  <Text style={s.revealZodiac}>Burcun: {zodiac}</Text>
                </View>
              )}

              {/* Options */}
              {q.type === 'opts' && (
                <View style={s.optsWrap}>
                  {q.opts.map((opt, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[s.opt, selectedOpt === opt.s && s.optSel]}
                      onPress={() => setSelectedOpt(opt.s)}
                      activeOpacity={0.8}>
                      <Text style={[s.optText, selectedOpt === opt.s && s.optTextSel]}>
                        {opt.t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Range */}
              {q.type === 'range' && (
                <View style={s.rangeWrap}>
                  <View style={s.rangeLabels}>
                    <Text style={s.rangeLabelText}>{q.minL}</Text>
                    <Text style={s.rangeLabelText}>{q.maxL}</Text>
                  </View>
                  <View style={s.rangeTrack}>
                    {[1,2,3,4,5,6,7,8,9,10].map(v => (
                      <TouchableOpacity
                        key={v}
                        style={[s.rangeDot, rangeVal >= v && s.rangeDotActive]}
                        onPress={() => setRangeVal(v)}
                      />
                    ))}
                  </View>
                  <Text style={s.rangeVal}>{rangeVal} / 10</Text>
                </View>
              )}
            </View>

            {/* Next */}
            <TouchableOpacity
              style={[s.nextBtn, !canNext() && s.nextBtnDisabled]}
              onPress={canNext() ? handleNext : null}
              activeOpacity={0.85}>
              <Text style={[s.nextBtnText, !canNext() && s.nextBtnTextDisabled]}>
                Devam Et →
              </Text>
            </TouchableOpacity>

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── RESULT ────────────────────────────────────────────
  if (phase === 'result' && result) {
    const verdictColor = result.pct >= 70 ? '#C9A84C' : result.pct >= 45 ? '#D4935A' : '#8B1A1A';
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.resultWrap}>

          <Text style={s.resultEyebrow}>YARGI KARARI</Text>
          <ScoreRing score={result.pct} />
          <Text style={[s.verdictTitle, { color: verdictColor }]}>{result.verdict}</Text>
          <Text style={s.verdictSub}>{result.summary}</Text>

          {/* Traits */}
          <View style={s.traitsRow}>
            {result.traits.map(t => (
              <View key={t} style={s.traitPill}>
                <Text style={s.traitText}>{t}</Text>
              </View>
            ))}
          </View>

          {/* Match Kartı */}
          <View style={s.matchCard}>
            <Text style={s.matchLabel}>İDEAL EŞLEŞMENİZ</Text>
            <Text style={s.matchPct}>{result.matchPct}%</Text>
            <Text style={s.matchPerson}>{result.matchPerson}</Text>
            <Text style={s.matchWhere}>{result.matchWhere}</Text>
          </View>

          {/* Analiz Blokları */}
          {[
            { label: 'NUMEROLOJİ', text: result.numText },
            { label: 'ASTROLOJİ & BURÇ', text: result.astText },
            { label: 'İLİŞKİ PROFİLİ', text: result.relText },
          ].map(b => (
            <View key={b.label} style={s.block}>
              <Text style={s.blockLabel}>{b.label}</Text>
              <Text style={s.blockText}>{b.text}</Text>
            </View>
          ))}

          {/* Butonlar */}
          <TouchableOpacity style={s.restartBtn} onPress={restart} activeOpacity={0.85}>
            <Text style={s.restartBtnText}>↺ Yeniden Yargılan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.backHomeBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={s.backHomeBtnText}>← Profile Dön</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0E0908' },

  // LANDING
  landingWrap: { padding: 28, paddingBottom: 60, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', marginBottom: 20 },
  backText: { color: '#C9A84C', fontSize: 15, fontWeight: '700' },
  landingEye: { fontSize: 64, textAlign: 'center', marginBottom: 16 },
  landingTitle: { fontSize: 36, fontWeight: '900', color: '#C9A84C', textAlign: 'center', letterSpacing: 2 },
  landingTagline: { fontSize: 12, color: '#6B5D52', textAlign: 'center', letterSpacing: 3, marginTop: 8, marginBottom: 20 },
  landingDesc: { fontSize: 16, color: '#8A7A6A', textAlign: 'center', lineHeight: 26, fontStyle: 'italic', marginBottom: 28, paddingHorizontal: 8 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 36 },
  pill: { borderWidth: 1, borderColor: 'rgba(201,168,76,0.35)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  pillText: { fontSize: 11, color: '#C9A84C', fontWeight: '600', letterSpacing: 0.5 },
  mainBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#C9A84C', borderRadius: 14, paddingVertical: 18, paddingHorizontal: 48, alignItems: 'center', marginBottom: 16 },
  mainBtnText: { color: '#C9A84C', fontSize: 16, fontWeight: '800', letterSpacing: 2 },
  landingHint: { fontSize: 12, color: '#4A3F35', letterSpacing: 1, textAlign: 'center' },

  // QUIZ
  quizWrap: { padding: 24, paddingBottom: 60 },
  progWrap: { marginBottom: 24 },
  progMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progLabel: { fontSize: 11, color: '#6B5D52', fontWeight: '700', letterSpacing: 1 },
  progBar: { height: 2, backgroundColor: 'rgba(201,168,76,0.15)', borderRadius: 1 },
  progFill: { height: 2, backgroundColor: '#C9A84C', borderRadius: 1 },

  qCard: { backgroundColor: 'rgba(42,26,16,0.9)', borderRadius: 20, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)' },
  qTag: { fontSize: 10, color: '#C9A84C', fontWeight: '800', letterSpacing: 3, marginBottom: 12, opacity: 0.7 },
  qText: { fontSize: 19, color: '#D4C4B0', lineHeight: 28, fontWeight: '400', marginBottom: 8 },
  qHint: { fontSize: 13, color: '#6B5D52', fontStyle: 'italic', marginBottom: 20 },

  dateInput: { borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)', borderRadius: 12, padding: 16, color: '#F0D080', fontSize: 20, textAlign: 'center', letterSpacing: 2, fontWeight: '700' },

  revealBox: { alignItems: 'center', paddingVertical: 16 },
  revealNum: { fontSize: 80, fontWeight: '900', color: '#C9A84C', lineHeight: 90 },
  revealName: { fontSize: 14, color: '#C9A84C', letterSpacing: 3, textTransform: 'uppercase', marginTop: 4 },
  revealDesc: { fontSize: 15, color: '#8A7A6A', fontStyle: 'italic', marginTop: 8, textAlign: 'center' },
  revealZodiac: { fontSize: 14, color: '#C9A84C', letterSpacing: 2, marginTop: 10, fontWeight: '700' },

  optsWrap: { gap: 10 },
  opt: { borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)', borderRadius: 12, padding: 14 },
  optSel: { borderColor: '#C9A84C', backgroundColor: 'rgba(201,168,76,0.1)' },
  optText: { fontSize: 15, color: '#8A7A6A', lineHeight: 22 },
  optTextSel: { color: '#F0D080', fontWeight: '600' },

  rangeWrap: { paddingTop: 8 },
  rangeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  rangeLabelText: { fontSize: 11, color: '#6B5D52' },
  rangeTrack: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rangeDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)' },
  rangeDotActive: { backgroundColor: '#C9A84C', borderColor: '#C9A84C' },
  rangeVal: { textAlign: 'center', color: '#C9A84C', fontSize: 14, fontWeight: '700', marginTop: 12, letterSpacing: 1 },

  nextBtn: { backgroundColor: '#C9A84C', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  nextBtnDisabled: { backgroundColor: 'rgba(201,168,76,0.15)' },
  nextBtnText: { color: '#0E0908', fontSize: 15, fontWeight: '800', letterSpacing: 1.5 },
  nextBtnTextDisabled: { color: 'rgba(201,168,76,0.4)' },

  // RESULT
  resultWrap: { padding: 24, paddingBottom: 60, alignItems: 'center' },
  resultEyebrow: { fontSize: 10, color: '#6B5D52', letterSpacing: 4, fontWeight: '800', marginBottom: 24, marginTop: 8 },
  verdictTitle: { fontSize: 24, fontWeight: '900', letterSpacing: 1, marginBottom: 12, textAlign: 'center' },
  verdictSub: { fontSize: 16, color: '#8A7A6A', textAlign: 'center', lineHeight: 26, fontStyle: 'italic', paddingHorizontal: 8, marginBottom: 20 },

  traitsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 24 },
  traitPill: { borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  traitText: { fontSize: 11, color: '#C9A84C', fontWeight: '700', letterSpacing: 0.5 },

  matchCard: { width: '100%', backgroundColor: 'rgba(139,26,26,0.2)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16 },
  matchLabel: { fontSize: 10, color: '#6B5D52', letterSpacing: 3, fontWeight: '800', marginBottom: 8 },
  matchPct: { fontSize: 52, fontWeight: '900', color: '#C9A84C', lineHeight: 60 },
  matchPerson: { fontSize: 15, color: '#F0D080', textAlign: 'center', marginTop: 8, lineHeight: 22 },
  matchWhere: { fontSize: 13, color: '#8A7A6A', fontStyle: 'italic', marginTop: 6, textAlign: 'center' },

  block: { width: '100%', backgroundColor: 'rgba(42,26,16,0.6)', borderLeftWidth: 2, borderLeftColor: 'rgba(201,168,76,0.5)', padding: 18, marginBottom: 12, borderRadius: 0 },
  blockLabel: { fontSize: 9, color: '#C9A84C', letterSpacing: 4, fontWeight: '800', marginBottom: 8 },
  blockText: { fontSize: 14, color: '#B0A090', lineHeight: 24, fontStyle: 'italic' },

  restartBtn: { width: '100%', backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  restartBtnText: { color: '#6B5D52', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  backHomeBtn: { paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  backHomeBtnText: { color: '#4A3F35', fontSize: 13, fontWeight: '600' },
});