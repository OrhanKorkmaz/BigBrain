import React, { useEffect, useRef, useState } from "react";
import {
View,
Text,
StyleSheet,
SafeAreaView,
ScrollView,
TouchableOpacity,
Animated,
Easing
} from "react-native";

const MODELS = [
{
id:1,
model:"ChatGPT",
answer:"Analizlere göre en doğru yaklaşım önce teorik çerçeveyi anlamak ve ardından uygulamaya geçmektir.",
score:93,
consensus:true
},
{
id:2,
model:"Gemini",
answer:"Verilere bakıldığında hem teori hem pratik birleşimi en güçlü sonucu üretmektedir.",
score:91,
consensus:true
},
{
id:3,
model:"Claude",
answer:"Konunun özünde sistematik öğrenme ve pratik tekrar vardır. Araştırmalar bunu destekler.",
score:90,
consensus:true
},
{
id:4,
model:"Grok",
answer:"Farklı bir perspektiften bakıldığında mevcut yaklaşım yeterli değildir.",
score:37,
consensus:false
}
];

function ModelCard({data,index}){

const fade = useRef(new Animated.Value(0)).current;
const slide = useRef(new Animated.Value(40)).current;
const [open,setOpen]=useState(false);

useEffect(()=>{

Animated.parallel([
Animated.timing(fade,{
toValue:1,
duration:600,
delay:index*200,
useNativeDriver:true
}),
Animated.timing(slide,{
toValue:0,
duration:600,
delay:index*200,
easing:Easing.out(Easing.cubic),
useNativeDriver:true
})
]).start();

},[]);

return(

<Animated.View style={[
styles.card,
!data.consensus && styles.outlier,
{opacity:fade,transform:[{translateY:slide}]}
]}>

<View style={styles.cardTop}>

<Text style={styles.modelName}>{data.model}</Text>

<View style={[
styles.scoreBox,
{backgroundColor:data.consensus?"#EAF7EE":"#FDECEA"}
]}>
<Text style={[
styles.score,
{color:data.consensus?"#2E7D32":"#E53935"}
]}>
{data.score}%
</Text>
</View>

</View>

<Text
style={styles.answer}
numberOfLines={open?undefined:3}
>
{data.answer}
</Text>

<TouchableOpacity onPress={()=>setOpen(!open)}>
<Text style={styles.expand}>
{open?"Küçült ↑":"Devamını Gör ↓"}
</Text>
</TouchableOpacity>

<View style={styles.voteRow}>

<TouchableOpacity style={styles.like}>
<Text style={styles.likeText}>👍 Doğru</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.dislike}>
<Text style={styles.dislikeText}>👎 Yanlış</Text>
</TouchableOpacity>

</View>

</Animated.View>

);
}

export default function ResultsScreen({navigation,route}){

const question = route?.params?.question || "Örnek soru";

const glow = useRef(new Animated.Value(0)).current;

useEffect(()=>{

Animated.loop(
Animated.sequence([
Animated.timing(glow,{toValue:1,duration:900,useNativeDriver:false}),
Animated.timing(glow,{toValue:0.2,duration:900,useNativeDriver:false})
])
).start();

},[]);

const glowColor = glow.interpolate({
inputRange:[0,1],
outputRange:["#FF2200","#FF8800"]
});

const consensusScore = Math.round(
MODELS.filter(m=>m.consensus).reduce((a,b)=>a+b.score,0)/
MODELS.filter(m=>m.consensus).length
);

return(

<SafeAreaView style={styles.container}>

<Animated.View style={[
styles.island,
{
shadowColor:glowColor,
shadowOpacity:glow,
shadowRadius:25,
borderColor:glowColor
}
]}>
<Text style={styles.islandText}>Consensus AI</Text>
</Animated.View>

<ScrollView
style={{width:"100%"}}
contentContainerStyle={{padding:24}}
showsVerticalScrollIndicator={false}
>

<View style={styles.questionBox}>
<Text style={styles.label}>SORU</Text>
<Text style={styles.question}>{question}</Text>
</View>

<View style={styles.consensusBox}>

<View>
<Text style={styles.consensusTitle}>
Consensus Score
</Text>

<Text style={styles.consensusDesc}>
AI modelleri büyük ölçüde hemfikir
</Text>

</View>

<View style={styles.bigScoreBox}>
<Text style={styles.bigScore}>
{consensusScore}%
</Text>
</View>

</View>

<Text style={styles.sectionTitle}>
MODEL ANALİZİ
</Text>

{MODELS.map((m,i)=>(
<ModelCard
key={m.id}
data={m}
index={i}
/>
))}

<View style={{marginTop:20}}>

<TouchableOpacity
style={styles.verdictBtn}
onPress={()=>navigation.navigate("Verdict",{question})}
>

<Text style={styles.verdictText}>
⚖️ Final Konsensüs Kararı
</Text>

</TouchableOpacity>

<TouchableOpacity
style={styles.newBtn}
onPress={()=>navigation.navigate("Home")}
>

<Text style={styles.newText}>
Yeni Soru Sor →
</Text>

</TouchableOpacity>

</View>

</ScrollView>

</SafeAreaView>

);
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F5EBDD",
alignItems:"center"
},

