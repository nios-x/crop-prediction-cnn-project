export type Severity = "none" | "low" | "medium" | "high" | "critical";

export interface DiseaseInfo {
  displayName: string;
  displayNameHi: string;
  severity: Severity;
  description: string;
  descriptionHi: string;
  remedies: {
    en: string[];
    hi: string[];
  };
}

export type CropType = "potato" | "tomato" | "pepper_bell" | "onion" | "carrot" | "cabbage" | "cauliflower" | "brinjal" | "corn" | "apple" | "grape" | "strawberry";

export const POTATO_CLASSES = [
  "Potato___Early_blight",
  "Potato___Late_blight",
  "Potato___healthy",
];

export const TOMATO_CLASSES = [
  "Tomato___Bacterial_spot",
  "Tomato___Early_blight",
  "Tomato___Late_blight",
  "Tomato___Leaf_Mold",
  "Tomato___Septoria_leaf_spot",
  "Tomato___Spider_mites",
  "Tomato___Target_Spot",
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
  "Tomato___Tomato_mosaic_virus",
  "Tomato___healthy",
];

export const PEPPER_BELL_CLASSES = [
  "Pepper,_bell___Bacterial_spot",
  "Pepper,_bell___healthy",
];

export const ONION_CLASSES = ["Onion___Purple_blotch", "Onion___healthy"];
export const CARROT_CLASSES = ["Carrot___Leaf_blight", "Carrot___healthy"];
export const CABBAGE_CLASSES = ["Cabbage___Black_rot", "Cabbage___healthy"];
export const CAULIFLOWER_CLASSES = ["Cauliflower___Soft_rot", "Cauliflower___healthy"];
export const BRINJAL_CLASSES = ["Brinjal___Phomopsis_blight", "Brinjal___healthy"];
export const CORN_CLASSES = ["Corn___Common_rust", "Corn___Gray_leaf_spot", "Corn___Northern_Leaf_Blight", "Corn___healthy"];
export const APPLE_CLASSES = ["Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy"];
export const GRAPE_CLASSES = ["Grape___Black_rot", "Grape___Esca", "Grape___Leaf_blight", "Grape___healthy"];
export const STRAWBERRY_CLASSES = ["Strawberry___Leaf_scorch", "Strawberry___healthy"];

