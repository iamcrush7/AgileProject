import { NextResponse } from "next/server";
import { Translate } from "@google-cloud/translate/build/src/v2";

// Initialize external translation API
const translate = new Translate();

// Pretranslated fast cache exactly as instructed
const PRETRANSLATED_CACHE: Record<string, Record<string, string>> = {
    "I am a virtual assistant for NE-Connect. I can help you find professionals, book a service, or become a provider.": {
        hi: "मैं NE-Connect का वर्चुअल असिस्टेंट हूँ। मैं आपको पेशेवर खोजने, सेवा बुक करने या सेवा प्रदाता बनने में मदद कर सकता हूँ।",
        as: "মই NE-Connect ৰ ভাৰ্চুৱেল এচিষ্টেণ্ট। মই আপোনাক পেছাদাৰী বিচাৰিবলৈ, চাৰ্ভিচ বুক কৰিবলৈ বা প্ৰদানকাৰী হ'বলৈ সহায় কৰিব পাৰো।",
        lus: "NE-Connect virtual assistant ka ni a. Hnathawktu zawn, service book emaw provider nih theihnan ka pui thei che.",
        "mni-Mtei": "NE-Connect-ki virtual assistant amani. Professionalls puthoknaba, service amabuk touba, nattraga provider ama oinaba mateng pangba ngammi.",
        bn: "আমি NE-Connect এর ভার্চুয়াল অ্যাসিস্ট্যান্ট। আমি আপনাকে পেশাদার খুঁজতে, পরিষেবা বুক করতে বা প্রদানকারী হতে সাহায্য করতে পারি।",
        ne: "म NE-Connect को भर्चुअल सहायक हुँ। म तपाईंलाई पेशेवरहरू फेला पार्न, सेवा बुक गर्न वा प्रदायक बन्न मद्दत गर्न सक्छु।"
    },
    "Sure, I can help you find an electrician. Which city or state are you in?": {
        hi: "ज़रूर, मैं आपको एक इलेक्ट्रीशियन खोजने में मदद कर सकता हूँ। आप किस शहर या राज्य में हैं?",
        as: "নিশ্চয়, মই আপোনাক এজন ইলেকট্ৰিচিয়ান বিচাৰিবলৈ সহায় কৰিব পাৰো। আপুনি কোন চহৰ বা ৰাজ্যত আছে?",
        lus: "Tehreng mai, electrician zawn ka pui thei che. Khawi khua/state ah nge i awm?",
        "mni-Mtei": "Hoi, electrician ama thibanaba mateng pangba ngammi. Nahaak karamba city nattraga state-ta leirige?",
        bn: "নিশ্চয়ই, আমি আপনাকে একজন ইলেকট্রিশিয়ান খুঁজতে সাহায্য করতে পারি। আপনি কোন শহর বা রাজ্যে আছেন?",
        ne: "पक्कै पनि, म तपाईंलाई एक इलेक्ट्रीशियन फेला पार्न मद्दत गर्न सक्छु। तपाईं कुन शहर वा राज्यमा हुनुहुन्छ?"
    },
    "We have great plumbers available. Could you tell me your location?": {
        hi: "हमारे पास बेहतरीन प्लंबर उपलब्ध हैं। क्या आप मुझे अपनी लोकेशन बता सकते हैं?",
        as: "আমাৰ ওচৰত শ্ৰেষ্ঠ প্লাম্বাৰ উপলব্ধ আছে। আপুনি আপোনাৰ অৱস্থানটো ক'ব পাৰিবনে?",
        lus: "Plumber tha tak tak kan nei e. I awmna hmun min hrilh thei em?",
        "mni-Mtei": "Ayamaba plumbers fange. Nahaakki location pibiragera?",
        bn: "আমাদের কাছে দুর্দান্ত প্লাম্বার উপলব্ধ রয়েছে। আপনি কি আপনার অবস্থানটি জানাতে পারবেন?",
        ne: "हामीसँग उत्कृष्ट प्लम्बरहरू उपलब्ध छन्। के तपाईं आफ्नो स्थान बताउन सक्नुहुन्छ?"
    },
    "I'd be happy to help you book a service. What kind of professional are you looking for, and where?": {
        hi: "मुझे आपकी सेवा बुक करने में खुशी होगी। आप किस तरह के पेशेवर की तलाश में हैं, और कहाँ?",
        as: "মই আপোনাক চাৰ্ভিচ বুক কৰাত সহায় কৰিবলৈ পাই সুখী হ'ম। আপুনি কেনেধৰণৰ পেছাদাৰী বিচাৰিছে, আৰু ক'ত?",
        lus: "Service book velah ka pui thei che. Eng ang hna thawk nge i zawn a, khawiah nge?",
        "mni-Mtei": "Service ama book touba mateng pangba nungaijai. Karamba makhalki professionall thibirige, amadi kadaida?",
        bn: "আপনাকে একটি পরিষেবা বুক করতে সাহায্য করতে পেরে আমি আনন্দিত হব। আপনি কী ধরণের পেশাদার খুঁজছেন, এবং কোথায়?",
        ne: "तपाईंलाई सेवा बुक गर्न मद्दत गर्न म खुसी हुनेछु। तपाईं कस्तो प्रकारको पेशेवर खोज्दै हुनुहुन्छ, र कहाँ?"
    },
    "To become a provider, please click the 'Become a Provider' button on our site! It's quick and easy.": {
        hi: "प्रदाता बनने के लिए, कृपया हमारी साइट पर 'Become a Provider' बटन पर क्लिक करें! यह तेज़ और आसान है।",
        as: "প্ৰদানকাৰী হ'বলৈ, অনুগ্ৰহ কৰি আমাৰ চাইটৰ 'Become a Provider' বুটামটোত ক্লিক কৰক! ই দ্ৰুত আৰু সহজ।",
        lus: "Provider nih dawn chuan, kan site-a 'Become a Provider' button ah khan click la! A rang in awlsam lutuk.",
        "mni-Mtei": "Provider oinaba, site-ta leiba 'Become a Provider' button adu thambiyoo! Yamna thuvee amasung laiye.",
        bn: "প্রদানকারী হওয়ার জন্য, দয়া করে আমাদের সাইটের 'Become a Provider' বোতামে ক্লিক করুন! এটি দ্রুত এবং সহজ।",
        ne: "प्रदायक बन्नका लागि, कृपया हाम्रो साइटमा रहेको 'Become a Provider' बटनमा क्लिक गर्नुहोस्! यो छिटो र सजिलो छ।"
    },
    "Great! We have many providers in that region. Let me know the exact service you need.": {
        hi: "बहुत बढ़िया! उस क्षेत्र में हमारे कई प्रदाता हैं। मुझे बताएं कि आपको किस सेवा की आवश्यकता है।",
        as: "বঢ়িয়া! সেই অঞ্চলত আমাৰ বহুতো প্ৰদানকাৰী আছে। আপোনাক কি সঠিক চাৰ্ভিচ লাগে মোক জনাওক।",
        lus: "A tha e! Chu bawr ah chuan provider tam tak kan nei. I service duh tak min hrilh rawh.",
        "mni-Mtei": "Fajei! Region aduda eikhoigi provider kaya amd leire. Nahaakna tabba exact service adu khanghanbiyoo.",
        bn: "দুর্দান্ত! ওই অঞ্চলে আমাদের অনেক প্রদানকারী রয়েছে। আপনার ঠিক কোন পরিষেবা প্রয়োজন তা আমাকে জানান।",
        ne: "उत्कृष्ट! त्यस क्षेत्रमा हाम्रा धेरै प्रदायकहरू छन्। तपाईंलाई कुन सेवा चाहिन्छ मलाई बताउनुहोस्।"
    },
    "Hello! I am NE-Connect AI. How can I assist you today? I understand English and multiple Northeast Indian languages.": {
        hi: "नमस्ते! मैं NE-Connect AI हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ? मैं अंग्रेजी और कई पूर्वोत्तर भारतीय भाषाएं समझता हूँ।",
        as: "নমস্কাৰ! মই NE-Connect AI। মই আপোনাক কেনেকৈ সহায় কৰিব পাৰো? মই ইংৰাজী আৰু উত্তৰ-পূব ভাৰতৰ একাধিক ভাষা বুজি পাওঁ।",
        lus: "Chibai! NE-Connect AI ka ni e. Engtin nge ka puih theih che? Sap tawng leh hmar-chhak tawng tamtak ka hrethiam a ni.",
        "mni-Mtei": "Khroomjari! Eihak NE-Connect AI ni. Eihakna mateng karamna pangba ngamgani? English amasung Northeast India gilon kaya eina khang-i.",
        bn: "নমস্কার! আমি NE-Connect AI। আমি আজ আপনাকে কীভাবে সাহায্য করতে পারি? আমি ইংরেজি এবং উত্তর-পূর্ব ভারতের একাধিক ভাষা বুঝতে পারি।",
        ne: "नमस्ते! म NE-Connect AI हुँ। आज म तपाईलाई कसरी सहयोग गर्न सक्छु? म अंग्रेजी र बहु ​​पूर्वोत्तर भारतीय भाषाहरू बुझ्छु।"
    },
    // Single words / Quick actions
    "Find electrician": {
        hi: "इलेक्ट्रीशियन खोजें",
        as: "ইলেকট্ৰিচিয়ান বিচাৰক",
        lus: "Electrician zawng",
        "mni-Mtei": "Electrician thibiyoo",
        bn: "ইলেকট্রিশিয়ান খুঁজুন",
        ne: "इलेक्ट्रीशियन खोज्नुहोस्"
    },
    "Book plumber": {
        hi: "प्लंबर बुक करें",
        as: "প্লাম্বাৰ বুক কৰক",
        lus: "Plumber book",
        "mni-Mtei": "Plumber book toubiyoo",
        bn: "প্লাম্বার বুক করুন",
        ne: "प्लम्बर बुक गर्नुहोस्"
    },
    "Become a provider": {
        hi: "प्रदाता बनें",
        as: "প্ৰদানকাৰী হওক",
        lus: "Provider ni rawh",
        "mni-Mtei": "Provider oibiyoo",
        bn: "প্রদানকারী হন",
        ne: "प्रदायक बन्नुहोस्"
    },
    "Help": {
        hi: "मदद",
        as: "সহায়",
        lus: "Puihna",
        "mni-Mtei": "Mateng",
        bn: "সাহায্য",
        ne: "मद्दत"
    },
    "Thank you": {
        hi: "धन्यवाद",
        as: "ধন্যবাদ",
        lus: "Ka lawm e",
        "mni-Mtei": "Thagatchari",
        bn: "ধন্যবাদ",
        ne: "धन्यवाद"
    },
    "Yes": {
        hi: "हाँ",
        as: "হয়",
        lus: "Aw",
        "mni-Mtei": "Hoi",
        bn: "হ্যাঁ",
        ne: "हो"
    },
    "No": {
        hi: "नहीं",
        as: "নহয়",
        lus: "Aih",
        "mni-Mtei": "Natte",
        bn: "না",
        ne: "होइन"
    }
};