island:{
width:170,
height:40,
backgroundColor:"#000",
borderRadius:20,
alignItems:"center",
justifyContent:"center",
marginTop:12,
borderWidth:1
},

islandText:{
color:"#fff",
fontWeight:"700"
},

questionBox:{
backgroundColor:"#EDE4D8",
borderRadius:16,
padding:16,
marginBottom:18
},

label:{
fontSize:11,
fontWeight:"700",
color:"#B0A090",
marginBottom:6
},

question:{
fontSize:16,
color:"#2C1E14"
},

consensusBox:{
backgroundColor:"#EAF7EE",
borderRadius:16,
padding:16,
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginBottom:22
},

consensusTitle:{
fontWeight:"700",
fontSize:15,
color:"#2E7D32"
},

consensusDesc:{
fontSize:13,
color:"#4CAF50"
},

bigScoreBox:{
backgroundColor:"#2E7D32",
borderRadius:12,
paddingHorizontal:14,
paddingVertical:8
},

bigScore:{
color:"#fff",
fontSize:22,
fontWeight:"800"
},

sectionTitle:{
fontSize:12,
fontWeight:"800",
color:"#B0A090",
marginBottom:10
},

card:{
backgroundColor:"#fff",
borderRadius:18,
padding:18,
marginBottom:14,
borderWidth:1,
borderColor:"#EDE4D8"
},

outlier:{
backgroundColor:"#FFF5F5",
borderColor:"#FFCDD2"
},

cardTop:{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:10
},

modelName:{
fontWeight:"700",
fontSize:16
},

scoreBox:{
borderRadius:10,
paddingHorizontal:10,
paddingVertical:4
},

score:{
fontWeight:"800",
fontSize:16
},

answer:{
fontSize:15,
color:"#3A2E28",
lineHeight:22
},

expand:{
marginTop:8,
color:"#FF2200",
fontWeight:"600"
},

voteRow:{
flexDirection:"row",
marginTop:12,
gap:10
},

like:{
flex:1,
backgroundColor:"#EAF7EE",
borderRadius:10,
padding:10,
alignItems:"center"
},

dislike:{
flex:1,
backgroundColor:"#FDECEA",
borderRadius:10,
padding:10,
alignItems:"center"
},

likeText:{
color:"#2E7D32",
fontWeight:"700"
},

dislikeText:{
color:"#E53935",
fontWeight:"700"
},

verdictBtn:{
backgroundColor:"#2C1E14",
borderRadius:18,
padding:18,
alignItems:"center",
marginBottom:10
},

verdictText:{
color:"#F5EBDD",
fontWeight:"800"
},

newBtn:{
backgroundColor:"#EDE4D8",
borderRadius:18,
padding:16,
alignItems:"center"
},

newText:{
fontWeight:"700",
color:"#2C1E14"
}

});;