import random
import json

DISEASES_DATABASE = [
    {
        "disease_name": "Paddy Leaf Blast",
        "confidence": 88.4,
        "description_json": {
            "English": "A destructive fungal disease caused by Magnaporthe oryzae. It produces spindle-shaped leaf lesions with greyish centers, heavily reducing photosynthesis and yield.",
            "Kannada": "ಮ್ಯಾಗ್ನಾಪೋರ್ತೆ ಒರೈಜೆಯಿಂದ ಉಂಟಾಗುವ ವಿನಾಶಕಾರಿ ಶಿಲೀಂಧ್ರ ರೋಗ. ಇದು ಬೂದು ಬಣ್ಣದ ಮಧ್ಯಭಾಗದೊಂದಿಗೆ ದೋಣಿ ಆಕಾರದ ಎಲೆ ಗಾಯಗಳನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ, ಇದು ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಮತ್ತು ಇಳುವರಿಯನ್ನು ಗಣನೀಯವಾಗಿ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.",
            "Hindi": "मैग्नापोर्टे ओरीजाए के कारण होने वाला एक विनाशकारी कवक रोग। यह धूसर केंद्रों के साथ धुरी के आकार के पत्तों के घाव पैदा करता है, जिससे प्रकाश संश्लेषण और उपज में भारी कमी आती है।"
        },
        "treatment_json": {
            "English": "Solution: Spray Tricyclazole at 0.6g/L or Carbendazim at 1g/L of water. Avoid flooding and keep the field clean.",
            "Kannada": "ಪರಿಹಾರ: ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 0.6 ಗ್ರಾಂ ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ ಅಥವಾ 1 ಗ್ರಾಂ ಕಾರ್ಬೆಂಡಾಜಿಮ್ ಸಿಂಪಡಿಸಿ. ಹೊಲದಲ್ಲಿ ಹೆಚ್ಚುವರಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.",
            "Hindi": "समाधान: पानी में 0.6 ग्राम/लीटर ट्राइसाइक्लाजोल या 1 ग्राम/लीटर कार्बेन्डाजिम का छिड़काव करें। जलभराव से बचें और खेत को साफ रखें।"
        },
        "recovery_fertilizer_json": {
            "English": "Recovery Fertilizer: Apply Muriate of Potash (MOP) at 15-20 kg/acre to strengthen cell walls and increase resistance. Temporarily hold back Urea (Nitrogen) as high nitrogen increases disease severity.",
            "Kannada": "ಚೇತರಿಕೆ ರಸಗೊಬ್ಬರ: ಜೀವಕೋಶದ ಗೋಡೆಗಳನ್ನು ಬಲಪಡಿಸಲು ಮತ್ತು ರೋಗನಿರೋಧಕ ಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸಲು ಎಕರೆಗೆ 15-20 ಕೆಜಿ ಮ್ಯೂರಿಯೇಟ್ ಆಫ್ ಪೊಟ್ಯಾಶ್ (MOP) ಬಳಸಿ. ರೋಗ ತೀವ್ರಗೊಳ್ಳುವುದರಿಂದ ಯೂರಿಯಾವನ್ನು ಸದ್ಯಕ್ಕೆ ಬಳಸಬೇಡಿ.",
            "Hindi": "सुधार उर्वरक: कोशिका की दीवारों को मजबूत करने और प्रतिरोध बढ़ाने के लिए 15-20 किलोग्राम/एकड़ म्यूरिएट ऑफ पोटाश (MOP) डालें। यूरिया (नाइट्रोजन) को अस्थायी रूप से रोकें क्योंकि अधिक नाइट्रोजन से बीमारी बढ़ सकती है।"
        },
        "prevention": "Use disease-free seeds, treat seeds with Pseudomonas fluorescens, and avoid excessive nitrogen application."
    },
    {
        "disease_name": "Cotton Leaf Spot (Alternaria)",
        "confidence": 92.1,
        "description_json": {
            "English": "Fungal leaf spot caused by Alternaria macrospora. Characterized by small, circular brown spots with concentric rings on leaves, causing premature defoliation.",
            "Kannada": "ಆಲ್ಟರ್ನೇರಿಯಾ ಮ್ಯಾಕ್ರೋಸ್ಪೊರಾದಿಂದ ಉಂಟಾಗುವ ಶಿಲೀಂಧ್ರ ಎಲೆ ಕಲೆ ರೋಗ. ಇದು ಎಲೆಗಳ ಮೇಲೆ ಏಕಕೇಂದ್ರಿತ ವಲಯಗಳೊಂದಿಗೆ ಸಣ್ಣ, ವೃತ್ತಾಕಾರದ ಕಂದು ಕಲೆಗಳಿಂದ ಗುರುತಿಸಲ್ಪಡುತ್ತದೆ, ಇದು ಎಲೆಗಳು ಬೇಗನೆ ಉದುರಲು ಕಾರಣವಾಗುತ್ತದೆ.",
            "Hindi": "अल्टरनेरिया मैक्रोस्पोरा के कारण होने वाला कवक जनित पत्ता धब्बा रोग। पत्तियों पर संकेंद्रित छल्लों के साथ छोटे, गोलाकार भूरे रंग के धब्बे इसकी विशेषता हैं, जिससे पत्तियाँ समय से पहले गिर जाती हैं।"
        },
        "treatment_json": {
            "English": "Solution: Spray Copper Oxychloride at 2.5g/L or Mancozeb at 2g/L. Remove and destroy infected crop residues.",
            "Kannada": "ಪರಿಹಾರ: ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 2.5 ಗ್ರಾಂ ಕಾಪರ್ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ ಅಥವಾ 2 ಗ್ರಾಂ ಮ್ಯಾಂಕೊಜೆಬ್ ಸಿಂಪಡಿಸಿ. ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ ನಾಶಪಡಿಸಿ.",
            "Hindi": "समाधान: 2.5 ग्राम/लीटर कॉपर ऑक्सीक्लोराइड या 2 ग्राम/लीटर मैंकोजेब का छिड़काव करें। संक्रमित फसल अवशेषों को हटाकर नष्ट कर दें।"
        },
        "recovery_fertilizer_json": {
            "English": "Recovery Fertilizer: Apply a foliar spray of NPK 19-19-19 (0.5%) along with Zinc Sulphate (0.2%) to quicken foliage regeneration and repair damaged tissues.",
            "Kannada": "ಚೇತರಿಕೆ ರಸಗೊಬ್ಬರ: ಹೊಸ ಚಿಗುರುಗಳು ಬರಲು ಮತ್ತು ಹಾನಿಗೊಳಗಾದ ಅಂಗಾಂಶಗಳನ್ನು ಸರಿಪಡಿಸಲು ಜಿಂಕ್ ಸಲ್ಫೇಟ್ (0.2%) ಜೊತೆಗೆ NPK 19-19-19 (0.5%) ಮಿಶ್ರಣವನ್ನು ಎಲೆಗಳ ಮೇಲೆ ಸಿಂಪಡಿಸಿ.",
            "Hindi": "सुधार उर्वरक: नए पत्तों के विकास और क्षतिग्रस्त ऊतकों की मरम्मत के लिए जिंक सल्फेट (0.2%) के साथ एनपीके 19-19-19 (0.5%) का छिड़काव करें।"
        },
        "prevention": "Maintain clean farming practices, ensure proper spacing for aeration, and carry out crop rotation."
    },
    {
        "disease_name": "Tikka Leaf Spot (Groundnut)",
        "confidence": 85.6,
        "description_json": {
            "English": "A common fungal pathogen (Cercospora arachidicola) causing dark circular spots on leaves, leading to reduced photosynthesis and severe pod weight loss.",
            "Kannada": "ನೆಲಗಡಲೆಯಲ್ಲಿ ಕಂಡುಬರುವ ಸರ್ಕೋಸ್ಪೊರಾ ಅರಾಚಿಡಿಕೋಲಾ ಶಿಲೀಂಧ್ರ ರೋಗ. ಇದು ಎಲೆಗಳ ಮೇಲೆ ಕಪ್ಪು ವೃತ್ತಾಕಾರದ ಕಲೆಗಳನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ, ಇದು ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ ಮತ್ತು ಕಾಯಿಗಳ ತೂಕವನ್ನು ಇಳಿಸುತ್ತದೆ.",
            "Hindi": "मूंगफली में होने वाला सर्कोस्पोरा अराकिडिकोला कवक रोग। पत्तियों पर काले गोलाकार धब्बे बन जाते हैं, जिससे प्रकाश संश्लेषण कम हो जाता है और फलियों का वजन कम हो जाता है।"
        },
        "treatment_json": {
            "English": "Solution: Spray Carbendazim (0.1%) or Chlorothalonil (0.2%) at first signs of spot development.",
            "Kannada": "ಪರಿಹಾರ: ಎಲೆಗಳ ಮೇಲೆ ಕಲೆ ಕಾಣಿಸಿಕೊಂಡ ತಕ್ಷಣ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 1 ಗ್ರಾಂ ಕಾರ್ಬೆಂಡಾಜಿಮ್ ಅಥವಾ 2 ಗ್ರಾಂ ಕ್ಲೋರೋಥಲೋನಿಲ್ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.",
            "Hindi": "समाधान: धब्बे दिखाई देने के शुरुआती लक्षणों पर कार्बेन्डाजिम (0.1%) या क्लोरोथालोनिल (0.2%) का छिड़काव करें।"
        },
        "recovery_fertilizer_json": {
            "English": "Recovery Fertilizer: Apply Gypsum at 150-200 kg/acre to replenish Calcium and Sulphur. This reinforces pod shell strength and stimulates root recovery.",
            "Kannada": "ಚೇತರಿಕೆ ರಸಗೊಬ್ಬರ: ಕ್ಯಾಲ್ಸಿಯಂ ಮತ್ತು ಗಂಧಕದ ಪೂರೈಕೆಗಾಗಿ ಎಕರೆಗೆ 150-200 ಕೆಜಿ ಜಿಪ್ಸಮ್ ಬಳಸಿ. ಇದು ನೆಲಗಡಲೆ ಕಾಯಿ ಗಟ್ಟಿಯಾಗಲು ಮತ್ತು ಬೇರುಗಳ ಚೇತರಿಕೆಗೆ ಸಹಕಾರಿಯಾಗಿದೆ.",
            "Hindi": "सुधार उर्वरक: कैल्शियम और सल्फर की कमी को पूरा करने के लिए 150-200 किलोग्राम/एकड़ जिप्सम डालें। यह मूंगफली के छिलके को मजबूत बनाता है और जड़ों के विकास को बढ़ावा देता है।"
        },
        "prevention": "Practice crop rotation with cereals, treat seeds with Thiram, and maintain good field sanitation."
    },
    {
        "disease_name": "Coffee Rust",
        "confidence": 89.3,
        "description_json": {
            "English": "A devastating fungal disease (Hemileia vastatrix) causing yellow-orange powdery spots on leaf undersides, leading to defoliation and coffee berry drop.",
            "Kannada": "ಕಾಫಿ ಗಿಡಗಳಲ್ಲಿ ಹೆಮಿಲೀಯಾ ವಾಸ್ಟಾಟ್ರಿಕ್ಸ್‌ನಿಂದ ಉಂಟಾಗುವ ಮಾರಕ ರೋಗ. ಎಲೆಯ ಕೆಳಭಾಗದಲ್ಲಿ ಹಳದಿ-ಕಿತ್ತಳೆ ಬಣ್ಣದ ಪುಡಿ ಕಲೆಗಳು ಕಾಣಿಸಿಕೊಂಡು, ಎಲೆಗಳು ಮತ್ತು ಕಾಫಿ ಹಣ್ಣುಗಳು ಉದುರಲು ಕಾರಣವಾಗುತ್ತದೆ.",
            "Hindi": "कॉफी में हेमिलीया वास्टेट्रिक्स से होने वाला घातक कवक रोग। पत्तियों के नीचे पीले-नारंगी रंग के चूर्ण जैसे धब्बे दिखाई देते हैं, जिससे पत्तियाँ और कॉफी के फल गिर जाते हैं।"
        },
        "treatment_json": {
            "English": "Solution: Spray 0.5% Bordeaux mixture or Propiconazole at 1ml/L of water. Prune overlapping branches.",
            "Kannada": "ಪರಿಹಾರ: 0.5% ಬೋರ್ಡೋ ಮಿಶ್ರಣ ಅಥವಾ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 1 ಮಿಲಿ ಪ್ರೊಪಿಕೊನಾಜೋಲ್ ಸಿಂಪಡಿಸಿ. ಗಾಳಿ ಆಡಲು ಅನುವಾಗುವಂತೆ ಹೆಚ್ಚುವರಿ ಕೊಂಬೆಗಳನ್ನು ಕತ್ತರಿಸಿ.",
            "Hindi": "समाधान: 0.5% बोर्डो मिश्रण या 1 मिली/लीटर प्रोपिकोनाज़ोल का छिड़काव करें। धूप और हवा के लिए घनी शाखाओं की छंटाई करें।"
        },
        "recovery_fertilizer_json": {
            "English": "Recovery Fertilizer: Apply a soil application of Magnesium Sulphate at 10 kg/acre and spray NPK 17-17-17 to resolve pathogen-induced leaf chlorosis.",
            "Kannada": "ಚೇತರಿಕೆ ರಸಗೊಬ್ಬರ: ಎಲೆ ಹಳದಿ ರೋಗ ನಿವಾರಿಸಲು ಎಕರೆಗೆ 10 ಕೆಜಿ ಮೆಗ್ನೀಸಿಯಮ್ ಸಲ್ಫೇಟ್ ಅನ್ನು ಮಣ್ಣಿಗೆ ಸೇರಿಸಿ ಮತ್ತು ಸಮತೋಲಿತ NPK 17-17-17 ಸಿಂಪಡಿಸಿ.",
            "Hindi": "सुधार उर्वरक: पत्तियों के पीलेपन को दूर करने के लिए 10 किलोग्राम/एकड़ मैग्नीशियम सल्फेट का मिट्टी में प्रयोग करें और संतुलित एनपीके 17-17-17 का छिड़काव करें।"
        },
        "prevention": "Plant resistant cultivars, manage shade trees appropriately, and monitor crops regularly during monsoon season."
    },
    {
        "disease_name": "Healthy Foliage",
        "confidence": 98.7,
        "description_json": {
            "English": "No pathogenic symptoms detected. The leaf chlorophyll is optimal and the plant cellular structure is healthy.",
            "Kannada": "ಯಾವುದೇ ರೋಗದ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಎಲೆಯಲ್ಲಿ ಪತ್ರಹರಿತ್ತು ಉತ್ತಮವಾಗಿದೆ ಮತ್ತು ಸಸ್ಯದ ಜೀವಕೋಶದ ರಚನೆಯು ಆರೋಗ್ಯಕರವಾಗಿದೆ.",
            "Hindi": "कोई रोगजनक लक्षण नहीं पाए गए। पत्तियों में क्लोरोफिल इष्टतम है और पौधे की सेलुलर संरचना स्वस्थ है।"
        },
        "treatment_json": {
            "English": "Solution: Maintain regular irrigation schedule and standard organic compost nutrition.",
            "Kannada": "ಪರಿಹಾರ: ನಿಯಮಿತವಾಗಿ ನೀರು ಹಾಯಿಸಿ ಮತ್ತು ನಿಗದಿತ ಸಾವಯವ ಗೊಬ್ಬರವನ್ನು ನೀಡುವುದನ್ನು ಮುಂದುವರಿಸಿ.",
            "Hindi": "समाधान: नियमित सिंचाई कार्यक्रम बनाए रखें और सामान्य जैविक खाद का प्रयोग जारी रखें।"
        },
        "recovery_fertilizer_json": {
            "English": "Recovery Fertilizer: No emergency fertilizer needed. Maintain standard seasonal dosage (NPK) according to the fertilizer planner.",
            "Kannada": "ಚೇತರಿಕೆ ರಸಗೊಬ್ಬರ: ಯಾವುದೇ ತುರ್ತು ರಸಗೊಬ್ಬರ ಅಗತ್ಯವಿಲ್ಲ. ನಮ್ಮ ರಸಗೊಬ್ಬರ ಯೋಜಕದಲ್ಲಿ ಸೂಚಿಸಿದಂತೆ ಸಾಮಾನ್ಯ ರಸಗೊಬ್ಬರ ನೀಡಿ.",
            "Hindi": "सुधार उर्वरक: किसी आपातकालीन उर्वरक की आवश्यकता नहीं है। सामान्य मौसमी खुराक (एनपीके) जारी रखें।"
        },
        "prevention": "Continue standard crop protection protocols and execute weeding schedule."
    }
]

def predict_disease(image_path):
    """
    Simulates disease detection.
    Yields scientific results in multiple languages (English, Kannada, Hindi) along with recovery fertilizers.
    """
    # Pick a random diagnosis for testing
    report = random.choice(DISEASES_DATABASE)
    
    return {
        "disease_name": report["disease_name"],
        "confidence": report["confidence"],
        "description_json": json.dumps(report["description_json"]),
        "treatment_json": json.dumps(report["treatment_json"]),
        "recovery_fertilizer_json": json.dumps(report["recovery_fertilizer_json"]),
        "prevention": report["prevention"]
    }