export async function POST(req: Request) {
    try {
        const { message, langCode } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        let englishMessage = message;
        let targetLang = langCode || "en";

        // Step 1: Detect and mock-translate English logic without needing live API if possible
        if (targetLang !== "en") {
            try {
                // Check if user exactly typed a cached local phrase
                let foundMatch = false;
                for (const [enKey, translations] of Object.entries(PRETRANSLATED_CACHE)) {
                    if (translations[targetLang] === message) {
                        englishMessage = enKey;
                        foundMatch = true;
                        break;
                    }
                }

                if (!foundMatch && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                    const [translations] = await translate.translate(message, "en");
                    englishMessage = Array.isArray(translations) ? translations[0] : translations;
                }
            } catch (e: any) {
                console.warn("Translation to English failed:", e.message);
                englishMessage = message;
            }
        }

        // Step 2: Generate English Response
        const lowerMsg = englishMessage.toLowerCase();
        let botEnglishReply = "I am a virtual assistant for NE-Connect. I can help you find professionals, book a service, or become a provider.";

        if (lowerMsg.includes("electrician")) {
            botEnglishReply = "Sure, I can help you find an electrician. Which city or state are you in?";
        } else if (lowerMsg.includes("plumber")) {
            botEnglishReply = "We have great plumbers available. Could you tell me your location?";
        } else if (lowerMsg.includes("book") || lowerMsg.includes("find")) {
            botEnglishReply = "I'd be happy to help you book a service. What kind of professional are you looking for, and where?";
        } else if (lowerMsg.includes("register") || lowerMsg.includes("become") || lowerMsg.includes("provider")) {
            botEnglishReply = "To become a provider, please click the 'Become a Provider' button on our site! It's quick and easy.";
        } else if (lowerMsg.includes("assam") || lowerMsg.includes("guwahati") || lowerMsg.includes("mizoram")) {
            botEnglishReply = "Great! We have many providers in that region. Let me know the exact service you need.";
        } else if (lowerMsg.includes("hi") || lowerMsg.includes("hello")) {
            botEnglishReply = "Hello! I am NE-Connect AI. How can I assist you today? I understand English and multiple Northeast Indian languages.";
        }

        // Step 3: Fast Translation to target Lang via Cache, fallback to live API
        let finalReply = botEnglishReply;
        if (targetLang !== "en") {
            if (PRETRANSLATED_CACHE[botEnglishReply] && PRETRANSLATED_CACHE[botEnglishReply][targetLang]) {
                // FAST CACHE HIT!
                finalReply = PRETRANSLATED_CACHE[botEnglishReply][targetLang];
            } else {
                try {
                    const [translations] = await translate.translate(botEnglishReply, targetLang);
                    finalReply = Array.isArray(translations) ? translations[0] : translations;
                } catch (e: any) {
                    console.warn("Translation to target language failed:", e.message);
                    // Use a more silent fallback if Google API restricts 
                    finalReply = botEnglishReply; // keep it in English if it fails and isn't in cache
                }
            }
        }

        return NextResponse.json({
            reply: finalReply,
            langCode: targetLang
        });

    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "Failed to process chat" },
            { status: 500 }
        );
    }
}