export const DISEASE_DB: Record<string, DiseaseInfo> = {
  // ── Potato diseases ───────────────────────────────────────────────
  Potato___Early_blight: {
    displayName: "Potato Early Blight",
    displayNameHi: "आलू - अगेती झुलसा",
    severity: "medium",
    description:
      "Caused by the fungus Alternaria solani. Dark concentric-ring lesions appear on older leaves first, spreading upward and reducing yield.",
    descriptionHi: "फफूंद अल्टरनेरिया सोलानी के कारण पत्तियों पर गहरे भूरे गोल धब्बे बनते हैं।",
    remedies: {
      en: [
        "Apply fungicides like chlorothalonil or mancozeb at first sign of symptoms.",
        "Practice crop rotation — avoid planting potatoes in the same field for 2–3 years.",
        "Remove and destroy infected plant debris after harvest.",
      ],
      hi: [
        "लक्षण दिखते ही क्लोरोथालोनिल या मैंकोज़ेब जैसे कवकनाशी का छिड़काव करें।",
        "फसल चक्र अपनाएँ — 2-3 साल तक एक ही खेत में आलू न लगाएँ।",
        "फसल कटाई के बाद संक्रमित पौधों के अवशेष हटाकर नष्ट करें।",
      ],
    },
  },
  Potato___Late_blight: {
    displayName: "Potato Late Blight",
    displayNameHi: "आलू - पछेती झुलसा",
    severity: "critical",
    description:
      "Caused by the oomycete Phytophthora infestans. Water-soaked lesions with white mold appear on leaves, stems, and tubers. Can destroy an entire crop within days.",
    descriptionHi: "फाइटोफ्थोरा इन्फेस्टन्स फफूंद से गंभीर पत्ती एवं कंद सड़न होती है।",
    remedies: {
      en: [
        "Apply systemic fungicides such as metalaxyl or cymoxanil immediately.",
        "Ensure good air circulation by maintaining proper row spacing.",
        "Avoid overhead irrigation; use drip irrigation instead to keep foliage dry.",
      ],
      hi: [
        "तुरंत मेटालैक्सिल या सायमॉक्सेनिल जैसे प्रणालीगत कवकनाशी का प्रयोग करें।",
        "उचित कतार दूरी बनाकर अच्छा वायु संचार सुनिश्चित करें।",
        "ऊपर से सिंचाई न करें; पत्तियों को सूखा रखने के लिए ड्रिप सिंचाई का उपयोग करें।",
      ],
    },
  },
  "Potato___healthy": {
    displayName: "Healthy Potato",
    displayNameHi: "आलू - स्वस्थ",
    severity: "none",
    description:
      "The leaf appears healthy with no visible signs of disease. Continue standard crop management practices.",
    descriptionHi: "कोई रोग नहीं पाया गया। पत्ती स्वस्थ है।",
    remedies: {
      en: [
        "Continue regular watering and nutrient management.",
        "Monitor leaves weekly for any early signs of infection.",
        "Maintain balanced fertilization to keep plants vigorous.",
      ],
      hi: [
        "नियमित सिंचाई और पोषक तत्व प्रबंधन जारी रखें।",
        "संक्रमण के शुरुआती संकेतों के लिए साप्ताहिक पत्तियों की जाँच करें।",
        "पौधों को स्वस्थ रखने के लिए संतुलित उर्वरक दें।",
      ],
    },
  },

  // ── Tomato diseases ───────────────────────────────────────────────
  Tomato___Bacterial_spot: {
    displayName: "Bacterial Spot",
    displayNameHi: "टमाटर - बैक्टीरियल स्पॉट",
    severity: "high",
    description:
      "Caused by Xanthomonas bacteria. Small, water-soaked spots appear on leaves, becoming brown with yellow halos. Fruit may develop raised, scabby lesions.",
    descriptionHi: "ज़ैन्थोमोनास बैक्टीरिया के कारण पत्तियों और फलों पर छोटे काले धब्बे।",
    remedies: {
      en: [
        "Apply copper-based bactericides early in the disease cycle.",
        "Use certified disease-free seeds and transplants.",
        "Avoid working in the field when foliage is wet to prevent spread.",
      ],
      hi: [
        "रोग चक्र की शुरुआत में ताम्र आधारित जीवाणुनाशकों का छिड़काव करें।",
        "प्रमाणित रोगमुक्त बीज और पौध का उपयोग करें।",
        "पत्तियाँ गीली होने पर खेत में काम करने से बचें।",
      ],
    },
  },
  Tomato___Early_blight: {
    displayName: "Tomato Early Blight",
    displayNameHi: "टमाटर - अगेती झुलसा",
    severity: "medium",
    description:
      "Caused by Alternaria solani. Brown-black spots with concentric rings form on lower leaves and move upward. Reduces fruit yield significantly.",
    descriptionHi: "अल्टरनेरिया सोलानी फफूंद से निचली पत्तियों पर गहरे छल्लेदार धब्बे बनते हैं।",
    remedies: {
      en: [
        "Spray chlorothalonil or copper-based fungicides at 7–10 day intervals.",
        "Mulch around the base of plants to reduce soil splash onto leaves.",
        "Stake plants to improve airflow and reduce humidity around foliage.",
      ],
      hi: [
        "7-10 दिन के अंतराल पर क्लोरोथालोनिल या ताम्र आधारित कवकनाशी का छिड़काव करें।",
        "मिट्टी के छींटों से बचने के लिए पौधों के आधार पर मल्चिंग करें।",
        "वायु प्रवाह बेहतर करने के लिए पौधों को सहारा दें।",
      ],
    },
  },
  Tomato___Late_blight: {
    displayName: "Tomato Late Blight",
    displayNameHi: "टमाटर - पछेती झुलसा",
    severity: "critical",
    description:
      "Caused by Phytophthora infestans. Large, greasy-looking gray-green patches appear on leaves, turning dark brown. White mold may form on undersides.",
    descriptionHi: "फाइटोफ्थोरा फफूंद के कारण पत्तियों पर पानी जैसे भूरे धब्बे बनते हैं।",
    remedies: {
      en: [
        "Apply metalaxyl-based fungicides immediately upon detection.",
        "Remove and burn all infected plant parts to halt spread.",
        "Avoid planting near potato fields as the disease jumps between crops.",
      ],
      hi: [
        "पहचान होते ही मेटालैक्सिल आधारित कवकनाशी लगाएँ।",
        "प्रसार रोकने के लिए सभी संक्रमित भागों को हटाकर जलाएँ।",
        "आलू के खेतों के पास रोपण से बचें क्योंकि रोग फसलों के बीच फैलता है।",
      ],
    },
  },
  Tomato___Leaf_Mold: {
    displayName: "Leaf Mold",
    displayNameHi: "टमाटर - पत्ती फफूंद",
    severity: "medium",
    description:
      "Caused by the fungus Passalora fulva. Yellow patches form on upper leaf surfaces while olive-green velvety mold appears on undersides.",
    descriptionHi: "पासालोरा फुल्वा फफूंद के कारण पत्ती के पीछे पीले-हरे धब्बे बनते हैं।",
    remedies: {
      en: [
        "Increase ventilation in greenhouses; reduce humidity below 85%.",
        "Apply fungicides containing mancozeb or chlorothalonil.",
        "Use resistant tomato varieties when available.",
      ],
      hi: [
        "ग्रीनहाउस में हवा का प्रवाह बढ़ाएँ; आर्द्रता 85% से नीचे रखें।",
        "मैंकोज़ेब या क्लोरोथालोनिल युक्त कवकनाशी लगाएँ।",
        "उपलब्ध होने पर प्रतिरोधी टमाटर किस्मों का उपयोग करें।",
      ],
    },
  },
  Tomato___Septoria_leaf_spot: {
    displayName: "Septoria Leaf Spot",
    displayNameHi: "टमाटर - सेप्टोरिया पत्ती धब्बा",
    severity: "medium",
    description:
      "Caused by the fungus Septoria lycopersici. Small circular spots with gray centers and dark borders appear on lower leaves first.",
    descriptionHi: "सेप्टोरिया लाइकोपर्सिसी फफूंद से छोटे गोल धब्बे जिनमें काले बिंदु होते हैं।",
    remedies: {
      en: [
        "Remove infected lower leaves promptly to slow the spread.",
        "Apply mancozeb or copper-based fungicide sprays regularly.",
        "Rotate tomatoes with non-solanaceous crops for at least 2 years.",
      ],
      hi: [
        "प्रसार रोकने के लिए संक्रमित निचली पत्तियों को तुरंत हटाएँ।",
        "मैंकोज़ेब या ताम्र आधारित कवकनाशी का नियमित छिड़काव करें।",
        "कम से कम 2 साल तक गैर-सोलेनेसी फसलों के साथ फसल चक्र अपनाएँ।",
      ],
    },
  },
  Tomato___Spider_mites: {
    displayName: "Spider Mites",
    displayNameHi: "टमाटर - मकड़ी कीट",
    severity: "high",
    description:
      "Tiny spider mites (Tetranychus urticae) feed on leaf undersides, causing yellow stippling, bronzing, and fine webbing. Severe infestations cause leaf drop.",
    descriptionHi: "दो-धब्बे वाले मकड़ी कीट पत्तियों का रस चूसते हैं जिससे बिंदीदार धब्बे बनते हैं।",
    remedies: {
      en: [
        "Spray with neem oil or insecticidal soap to control populations.",
        "Introduce predatory mites (Phytoseiulus persimilis) as a biological control.",
        "Increase humidity around plants — mites thrive in hot, dry conditions.",
      ],
      hi: [
        "नीम तेल या कीटनाशक साबुन का छिड़काव करें।",
        "जैविक नियंत्रण के लिए शिकारी माइट्स का उपयोग करें।",
        "पौधों के आसपास आर्द्रता बढ़ाएँ — माइट्स गर्म, शुष्क स्थितियों में पनपते हैं।",
      ],
    },
  },
  Tomato___Target_Spot: {
    displayName: "Target Spot",
    displayNameHi: "टमाटर - लक्ष्य धब्बा",
    severity: "medium",
    description:
      "Caused by the fungus Corynespora cassiicola. Brown spots with concentric rings (target-like pattern) appear on leaves, stems, and fruit.",
    descriptionHi: "कोरिनेस्पोरा कैसीकोला फफूंद से गोल-छल्लेदार लक्ष्य जैसे धब्बे बनते हैं।",
    remedies: {
      en: [
        "Apply azoxystrobin or difenoconazole fungicides on detection.",
        "Prune lower branches to increase air circulation.",
        "Avoid overhead watering and irrigate at ground level.",
      ],
      hi: [
        "पहचान होने पर एज़ोक्सीस्ट्रोबिन या डाइफेनोकोनाज़ोल कवकनाशी लगाएँ।",
        "हवा के प्रवाह के लिए निचली शाखाओं की छँटाई करें।",
        "ऊपरी सिंचाई से बचें और भूमि स्तर पर सिंचाई करें।",
      ],
    },
  },
  Tomato___Tomato_Yellow_Leaf_Curl_Virus: {
    displayName: "Yellow Leaf Curl Virus",
    displayNameHi: "टमाटर - पीली पत्ती मोड़ विषाणु",
    severity: "critical",
    description:
      "A devastating viral disease transmitted by whiteflies (Bemisia tabaci). Leaves curl upward, turn yellow, and plants become stunted. No cure exists once infected.",
    descriptionHi: "सफेद मक्खी द्वारा फैलने वाला विषाणु जिससे पत्तियाँ पीली और मुड़ जाती हैं।",
    remedies: {
      en: [
        "Control whitefly populations with reflective mulch and sticky traps.",
        "Apply imidacloprid or thiamethoxam insecticides to manage whiteflies.",
        "Remove and destroy infected plants immediately to prevent spread.",
      ],
      hi: [
        "परावर्तक मल्च और चिपचिपे ट्रैप से सफेद मक्खी नियंत्रित करें।",
        "सफेद मक्खी प्रबंधन के लिए इमिडाक्लोप्रिड या थियामेथोक्सम का उपयोग करें।",
        "प्रसार रोकने के लिए संक्रमित पौधों को तुरंत हटाकर नष्ट करें।",
      ],
    },
  },
  Tomato___Tomato_mosaic_virus: {
    displayName: "Mosaic Virus",
    displayNameHi: "टमाटर - मोज़ेक विषाणु",
    severity: "high",
    description:
      "A highly contagious virus causing mottled yellow-green patterns on leaves, stunted growth, and reduced fruit quality. Spreads through touch and contaminated tools.",
    descriptionHi: "तम्बाकू मोज़ेक विषाणु से पत्तियों पर हरे-पीले मोज़ेक पैटर्न बनते हैं।",
    remedies: {
      en: [
        "Sanitize all garden tools with 10% bleach solution between uses.",
        "Remove and destroy infected plants — do not compost them.",
        "Wash hands thoroughly after handling tobacco products before touching plants.",
      ],
      hi: [
        "उपयोग के बीच सभी उपकरणों को 10% ब्लीच घोल से साफ करें।",
        "संक्रमित पौधों को हटाकर नष्ट करें — उन्हें कम्पोस्ट न करें।",
        "तम्बाकू उत्पादों को छूने के बाद पौधों को छूने से पहले हाथ अच्छी तरह धोएँ।",
      ],
    },
  },
  "Tomato___healthy": {
    displayName: "Healthy Tomato",
    displayNameHi: "टमाटर - स्वस्थ",
    severity: "none",
    description:
      "The leaf appears healthy with no visible signs of disease or pest damage. Continue standard care practices.",
    descriptionHi: "कोई रोग नहीं पाया गया। पत्ती स्वस्थ है।",
    remedies: {
      en: [
        "Continue regular watering — tomatoes need 1–1.5 inches of water per week.",
        "Monitor plants weekly for any early signs of disease or pest activity.",
        "Support plants with cages or stakes as they grow for better airflow.",
      ],
      hi: [
        "नियमित सिंचाई जारी रखें — टमाटर को प्रति सप्ताह 1-1.5 इंच पानी चाहिए।",
        "रोग या कीट के शुरुआती संकेतों के लिए साप्ताहिक निगरानी करें।",
        "बेहतर वायु प्रवाह के लिए बढ़ते पौधों को पिंजरे या डंडे से सहारा दें।",
      ],
    },
  },

  // ── Pepper Bell diseases ──────────────────────────────────────────
  "Pepper,_bell___Bacterial_spot": {
    displayName: "Pepper Bell Bacterial Spot",
    displayNameHi: "शिमला मिर्च - बैक्टीरियल स्पॉट",
    severity: "high",
    description:
      "Caused by Xanthomonas bacteria. Small, dark, water-soaked spots appear on leaves and fruit, causing severe leaf drop and yield loss.",
    descriptionHi: "ज़ैन्थोमोनास बैक्टीरिया के कारण पत्तियों पर छोटे उभरे हुए धब्बे बनते हैं।",
    remedies: {
      en: [
        "Apply copper-based bactericides or fungicides early at first sign of spots.",
        "Avoid overhead watering; irrigate at soil level to keep leaves dry.",
        "Use certified disease-free seeds and practice strict crop rotation.",
      ],
      hi: [
        "धब्बे दिखने पर तांबा-आधारित जीवाणुनाशक या कवकनाशी का छिड़काव करें।",
        "ऊपर से सिंचाई न करें; पत्तियों को सूखा रखने के लिए मिट्टी के स्तर पर पानी दें।",
        "प्रमाणित बीमारी-मुक्त बीजों का प्रयोग करें और फसल चक्र अपनाएँ।",
      ],
    },
  },
  "Pepper,_bell___healthy": {
    displayName: "Healthy Pepper Bell",
    displayNameHi: "शिमला मिर्च - स्वस्थ",
    severity: "none",
    description:
      "The pepper bell leaf is vibrant and healthy with no visible signs of bacterial spot or fungal infection.",
    descriptionHi: "कोई रोग नहीं पाया गया। पत्ती स्वस्थ है।",
    remedies: {
      en: [
        "Maintain balanced soil moisture and good drainage.",
        "Provide full sunlight and recommended calcium/nitrogen fertilizers.",
        "Inspect leaves weekly for early signs of pests or bacterial spot.",
      ],
      hi: [
        "संतुलित मिट्टी की नमी और अच्छी जल निकासी बनाए रखें।",
        "पर्याप्त धूप और अनुशंसित कैल्शियम/नाइट्रोजन उर्वरक प्रदान करें।",
        "कीटों या जीवाणु धब्बों के संकेतों के लिए साप्ताहिक निरीक्षण करें।",
      ],
    },
  },

  // ── Onion diseases ─────────────────────────────────────────────
  Onion___Purple_blotch: {
    displayName: "Onion Purple Blotch",
    displayNameHi: "प्याज - बैंगनी धब्बा",
    severity: "high",
    description: "Caused by Alternaria porri. Purple-brown lesions with concentric rings on leaves.",
    descriptionHi: "अल्टरनेरिया पोरी फफूंद के कारण पत्तियों पर बैंगनी-भूरे धब्बे बनते हैं।",
    remedies: {
      en: ["Apply Mancozeb 75% WP @ 2.5g/L at 10-day intervals.", "Remove and destroy infected leaves.", "Avoid overhead irrigation.", "Use drip irrigation to reduce leaf wetness."],
      hi: ["मैंकोज़ेब 75% WP @ 2.5g/L हर 10 दिन में छिड़काव करें।", "संक्रमित पत्तियों को हटाकर नष्ट करें।", "ऊपर से सिंचाई से बचें।", "ड्रिप सिंचाई का उपयोग करें।"],
    },
  },
  Onion___healthy: {
    displayName: "Onion - Healthy",
    displayNameHi: "प्याज - स्वस्थ",
    severity: "none",
    description: "No disease detected. The onion plant appears healthy.",
    descriptionHi: "कोई रोग नहीं पाया गया। प्याज का पौधा स्वस्थ है।",
    remedies: {
      en: ["Continue regular crop monitoring.", "Maintain proper irrigation schedule.", "Apply balanced fertilizer."],
      hi: ["नियमित फसल निगरानी जारी रखें।", "उचित सिंचाई कार्यक्रम बनाए रखें।", "संतुलित उर्वरक डालें।"],
    },
  },

  // ── Carrot diseases ────────────────────────────────────────────
  Carrot___Leaf_blight: {
    displayName: "Carrot Leaf Blight",
    displayNameHi: "गाजर - पत्ती झुलसा",
    severity: "medium",
    description: "Caused by Alternaria dauci or Cercospora carotae. Brown-black lesions appear on leaf margins.",
    descriptionHi: "अल्टरनेरिया डौकी या सर्कोस्पोरा फफूंद के कारण पत्तियों पर भूरे-काले धब्बे।",
    remedies: {
      en: ["Apply Copper-based fungicide at first symptoms.", "Practice 3-year crop rotation.", "Remove crop residues after harvest.", "Use disease-free seeds."],
      hi: ["पहले लक्षणों पर तांबा-आधारित फफूंदनाशक का छिड़काव करें।", "3 साल का फसल चक्र अपनाएं।", "कटाई के बाद फसल अवशेष हटाएं।", "रोग-मुक्त बीज का उपयोग करें।"],
    },
  },
  Carrot___healthy: {
    displayName: "Carrot - Healthy",
    displayNameHi: "गाजर - स्वस्थ",
    severity: "none",
    description: "No disease detected. The carrot plant appears healthy.",
    descriptionHi: "कोई रोग नहीं पाया गया। गाजर का पौधा स्वस्थ है।",
    remedies: {
      en: ["Continue regular monitoring.", "Maintain soil moisture.", "Ensure adequate spacing."],
      hi: ["नियमित निगरानी जारी रखें।", "मिट्टी में नमी बनाए रखें।", "पर्याप्त दूरी सुनिश्चित करें।"],
    },
  },

  // ── Cabbage diseases ───────────────────────────────────────────
  Cabbage___Black_rot: {
    displayName: "Cabbage Black Rot",
    displayNameHi: "पत्तागोभी - काली सड़न",
    severity: "critical",
    description: "Caused by Xanthomonas campestris. V-shaped yellow lesions on leaf edges, veins turn black.",
    descriptionHi: "जैंथोमोनास बैक्टीरिया के कारण पत्तियों पर V-आकार के पीले धब्बे और काली नसें।",
    remedies: {
      en: ["Remove and destroy all infected plants immediately.", "Use certified disease-free seeds.", "Apply copper hydroxide spray.", "Practice 2-3 year crop rotation with non-crucifer crops."],
      hi: ["सभी संक्रमित पौधों को तुरंत हटाकर नष्ट करें।", "प्रमाणित रोग-मुक्त बीज का उपयोग करें।", "कॉपर हाइड्रॉक्साइड का छिड़काव करें।", "2-3 साल का फसल चक्र अपनाएं।"],
    },
  },
  Cabbage___healthy: {
    displayName: "Cabbage - Healthy",
    displayNameHi: "पत्तागोभी - स्वस्थ",
    severity: "none",
    description: "No disease detected. The cabbage plant appears healthy.",
    descriptionHi: "कोई रोग नहीं पाया गया। पत्तागोभी स्वस्थ है।",
    remedies: {
      en: ["Continue regular monitoring.", "Maintain proper spacing for air circulation."],
      hi: ["नियमित निगरानी जारी रखें।", "हवा के प्रवाह के लिए उचित दूरी बनाए रखें।"],
    },
  },

  // ── Cauliflower diseases ───────────────────────────────────────
  Cauliflower___Soft_rot: {
    displayName: "Cauliflower Soft Rot",
    displayNameHi: "फूलगोभी - नरम सड़न",
    severity: "critical",
    description: "Caused by Erwinia carotovora. Water-soaked lesions that become soft and mushy with foul smell.",
    descriptionHi: "एर्विनिया बैक्टीरिया के कारण पानी जैसे धब्बे जो नरम और बदबूदार हो जाते हैं।",
    remedies: {
      en: ["Remove infected plants immediately to prevent spread.", "Avoid waterlogging and improve drainage.", "Apply Streptocycline @ 200ppm.", "Do not plant in same field for 2 seasons."],
      hi: ["संक्रमित पौधों को तुरंत हटाएं।", "जलभराव से बचें और जल निकासी में सुधार करें।", "स्ट्रेप्टोसाइक्लिन @ 200ppm का छिड़काव करें।", "2 मौसम तक एक ही खेत में न लगाएं।"],
    },
  },
  Cauliflower___healthy: {
    displayName: "Cauliflower - Healthy",
    displayNameHi: "फूलगोभी - स्वस्थ",
    severity: "none",
    description: "No disease detected. The cauliflower plant appears healthy.",
    descriptionHi: "कोई रोग नहीं पाया गया। फूलगोभी स्वस्थ है।",
    remedies: {
      en: ["Continue regular monitoring.", "Ensure good drainage."],
      hi: ["नियमित निगरानी जारी रखें।", "अच्छी जल निकासी सुनिश्चित करें।"],
    },
  },

  // ── Brinjal diseases ──────────────────────────────────────────
  Brinjal___Phomopsis_blight: {
    displayName: "Brinjal Phomopsis Blight",
    displayNameHi: "बैंगन - फोमोप्सिस झुलसा",
    severity: "high",
    description: "Caused by Phomopsis vexans. Circular brown spots on leaves and fruit rot.",
    descriptionHi: "फोमोप्सिस वेक्सन्स फफूंद से पत्तियों पर गोल भूरे धब्बे और फल सड़न।",
    remedies: {
      en: ["Apply Carbendazim 50% WP @ 1g/L.", "Remove infected fruits immediately.", "Use disease-free seedlings.", "Practice crop rotation with non-solanaceous crops."],
      hi: ["कार्बेंडाजिम 50% WP @ 1g/L का छिड़काव करें।", "संक्रमित फलों को तुरंत हटाएं।", "रोग-मुक्त पौध का उपयोग करें।", "गैर-सोलेनेसी फसलों के साथ फसल चक्र अपनाएं।"],
    },
  },
  Brinjal___healthy: {
    displayName: "Brinjal - Healthy",
    displayNameHi: "बैंगन - स्वस्थ",
    severity: "none",
    description: "No disease detected. The brinjal plant appears healthy.",
    descriptionHi: "कोई रोग नहीं पाया गया। बैंगन का पौधा स्वस्थ है।",
    remedies: {
      en: ["Continue regular monitoring.", "Maintain proper nutrition."],
      hi: ["नियमित निगरानी जारी रखें।", "उचित पोषण बनाए रखें।"],
    },
  },

  // ── Corn diseases ─────────────────────────────────────────────
  Corn___Common_rust: {
    displayName: "Corn Common Rust",
    displayNameHi: "मक्का - सामान्य गेरुई",
    severity: "medium",
    description: "Caused by Puccinia sorghi. Small reddish-brown pustules on both leaf surfaces.",
    descriptionHi: "पुक्सीनिया सोरघी फफूंद से पत्तियों पर छोटे लाल-भूरे दाने।",
    remedies: {
      en: ["Plant resistant hybrid varieties.", "Apply Propiconazole 25% EC @ 1ml/L.", "Remove heavily infected leaves.", "Avoid late planting."],
      hi: ["प्रतिरोधी संकर किस्में लगाएं।", "प्रोपिकोनाज़ोल 25% EC @ 1ml/L का छिड़काव करें।", "अधिक संक्रमित पत्तियां हटाएं।", "देर से बुआई से बचें।"],
    },
  },
  Corn___Gray_leaf_spot: {
    displayName: "Corn Gray Leaf Spot",
    displayNameHi: "मक्का - भूरे पत्ती धब्बा",
    severity: "high",
    description: "Caused by Cercospora zeae-maydis. Rectangular gray-tan lesions between leaf veins.",
    descriptionHi: "सर्कोस्पोरा फफूंद से पत्ती की नसों के बीच आयताकार भूरे धब्बे।",
    remedies: {
      en: ["Use resistant varieties.", "Apply Azoxystrobin fungicide.", "Rotate with non-host crops.", "Tillage to bury crop residue."],
      hi: ["प्रतिरोधी किस्में उगाएं।", "एज़ोक्सीस्ट्रोबिन फफूंदनाशक का उपयोग करें।", "गैर-मेजबान फसलों के साथ फसल चक्र करें।", "फसल अवशेषों को जोतकर दबाएं।"],
    },
  },
  Corn___Northern_Leaf_Blight: {
    displayName: "Corn Northern Leaf Blight",
    displayNameHi: "मक्का - उत्तरी पत्ती झुलसा",
    severity: "high",
    description: "Caused by Exserohilum turcicum. Long, cigar-shaped gray-green lesions on leaves.",
    descriptionHi: "एक्सेरोहिलम फफूंद से पत्तियों पर लंबे सिगार जैसे धब्बे।",
    remedies: {
      en: ["Plant tolerant hybrids.", "Apply foliar fungicides at tasseling.", "Remove crop debris.", "Ensure adequate plant spacing."],
      hi: ["सहनशील संकर लगाएं।", "फूल आने पर पर्णीय फफूंदनाशक छिड़कें।", "फसल मलबा हटाएं।", "पर्याप्त पौधों की दूरी सुनिश्चित करें।"],
    },
  },
  Corn___healthy: {
    displayName: "Corn - Healthy",
    displayNameHi: "मक्का - स्वस्थ",
    severity: "none",
    description: "No disease detected. The corn plant appears healthy.",
    descriptionHi: "कोई रोग नहीं पाया गया। मक्का का पौधा स्वस्थ है।",
    remedies: {
      en: ["Continue regular monitoring.", "Maintain balanced nutrition."],
      hi: ["नियमित निगरानी जारी रखें।", "संतुलित पोषण बनाए रखें।"],
    },
  },

  // ── Apple diseases ────────────────────────────────────────────
  Apple___Apple_scab: {
    displayName: "Apple Scab",
    displayNameHi: "सेब - स्कैब (पपड़ी)",
    severity: "high",
    description: "Caused by Venturia inaequalis. Olive-green to black velvety spots on leaves and fruits.",
    descriptionHi: "वेन्चुरिया फफूंद से पत्तियों और फलों पर जैतूनी-हरे से काले मखमली धब्बे।",
    remedies: {
      en: ["Apply Captan 50% WP @ 2g/L before bloom.", "Prune dense canopy for air circulation.", "Rake and destroy fallen infected leaves.", "Use resistant apple varieties."],
      hi: ["फूल आने से पहले कैप्टान 50% WP @ 2g/L छिड़कें।", "हवा के लिए घनी शाखाओं की छंटाई करें।", "गिरी संक्रमित पत्तियां इकट्ठी कर नष्ट करें।", "प्रतिरोधी सेब की किस्में उगाएं।"],
    },
  },
  Apple___Black_rot: {
    displayName: "Apple Black Rot",
    displayNameHi: "सेब - काली सड़न",
    severity: "high",
    description: "Caused by Botryosphaeria obtusa. Brown rot on fruits with concentric rings, leaf spots.",
    descriptionHi: "बोट्रीओस्फेरिया फफूंद से फलों पर गोल छल्लों वाली भूरी सड़न।",
    remedies: {
      en: ["Remove mummified fruits and dead wood.", "Apply fungicide during petal fall.", "Prune cankers from branches.", "Maintain tree vigor with proper nutrition."],
      hi: ["सूखे फल और मृत लकड़ी हटाएं।", "पंखुड़ी गिरने पर फफूंदनाशक लगाएं।", "शाखाओं से कैंकर छांटें।", "उचित पोषण से पेड़ की शक्ति बनाए रखें।"],
    },
  },
  Apple___Cedar_apple_rust: {
    displayName: "Apple Cedar Rust",
    displayNameHi: "सेब - सीडर रस्ट (गेरुई)",
    severity: "medium",
    description: "Caused by Gymnosporangium juniperi-virginianae. Bright orange-yellow spots on leaves.",
    descriptionHi: "जिम्नोस्पोरेंजियम फफूंद से पत्तियों पर चमकीले नारंगी-पीले धब्बे।",
    remedies: {
      en: ["Remove nearby juniper/cedar trees if possible.", "Apply Myclobutanil fungicide.", "Plant resistant varieties.", "Monitor in spring when spores spread."],
      hi: ["यदि संभव हो तो पास के जुनिपर/सीडर पेड़ हटाएं।", "माइक्लोब्यूटानिल फफूंदनाशक लगाएं।", "प्रतिरोधी किस्में लगाएं।", "वसंत में बीजाणु फैलने पर निगरानी करें।"],
    },
  },
  Apple___healthy: {
    displayName: "Apple - Healthy",
    displayNameHi: "सेब - स्वस्थ",
    severity: "none",
    description: "No disease detected. The apple tree appears healthy.",
    descriptionHi: "कोई रोग नहीं पाया गया। सेब का पेड़ स्वस्थ है।",
    remedies: {
      en: ["Continue regular monitoring.", "Maintain proper pruning schedule."],
      hi: ["नियमित निगरानी जारी रखें।", "उचित छंटाई कार्यक्रम बनाए रखें।"],
    },
  },

  // ── Grape diseases ────────────────────────────────────────────
  Grape___Black_rot: {
    displayName: "Grape Black Rot",
    displayNameHi: "अंगूर - काली सड़न",
    severity: "critical",
    description: "Caused by Guignardia bidwellii. Brown circular spots on leaves, fruits shrivel and turn black.",
    descriptionHi: "गिग्नार्डिया फफूंद से पत्तियों पर भूरे गोल धब्बे, फल सिकुड़कर काले हो जाते हैं।",
    remedies: {
      en: ["Remove mummified berries and infected canes.", "Apply Mancozeb pre-bloom and post-bloom.", "Ensure good canopy management.", "Use resistant grape varieties."],
      hi: ["सूखे अंगूर और संक्रमित टहनियां हटाएं।", "फूल से पहले और बाद में मैंकोज़ेब छिड़कें।", "अच्छी छत्र प्रबंधन सुनिश्चित करें।", "प्रतिरोधी अंगूर की किस्में उगाएं।"],
    },
  },
  Grape___Esca: {
    displayName: "Grape Esca (Black Measles)",
    displayNameHi: "अंगूर - एस्का (काला खसरा)",
    severity: "high",
    description: "Complex fungal disease causing tiger-striped leaf patterns and berry spotting.",
    descriptionHi: "जटिल फफूंद रोग जिससे पत्तियों पर बाघ-धारीदार पैटर्न और फलों पर धब्बे।",
    remedies: {
      en: ["Prune and burn infected wood.", "Apply wound protectants after pruning.", "Avoid heavy pruning.", "Maintain vine vigor."],
      hi: ["संक्रमित लकड़ी काटकर जला दें।", "छंटाई के बाद घाव रक्षक लगाएं।", "अधिक छंटाई से बचें।", "बेल की शक्ति बनाए रखें।"],
    },
  },
  Grape___Leaf_blight: {
    displayName: "Grape Leaf Blight",
    displayNameHi: "अंगूर - पत्ती झुलसा",
    severity: "medium",
    description: "Caused by Pseudocercospora vitis. Brown spots with dark margins on lower leaves.",
    descriptionHi: "स्यूडोसर्कोस्पोरा फफूंद से निचली पत्तियों पर काले किनारों वाले भूरे धब्बे।",
    remedies: {
      en: ["Remove infected lower leaves.", "Apply Bordeaux mixture.", "Improve air circulation in vineyard.", "Avoid excessive nitrogen."],
      hi: ["संक्रमित निचली पत्तियां हटाएं।", "बोर्डो मिश्रण का छिड़काव करें।", "बागान में हवा का प्रवाह बढ़ाएं।", "अधिक नाइट्रोजन से बचें।"],
    },
  },
  Grape___healthy: {
    displayName: "Grape - Healthy",
    displayNameHi: "अंगूर - स्वस्थ",
    severity: "none",
    description: "No disease detected. The grape vine appears healthy.",
    descriptionHi: "कोई रोग नहीं पाया गया। अंगूर की बेल स्वस्थ है।",
    remedies: {
      en: ["Continue regular monitoring.", "Maintain proper canopy management."],
      hi: ["नियमित निगरानी जारी रखें।", "उचित छत्र प्रबंधन बनाए रखें।"],
    },
  },

  // ── Strawberry diseases ───────────────────────────────────────
  Strawberry___Leaf_scorch: {
    displayName: "Strawberry Leaf Scorch",
    displayNameHi: "स्ट्रॉबेरी - पत्ती झुलसा",
    severity: "medium",
    description: "Caused by Diplocarpon earlianum. Irregular purple-red spots that merge, causing leaf scorch.",
    descriptionHi: "डिप्लोकार्पोन फफूंद से अनियमित बैंगनी-लाल धब्बे जो मिलकर पत्ती जला देते हैं।",
    remedies: {
      en: ["Remove old infected leaves after harvest.", "Apply Captan or Thiram fungicide.", "Ensure adequate plant spacing.", "Use drip irrigation to keep foliage dry."],
      hi: ["कटाई के बाद पुरानी संक्रमित पत्तियां हटाएं।", "कैप्टान या थिरम फफूंदनाशक लगाएं।", "पर्याप्त पौधों की दूरी सुनिश्चित करें।", "पत्तियां सूखी रखने के लिए ड्रिप सिंचाई करें।"],
    },
  },
  Strawberry___healthy: {
    displayName: "Strawberry - Healthy",
    displayNameHi: "स्ट्रॉबेरी - स्वस्थ",
    severity: "none",
    description: "No disease detected. The strawberry plant appears healthy.",
    descriptionHi: "कोई रोग नहीं पाया गया। स्ट्रॉबेरी का पौधा स्वस्थ है।",
    remedies: {
      en: ["Continue regular monitoring.", "Maintain proper mulching."],
      hi: ["नियमित निगरानी जारी रखें।", "उचित मल्चिंग बनाए रखें।"],
    },
  },
};

