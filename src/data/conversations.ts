export interface DialogueChoice {
  id: string;
  kannada: string;
  transliteration: string;
  english: string;
  feedback: string;
  isOptimal: boolean;
  nextStepId: string | null; // null indicates scenario completion
}

export interface DialogueStep {
  id: string;
  speakerName: string;
  speakerRole: 'npc' | 'user';
  kannada: string;
  transliteration: string;
  english: string;
  situationNote?: string;
  hint?: string;
  choices: DialogueChoice[];
}

export interface ConversationScenario {
  id: string;
  title: string;
  kannadaTitle: string;
  situation: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate';
  partnerName: string;
  partnerRole: string;
  avatarEmoji: string;
  summary: string;
  initialStepId: string;
  steps: Record<string, DialogueStep>;
}

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
  {
    id: 'darshini-dosa',
    title: 'Ordering at a Bengaluru Darshini',
    kannadaTitle: 'ದರ್ಶಿನಿ ಹೋಟೆಲ್‌ನಲ್ಲಿ ತಿಂಡಿ',
    situation: 'Quick-service restaurant breakfast',
    category: 'food-dining',
    difficulty: 'Beginner',
    partnerName: 'Manjunath',
    partnerRole: 'Counter Cashier & Server',
    avatarEmoji: '☕',
    summary: 'Walk into a busy Darshini hotel in Bengaluru, order a crispy Masala Dosa with less spice, ask for filter coffee, and settle your bill.',
    initialStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        speakerName: 'Manjunath (Cashier)',
        speakerRole: 'npc',
        kannada: 'ಬನ್ನಿ ಸರ್, ಏನ್ ಬೇಕು?',
        transliteration: 'Banni sir, ēn bēku?',
        english: 'Welcome sir, what would you like?',
        situationNote: 'Cashier welcomes you at the busy Darshini token counter.',
        hint: 'Use the polite suffix "koḍi" (please give) when ordering your food.',
        choices: [
          {
            id: 'c1',
            kannada: 'ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಕೊಡಿ.',
            transliteration: 'Ondu masāle dōse koḍi.',
            english: 'Please give one masala dosa.',
            feedback: 'Perfect! "Ondu masāle dōse koḍi" is the most natural, polite way to order at any Darshini in Karnataka.',
            isOptimal: true,
            nextStepId: 'step-2'
          },
          {
            id: 'c2',
            kannada: 'ದೋಸೆ ಬೇಕು.',
            transliteration: 'Dōse bēku.',
            english: 'I want dosa.',
            feedback: 'Understandable, but slightly abrupt. Adding "ondu" (one) and "koḍi" (please give) sounds much friendlier.',
            isOptimal: false,
            nextStepId: 'step-2'
          },
          {
            id: 'c3',
            kannada: 'ನೀರು ಕೊಡು.',
            transliteration: 'Nīru koḍu.',
            english: 'Give water (informal).',
            feedback: 'Using "koḍu" instead of "koḍi" is informal and sounds commanding to service staff.',
            isOptimal: false,
            nextStepId: 'step-2'
          }
        ]
      },
      'step-2': {
        id: 'step-2',
        speakerName: 'Manjunath (Cashier)',
        speakerRole: 'npc',
        kannada: 'ಖಾರ ಜಾಸ್ತಿ ಬೇಕಾ, ಮೀಡಿಯಂ ಸಾಕಾ?',
        transliteration: 'Khāra jāsti bēkā, mīḍiyam sākā?',
        english: 'Do you want it spicy, or is medium enough?',
        situationNote: 'Checking your spice preference for the red chutney inside the dosa.',
        hint: 'Say "khāra kammi" for less spice or "mīḍiyam" for normal.',
        choices: [
          {
            id: 'c4',
            kannada: 'ಖಾರ ಕಮ್ಮಿ ಮಾಡಿ, ತುಂಬಾ ಖಾರ ಬೇಡ.',
            transliteration: 'Khāra kammi māḍi, tumbā khāra bēḍa.',
            english: 'Make it less spicy, not too spicy.',
            feedback: 'Excellent! "Khāra kammi māḍi" clearly conveys your preference with polite verbal inflection.',
            isOptimal: true,
            nextStepId: 'step-3'
          },
          {
            id: 'c5',
            kannada: 'ಜಾಸ್ತಿ ಖಾರ ಹಾಕಿ!',
            transliteration: 'Jāsti khāra hāki!',
            english: 'Add extra spice!',
            feedback: 'Great if you love spicy food! The cashier will tell the kitchen to spread extra red chutney.',
            isOptimal: true,
            nextStepId: 'step-3'
          },
          {
            id: 'c6',
            kannada: 'ಬೇಡ.',
            transliteration: 'Bēḍa.',
            english: 'No / Don’t want.',
            feedback: 'Ambiguous. Saying just "Bēḍa" confuses the cook whether you want chutney at all.',
            isOptimal: false,
            nextStepId: 'step-3'
          }
        ]
      },
      'step-3': {
        id: 'step-3',
        speakerName: 'Manjunath (Cashier)',
        speakerRole: 'npc',
        kannada: 'ಆಯ್ತು ಸರ್. ಕುಡಿಯೋಕೆ ಏನಾದ್ರೂ ಬೇಕಾ? ಬಿಸಿ ಕಾಫಿ ಇದೆ.',
        transliteration: 'Āytu sir. Kuḍiyōke ēnādrū bēkā? Bisi kāphi ide.',
        english: 'Done sir. Anything to drink? We have hot filter coffee.',
        situationNote: 'Suggesting hot South Indian filter coffee to accompany breakfast.',
        hint: 'Order a single filter coffee politely using "Ondu philtar kāphi koḍi".',
        choices: [
          {
            id: 'c7',
            kannada: 'ಹೌದು, ಒಂದು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ.',
            transliteration: 'Haudu, ondu bisi philtar kāphi koḍi.',
            english: 'Yes, please give one hot filter coffee.',
            feedback: 'Splendid! Nothing beats authentic filter coffee after a dosa in Karnataka.',
            isOptimal: true,
            nextStepId: 'step-4'
          },
          {
            id: 'c8',
            kannada: 'ಇಲ್ಲ, ಬರೀ ನೀರು ಸಾಕು.',
            transliteration: 'Illa, barī nīru sāku.',
            english: 'No, plain water is enough.',
            feedback: 'Completely fine and polite if you don’t wish to drink coffee today.',
            isOptimal: true,
            nextStepId: 'step-4'
          }
        ]
      },
      'step-4': {
        id: 'step-4',
        speakerName: 'Manjunath (Cashier)',
        speakerRole: 'npc',
        kannada: 'ಒಟ್ಟು ಎಪ್ಪತ್ತು ರೂಪಾಯಿ ಆಯ್ತು ಸರ್. ಯುಪಿಐ ಮಾಡ್ತೀರಾ?',
        transliteration: 'Oṭṭu eppattu rūpāyi āytu sir. UPI māḍtīrā?',
        english: 'Total is seventy rupees, sir. Will you pay via UPI?',
        situationNote: 'Settle the payment bill at the counter.',
        hint: 'Ask for the QR code using "QR kōḍ tōrisi".',
        choices: [
          {
            id: 'c9',
            kannada: 'ಹೌದು, ಕ್ಯೂಆರ್ ಕೋಡ್ ತೋರಿಸಿ, ಸ್ಕ್ಯಾನ್ ಮಾಡ್ತೀನಿ.',
            transliteration: 'Haudu, QR kōḍ tōrisi, skyān māḍtīni.',
            english: 'Yes, please show the QR code, I will scan.',
            feedback: 'Spot on! Standard modern Bengaluru checkout phrasing.',
            isOptimal: true,
            nextStepId: null
          },
          {
            id: 'c10',
            kannada: 'ಕ್ಯಾಶ್ ತಗೊಳ್ಳಿ, ನೂರು ರೂಪಾಯಿ ನೋಟು.',
            transliteration: 'Kyāsh tagoḷḷi, nūru rūpāyi nōṭu.',
            english: 'Take cash, here is a hundred rupee note.',
            feedback: 'Good alternative! The cashier will return thirty rupees change.',
            isOptimal: true,
            nextStepId: null
          }
        ]
      }
    }
  },
  {
    id: 'bmtc-bus-travel',
    title: 'BMTC Bus Journey to Majestic',
    kannadaTitle: 'ಬಿಎಂಟಿಸಿ ಬಸ್ ಪ್ರಯಾಣ',
    situation: 'City public bus commute',
    category: 'public-transport',
    difficulty: 'Beginner',
    partnerName: 'Ramesh',
    partnerRole: 'BMTC Bus Conductor',
    avatarEmoji: '🚌',
    summary: 'Board a BMTC bus in Bengaluru, confirm whether it goes to Majestic, purchase your ticket, and ask for change politely.',
    initialStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        speakerName: 'Ramesh (Conductor)',
        speakerRole: 'npc',
        kannada: 'ಮುಂದೆ ಹೋಗಿ, ಟಿಕೆಟ್ ತಗೊಳ್ಳಿ! ಎಲ್ಲಿಗೆ ಹೋಗ್ಬೇಕು?',
        transliteration: 'Munde hōgi, ṭikeṭ tagoḷḷi! Ellige hōgbēku?',
        english: 'Move forward, take tickets! Where do you need to go?',
        situationNote: 'The conductor rings the bell and asks your destination.',
        hint: 'Tell your destination and ask for one ticket politely: "Majestic-ge ondu ṭikeṭ koḍi".',
        choices: [
          {
            id: 'b1',
            kannada: 'ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಒಂದು ಟಿಕೆಟ್ ಕೊಡಿ.',
            transliteration: 'Mejesṭik-ge ondu ṭikeṭ koḍi.',
            english: 'Please give one ticket to Majestic.',
            feedback: 'Perfect! Attaching "-ge" (dative: to Majestic) is grammatically precise and polite.',
            isOptimal: true,
            nextStepId: 'step-2'
          },
          {
            id: 'b2',
            kannada: 'ಮೆಜೆಸ್ಟಿಕ್ ಹೋಗುತ್ತಾ ಈ ಬಸ್?',
            transliteration: 'Mejesṭik hōguttā ī bas?',
            english: 'Does this bus go to Majestic?',
            feedback: 'Smart! Verifying the route first is always wise if you are boarding at an unfamiliar stop.',
            isOptimal: true,
            nextStepId: 'step-2'
          },
          {
            id: 'b3',
            kannada: 'ಮೆಜೆಸ್ಟಿಕ್ ಕೊಡು.',
            transliteration: 'Mejesṭik koḍu.',
            english: 'Give Majestic (informal).',
            feedback: 'Too blunt. Always use "koḍi" with conductors for mutual respect.',
            isOptimal: false,
            nextStepId: 'step-2'
          }
        ]
      },
      'step-2': {
        id: 'step-2',
        speakerName: 'Ramesh (Conductor)',
        speakerRole: 'npc',
        kannada: 'ಹೌದು, ಮೆಜೆಸ್ಟಿಕ್ ಹೋಗುತ್ತೆ. ಇಪ್ಪತ್ತೈದು ರೂಪಾಯಿ ಕೊಡಿ. ಚಿಲ್ಲರೆ ಇದೆಯಾ?',
        transliteration: 'Haudu, Mejesṭik hōgutte. Ippattaidu rūpāyi koḍi. Chillare ideyā?',
        english: 'Yes, it goes to Majestic. Twenty-five rupees please. Do you have exact change?',
        situationNote: 'Conductor requests small change ("chillare").',
        hint: 'Say "Chillare ide" (I have change) or "Chillare illa" (I don’t have change).',
        choices: [
          {
            id: 'b4',
            kannada: 'ಹೌದು, ಚಿಲ್ಲರೆ ಇದೆ, ಇಪ್ಪತ್ತೈದು ರೂಪಾಯಿ ತಗೊಳ್ಳಿ.',
            transliteration: 'Haudu, chillare ide, ippattaidu rūpāyi tagoḷḷi.',
            english: 'Yes, I have change, please take twenty-five rupees.',
            feedback: 'Conductors love passengers with exact change! You will get your ticket instantly.',
            isOptimal: true,
            nextStepId: 'step-3'
          },
          {
            id: 'b5',
            kannada: 'ಚಿಲ್ಲರೆ ಇಲ್ಲ ಸರ್, ಐವತ್ತು ರೂಪಾಯಿ ಇದೆ.',
            transliteration: 'Chillare illa sir, aivattu rūpāyi ide.',
            english: 'No change sir, I have a fifty rupee note.',
            feedback: 'Polite and transparent. The conductor will write the balance on the back of the ticket.',
            isOptimal: true,
            nextStepId: 'step-3'
          }
        ]
      },
      'step-3': {
        id: 'step-3',
        speakerName: 'Ramesh (Conductor)',
        speakerRole: 'npc',
        kannada: 'ಇಲ್ನೋಡಿ ನಿಮ್ಮ ಟಿಕೆಟ್. ಮೆಜೆಸ್ಟಿಕ್ ಬರುವಾಗ ಹೇಳ್ತೀನಿ.',
        transliteration: 'Ilnōḍi nimma ṭikeṭ. Mejesṭik baruvāga hēḷtīni.',
        english: 'Here is your ticket. I will tell you when Majestic arrives.',
        situationNote: 'Conductor hands you the printed ticket.',
        hint: 'Thank him with "Dhanyavādagaḷu anna" or "Thāṅks anna".',
        choices: [
          {
            id: 'b6',
            kannada: 'ಧನ್ಯವಾದಗಳು ಅಣ್ಣ, ಸ್ಟಾಪ್ ಬಂದಾಗ ದಯವಿಟ್ಟು ತಿಳಿಸಿ.',
            transliteration: 'Dhanyavādagaḷu aṇṇa, sṭāp bandāga dayaviṭṭu tiḷisi.',
            english: 'Thank you brother, please let me know when the stop arrives.',
            feedback: 'Warm and respectful. Addressing him as "Aṇṇa" (elder brother) is typical Bengaluru camaraderie.',
            isOptimal: true,
            nextStepId: null
          },
          {
            id: 'b7',
            kannada: 'ಆಯ್ತು.',
            transliteration: 'Āytu.',
            english: 'Okay.',
            feedback: 'Short and casual. Adding a quick thanks is customary.',
            isOptimal: false,
            nextStepId: null
          }
        ]
      }
    }
  },
  {
    id: 'auto-rickshaw-ride',
    title: 'Hailing an Auto by Meter',
    kannadaTitle: 'ಆಟೋ ಮೀಟರ್ ಪ್ರಯಾಣ',
    situation: 'Street auto rickshaw negotiation',
    category: 'travel-directions',
    difficulty: 'Beginner',
    partnerName: 'Shankar',
    partnerRole: 'Auto Driver',
    avatarEmoji: '🛺',
    summary: 'Hail an auto on the street, ask to go to Indiranagar Metro Station, ensure the meter is switched on, and pay safely via UPI.',
    initialStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        speakerName: 'Shankar (Auto Driver)',
        speakerRole: 'npc',
        kannada: 'ಎಲ್ಲಿಗೆ ಹೋಗ್ಬೇಕು ಸಾರ್?',
        transliteration: 'Ellige hōgbēku sār?',
        english: 'Where do you need to go, sir?',
        situationNote: 'Auto slows down next to you at the curb.',
        hint: 'State your destination with "-ge" and ask if he will come: "Indiranagar meṭrō sṭēshan-ge baruttīrā?".',
        choices: [
          {
            id: 'a1',
            kannada: 'ಇಂದಿರಾನಗರ ಮೆಟ್ರೋ ಸ್ಟೇಷನ್‌ಗೆ ಬರ್ತೀರಾ?',
            transliteration: 'Indirānagara meṭrō sṭēshan-ge bartīrā?',
            english: 'Will you come to Indiranagar Metro Station?',
            feedback: 'Polite and clear. "Bartīrā?" asks respectfully if he is willing to take the trip.',
            isOptimal: true,
            nextStepId: 'step-2'
          },
          {
            id: 'a2',
            kannada: 'ಇಂದಿರಾನಗರ ಹೋಗು.',
            transliteration: 'Indirānagara hōgu.',
            english: 'Go to Indiranagar (informal).',
            feedback: 'Too bossy. Drivers dislike being addressed with informal commands like "hōgu".',
            isOptimal: false,
            nextStepId: 'step-2'
          }
        ]
      },
      'step-2': {
        id: 'step-2',
        speakerName: 'Shankar (Auto Driver)',
        speakerRole: 'npc',
        kannada: 'ಹೋಗೋಣ ಸಾರ್, ಬನ್ನಿ ಕೂತ್ಕೊಳ್ಳಿ.',
        transliteration: 'Hōgōṇa sār, banni kūtkoḷḷi.',
        english: 'Let’s go sir, come sit inside.',
        situationNote: 'Driver agrees. Before the auto starts moving, confirm meter usage.',
        hint: 'Politely say: "Mīṭar hāki sir" (Please put the meter).',
        choices: [
          {
            id: 'a3',
            kannada: 'ಮೀಟರ್ ಹಾಕಿ ಸರ್, ದಯವಿಟ್ಟು.',
            transliteration: 'Mīṭar hāki sir, dayaviṭṭu.',
            english: 'Please put the meter, sir.',
            feedback: 'Crucial habit in Bengaluru! Asking politely before starting prevents fare disputes at arrival.',
            isOptimal: true,
            nextStepId: 'step-3'
          },
          {
            id: 'a4',
            kannada: 'ಎಷ್ಟು ದುಡ್ಡು ಬೇಕು?',
            transliteration: 'Eṣṭu duḍḍu bēku?',
            english: 'How much money do you want?',
            feedback: 'Invites arbitrary fixed pricing. It is always better to insist on the government meter first.',
            isOptimal: false,
            nextStepId: 'step-3'
          }
        ]
      },
      'step-3': {
        id: 'step-3',
        speakerName: 'Shankar (Auto Driver)',
        speakerRole: 'npc',
        kannada: 'ಹಾಕ್ತೀನಿ ಸಾರ್, ಡೌನ್ ಮಾಡಿದ್ದೀನಿ ನೋಡಿ. ಎಡಕ್ಕಾ ಬಲಕ್ಕಾ?',
        transliteration: 'Hāktīni sār, ḍaun māḍiddīni nōḍi. Eḍakkā balakkā?',
        english: 'Putting it sir, see I lowered the flag. Do we turn left or right ahead?',
        situationNote: 'Navigating near 100 Feet Road junction.',
        hint: 'Use "Eḍagaḍe" for left and "Balagaḍe" for right.',
        choices: [
          {
            id: 'a5',
            kannada: 'ಸಿಗ್ನಲ್ ಹತ್ರ ಬಲಗಡೆ ತಗೊಳ್ಳಿ, ಆಮೇಲೆ ನೇರ ಹೋಗಿ.',
            transliteration: 'Signāl hatra balagaḍe tagoḷḷi, āmēle nēra hōgi.',
            english: 'Take a right near the signal, then go straight.',
            feedback: 'Crystal-clear navigation! The driver knows exactly which lane to stay in.',
            isOptimal: true,
            nextStepId: 'step-4'
          },
          {
            id: 'a6',
            kannada: 'ಅಲ್ಲಿ ಹೋಗಿ.',
            transliteration: 'Alli hōgi.',
            english: 'Go there.',
            feedback: 'Too vague in heavy traffic.',
            isOptimal: false,
            nextStepId: 'step-4'
          }
        ]
      },
      'step-4': {
        id: 'step-4',
        speakerName: 'Shankar (Auto Driver)',
        speakerRole: 'npc',
        kannada: 'ಮೆಟ್ರೋ ಸ್ಟೇಷನ್ ಬಂತು ಸಾರ್. ಮೀಟರ್‌ನಲ್ಲಿ ಐವತ್ತೈದು ರೂಪಾಯಿ ಆಗಿದೆ.',
        transliteration: 'Meṭrō sṭēshan bantu sār. Mīṭar-nalli aivattaidu rūpāyi āgide.',
        english: 'Metro station has arrived, sir. It is fifty-five rupees on the meter.',
        situationNote: 'Arrived at your destination. Time to settle the payment.',
        hint: 'Ask if PhonePe/GPay is fine: "GPay māḍlā sir?".',
        choices: [
          {
            id: 'a7',
            kannada: 'ಸರಿ ಅಣ್ಣ, ಗೂಗಲ್ ಪೇ ಮಾಡ್ಲಾ? ಕ್ಯೂಆರ್ ಕೋಡ್ ಇದೆಯಾ?',
            transliteration: 'Sari aṇṇa, Google Pay māḍlā? QR kōḍ ideyā?',
            english: 'Alright brother, shall I Google Pay? Do you have a QR code?',
            feedback: 'Almost all Bengaluru auto drivers have a QR stand attached behind their seat.',
            isOptimal: true,
            nextStepId: null
          },
          {
            id: 'a8',
            kannada: 'ಇಲ್ಲಿ ತಗೊಳ್ಳಿ, ಸರಿಯಾದ ದುಡ್ಡು.',
            transliteration: 'Illi tagoḷḷi, sariyāda duḍḍu.',
            english: 'Take here, exact money.',
            feedback: 'Clean and hassle-free transaction.',
            isOptimal: true,
            nextStepId: null
          }
        ]
      }
    }
  },
  {
    id: 'kr-market-shopping',
    title: 'Vegetable Shopping at KR Market',
    kannadaTitle: 'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ತರಕಾರಿ ಖರೀದಿ',
    situation: 'Local bazaar fresh produce purchase',
    category: 'shopping-markets',
    difficulty: 'Intermediate',
    partnerName: 'Lakshmamma',
    partnerRole: 'Vegetable Vendor',
    avatarEmoji: '🍅',
    summary: 'Browse a traditional vegetable vendor stall at KR Market, inquire about fresh tomatoes and onions, negotiate politely, and ask for coriander.',
    initialStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        speakerName: 'Lakshmamma (Vendor)',
        speakerRole: 'npc',
        kannada: 'ಬನ್ನಿ ಅಮ್ಮ/ಸರ್, ಇವತ್ತಿನ ತಾಜಾ ನಾಟಿ ಟೊಮೆಟೊ ಬಂದಿದೆ. ಏನ್ ಬೇಕು?',
        transliteration: 'Banni amma/sir, ivattina tājā nāṭi ṭomeṭo bandide. Ēn bēku?',
        english: 'Welcome, fresh local tomatoes arrived today. What do you need?',
        situationNote: 'Standing in front of the colorful fresh produce stalls.',
        hint: 'Ask the price per kilo: "Idu ondu kējige eṣṭu?".',
        choices: [
          {
            id: 'k1',
            kannada: 'ಟೊಮೆಟೊ ಒಂದು ಕೆಜಿಗೆ ಎಷ್ಟು ರೂಪಾಯಿ?',
            transliteration: 'Ṭomeṭo ondu kējige eṣṭu rūpāyi?',
            english: 'How many rupees is one kg of tomatoes?',
            feedback: 'Perfect! "Ondu kējige eṣṭu?" is the universal way to ask prices across markets in Karnataka.',
            isOptimal: true,
            nextStepId: 'step-2'
          },
          {
            id: 'k2',
            kannada: 'ಬೆಲೆ ಎಷ್ಟು?',
            transliteration: 'Bele eṣṭu?',
            english: 'What is the price?',
            feedback: 'Grammatically correct, but vendors will ask "How much quantity do you want?". Specify "ondu kējige" (per kg).',
            isOptimal: false,
            nextStepId: 'step-2'
          }
        ]
      },
      'step-2': {
        id: 'step-2',
        speakerName: 'Lakshmamma (Vendor)',
        speakerRole: 'npc',
        kannada: 'ಒಂದು ಕೆಜಿಗೆ ಮೂವತ್ತು ರೂಪಾಯಿ. ಎರಡು ಕೆಜಿ ತಗೊಂಡ್ರೆ ಐವತ್ತಕ್ಕೆ ಕೊಡ್ತೀನಿ.',
        transliteration: 'Ondu kējige mūvattu rūpāyi. Eraḍu kēji tagoṇḍre aivattakke koḍtīni.',
        english: 'Thirty rupees per kg. If you take two kg, I will give for fifty.',
        situationNote: 'Vendor offers a slight bulk discount.',
        hint: 'Ask for two kg and request fresh ones: "Eraḍu kēji koḍi, tājā iddu hāki".',
        choices: [
          {
            id: 'k3',
            kannada: 'ಸರಿ, ಎರಡು ಕೆಜಿ ಕೊಡಿ. ಒಳ್ಳೆಯ ತಾಜಾ ಇರೋದು ಆರಿಸಿ ಹಾಕಿ.',
            transliteration: 'Sari, eraḍu kēji koḍi. Oḷḷeya tājā irōdu ārisi hāki.',
            english: 'Alright, give two kg. Please select good, fresh ones.',
            feedback: 'Great phrase! "Ārisi hāki" means "please handpick good ones".',
            isOptimal: true,
            nextStepId: 'step-3'
          },
          {
            id: 'k4',
            kannada: 'ಇನ್ನೂ ಕಮ್ಮಿ ಮಾಡಿ, ಇಪ್ಪತ್ತು ರೂಪಾಯಿಗೆ ಕೊಡಿ.',
            transliteration: 'Innū kammi māḍi, ippattu rūpāyige koḍi.',
            english: 'Reduce more, give for twenty rupees.',
            feedback: 'A bit aggressive for market rates; 50 for 2kg is already reasonable for Naati tomatoes.',
            isOptimal: false,
            nextStepId: 'step-3'
          }
        ]
      },
      'step-3': {
        id: 'step-3',
        speakerName: 'Lakshmamma (Vendor)',
        speakerRole: 'npc',
        kannada: 'ಆಯ್ತು, ಚೀಲದಲ್ಲಿ ಹಾಕಿದ್ದೀನಿ. ಈರುಳ್ಳಿ ಅಥವಾ ಆಲೂಗಡ್ಡೆ ಬೇಕಾ?',
        transliteration: 'Āytu, chīladalli hākiddīni. Īruḷḷi athavā ālūgaḍḍe bēkā?',
        english: 'Done, I packed it in the bag. Do you need onions or potatoes?',
        situationNote: 'Vegetable vendor asks about root vegetables.',
        hint: 'Say "Illa sāku" (No that is enough) and ask for free coriander: "Swalpa kothambari soppu hāki".',
        choices: [
          {
            id: 'k5',
            kannada: 'ಅದು ಬೇಡ ಅಮ್ಮ, ಮೇಲೆ ಸ್ವಲ್ಪ ಕೊತ್ತಂಬರಿ ಸೊಪ್ಪು ಹಾಕಿ!',
            transliteration: 'Adu bēḍa amma, mēle swalpa kothambari soppu hāki!',
            english: 'Don’t need those, but please toss a little coriander on top!',
            feedback: 'Authentic Indian bazaar secret! Asking for complimentary "kothambari soppu" shows true local shopping savviness.',
            isOptimal: true,
            nextStepId: null
          },
          {
            id: 'k6',
            kannada: 'ಸಾಕು, ಒಟ್ಟು ಎಷ್ಟು ಆಯ್ತು?',
            transliteration: 'Sāku, oṭṭu eṣṭu āytu?',
            english: 'Enough, what is the total?',
            feedback: 'Good and straightforward.',
            isOptimal: true,
            nextStepId: null
          }
        ]
      }
    }
  },
  {
    id: 'asking-directions-indiranagar',
    title: 'Asking for Directions on 100 Feet Road',
    kannadaTitle: 'ದಾರಿ ಕೇಳುವುದು',
    situation: 'Street pedestrian navigation',
    category: 'travel-directions',
    difficulty: 'Beginner',
    partnerName: 'Praveen',
    partnerRole: 'Local Resident',
    avatarEmoji: '📍',
    summary: 'Politely stop a local pedestrian on the sidewalk to ask how far the nearest pharmacy or landmark is, and understand their directions.',
    initialStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        speakerName: 'Praveen (Local)',
        speakerRole: 'npc',
        kannada: 'ಹೇಳಿ ಸರ್, ಏನಾದ್ರೂ ಸಹಾಯ ಬೇಕಾ?',
        transliteration: 'Hēḷi sir, ēnādrū sahāya bēkā?',
        english: 'Yes sir, do you need any help?',
        situationNote: 'A helpful pedestrian stops when you approach.',
        hint: 'Start with polite greeting and ask: "Hatra yāvudādaru meḍikal shāp ideyā?".',
        choices: [
          {
            id: 'd1',
            kannada: 'ನಮಸ್ಕಾರ ಸರ್, ಹತ್ತಿರದಲ್ಲಿ ಯಾವುದಾದರೂ ಮೆಡಿಕಲ್ ಶಾಪ್ ಇದೆಯಾ?',
            transliteration: 'Namaskāra sir, hattiradalli yāvudādarū meḍikal shāp ideyā?',
            english: 'Hello sir, is there any medical shop nearby?',
            feedback: 'Very polite and natural. Starting with "Namaskāra" immediately establishes good rapport.',
            isOptimal: true,
            nextStepId: 'step-2'
          },
          {
            id: 'd2',
            kannada: 'ಮೆಡಿಕಲ್ ಶಾಪ್ ಎಲ್ಲಿದೆ?',
            transliteration: 'Meḍikal shāp ellide?',
            english: 'Where is the medical shop?',
            feedback: 'Understandable, but greeting with "Namaskāra" first sounds much more courteous.',
            isOptimal: false,
            nextStepId: 'step-2'
          }
        ]
      },
      'step-2': {
        id: 'step-2',
        speakerName: 'Praveen (Local)',
        speakerRole: 'npc',
        kannada: 'ಇಲ್ಲಿಂದ ನೇರ ಹೋಗಿ, ಎರಡನೇ ಕ್ರಾಸ್ ಹತ್ರ ಎಡಗಡೆ ತಿರುಗಿ. ಅಲ್ಲೇ ಅಪೋಲೋ ಫಾರ್ಮಸಿ ಇದೆ.',
        transliteration: 'Illinda nēra hōgi, eraḍanē krās hatra eḍagaḍe tirugi. Allē Apollo Phārmasi ide.',
        english: 'Go straight from here, turn left near the second cross. Apollo Pharmacy is right there.',
        situationNote: 'He explains the route with cross roads.',
        hint: 'Ask if it is walkable distance: "Naḍedu hōgabahudā?".',
        choices: [
          {
            id: 'd3',
            kannada: 'ತುಂಬಾ ದೂರ ಇದೆಯಾ ಸರ್, ಅಥವಾ ನಡೆದುಕೊಂಡು ಹೋಗಬಹುದಾ?',
            transliteration: 'Tumbā dūra ideyā sir, athavā naḍedukoṇḍu hōgabahudā?',
            english: 'Is it very far sir, or can I walk there?',
            feedback: '"Naḍedukoṇḍu hōgabahudā?" is an essential phrase for travelers in Bengaluru.',
            isOptimal: true,
            nextStepId: 'step-3'
          },
          {
            id: 'd4',
            kannada: 'ಗೊತ್ತಾಯ್ತು, ಥ್ಯಾಂಕ್ಸ್.',
            transliteration: 'Gottāytu, thāṅks.',
            english: 'Understood, thanks.',
            feedback: 'Friendly and succinct.',
            isOptimal: true,
            nextStepId: null
          }
        ]
      },
      'step-3': {
        id: 'step-3',
        speakerName: 'Praveen (Local)',
        speakerRole: 'npc',
        kannada: 'ಹತ್ತಿರವೇ ಇದೆ, ಎರಡು ನಿಮಿಷದ ನಡಿಗೆ ಅಷ್ಟೇ.',
        transliteration: 'Hattiravē ide, eraḍu nimiṣada naḍige aṣṭē.',
        english: 'It is very close, just a two-minute walk.',
        situationNote: 'Confirming it is very close.',
        hint: 'Thank him warmly with "Tumbā dhanyavādagaḷu sir".',
        choices: [
          {
            id: 'd5',
            kannada: 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು ಸರ್, ಸಹಾಯ ಮಾಡಿದ್ದಕ್ಕೆ!',
            transliteration: 'Tumbā dhanyavādagaḷu sir, sahāya māḍiddakke!',
            english: 'Thank you very much sir, for helping out!',
            feedback: 'Leaves a wonderful and courteous impression on locals.',
            isOptimal: true,
            nextStepId: null
          },
          {
            id: 'd6',
            kannada: 'ಸರಿ, ಹೋಗಿ ಬರ್ತೀನಿ.',
            transliteration: 'Sari, hōgi bartīni.',
            english: 'Okay, I will take leave.',
            feedback: 'Natural Kannada farewell, though explicitly thanking with "Dhanyavādagaḷu" is even better when receiving directions.',
            isOptimal: true,
            nextStepId: null
          }
        ]
      }
    }
  }
];
