export type Severity = "none" | "low" | "medium" | "high" | "critical";

export interface DiseaseInfo {
  displayName: string;
  severity: Severity;
  description: string;
  remedies: {
    en: string[];
    hi: string[];
  };
}

export type CropType = "potato" | "tomato" | "pepper_bell";

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

export const DISEASE_DB: Record<string, DiseaseInfo> = {
  // ── Potato diseases ───────────────────────────────────────────────
  Potato___Early_blight: {
    displayName: "Potato Early Blight",
    severity: "medium",
    description:
      "Caused by the fungus Alternaria solani. Dark concentric-ring lesions appear on older leaves first, spreading upward and reducing yield.",
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
    severity: "critical",
    description:
      "Caused by the oomycete Phytophthora infestans. Water-soaked lesions with white mold appear on leaves, stems, and tubers. Can destroy an entire crop within days.",
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
    severity: "none",
    description:
      "The leaf appears healthy with no visible signs of disease. Continue standard crop management practices.",
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
    severity: "high",
    description:
      "Caused by Xanthomonas bacteria. Small, water-soaked spots appear on leaves, becoming brown with yellow halos. Fruit may develop raised, scabby lesions.",
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
    severity: "medium",
    description:
      "Caused by Alternaria solani. Brown-black spots with concentric rings form on lower leaves and move upward. Reduces fruit yield significantly.",
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
    severity: "critical",
    description:
      "Caused by Phytophthora infestans. Large, greasy-looking gray-green patches appear on leaves, turning dark brown. White mold may form on undersides.",
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
    severity: "medium",
    description:
      "Caused by the fungus Passalora fulva. Yellow patches form on upper leaf surfaces while olive-green velvety mold appears on undersides.",
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
    severity: "medium",
    description:
      "Caused by the fungus Septoria lycopersici. Small circular spots with gray centers and dark borders appear on lower leaves first.",
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
    severity: "high",
    description:
      "Tiny spider mites (Tetranychus urticae) feed on leaf undersides, causing yellow stippling, bronzing, and fine webbing. Severe infestations cause leaf drop.",
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
    severity: "medium",
    description:
      "Caused by the fungus Corynespora cassiicola. Brown spots with concentric rings (target-like pattern) appear on leaves, stems, and fruit.",
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
    severity: "critical",
    description:
      "A devastating viral disease transmitted by whiteflies (Bemisia tabaci). Leaves curl upward, turn yellow, and plants become stunted. No cure exists once infected.",
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
    severity: "high",
    description:
      "A highly contagious virus causing mottled yellow-green patterns on leaves, stunted growth, and reduced fruit quality. Spreads through touch and contaminated tools.",
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
    severity: "none",
    description:
      "The leaf appears healthy with no visible signs of disease or pest damage. Continue standard care practices.",
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
    severity: "high",
    description:
      "Caused by Xanthomonas bacteria. Small, dark, water-soaked spots appear on leaves and fruit, causing severe leaf drop and yield loss.",
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
    severity: "none",
    description:
      "The pepper bell leaf is vibrant and healthy with no visible signs of bacterial spot or fungal infection.",
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