export function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case "none":
      return "text-emerald-500";
    case "low":
      return "text-green-500";
    case "medium":
      return "text-yellow-500";
    case "high":
      return "text-orange-500";
    case "critical":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

export function getSeverityBg(severity: Severity): string {
  switch (severity) {
    case "none":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
    case "low":
      return "bg-green-500/10 text-green-600 border-green-500/30";
    case "medium":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
    case "high":
      return "bg-orange-500/10 text-orange-600 border-orange-500/30";
    case "critical":
      return "bg-red-500/10 text-red-600 border-red-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export interface PredictionResult {
  className: string;
  displayName: string;
  confidence: number;
  info: DiseaseInfo;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  cropType: CropType;
  imageDataUrl: string;
  predictions: PredictionResult[];
}

export const CROP_NAME_HINDI: Record<CropType, string> = {
  potato: "आलू",
  tomato: "टमाटर",
  pepper_bell: "शिमला मिर्च",
  onion: "प्याज",
  carrot: "गाजर",
  cabbage: "पत्तागोभी",
  cauliflower: "फूलगोभी",
  brinjal: "बैंगन",
  corn: "मक्का",
  apple: "सेब",
  grape: "अंगूर",
  strawberry: "स्ट्रॉबेरी",
};

export const CROP_NAME_ENGLISH: Record<CropType, string> = {
  potato: "Potato",
  tomato: "Tomato",
  pepper_bell: "Pepper Bell",
  onion: "Onion",
  carrot: "Carrot",
  cabbage: "Cabbage",
  cauliflower: "Cauliflower",
  brinjal: "Brinjal",
  corn: "Corn",
  apple: "Apple",
  grape: "Grape",
  strawberry: "Strawberry",
};

export const CROP_EMOJI: Record<CropType, string> = {
  potato: "🥔",
  tomato: "🍅",
  pepper_bell: "🫑",
  onion: "🧅",
  carrot: "🥕",
  cabbage: "🥬",
  cauliflower: "🥦",
  brinjal: "🍆",
  corn: "🌽",
  apple: "🍎",
  grape: "🍇",
  strawberry: "🍓",
};
