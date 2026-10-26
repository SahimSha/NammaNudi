import type { Phrase } from '../types';

export const PHRASES: Phrase[] = [
  // 1. TRAVEL & DIRECTIONS (travel-directions)
  {
    id: 'td-01',
    categoryId: 'travel-directions',
    kannada: 'ಇಲ್ಲಿಗೆ ಹೇಗೆ ಹೋಗುವುದು?',
    transliteration: 'Illige hege hoguvudu?',
    english: 'How do I go here? / How to reach here?',
    contextNote: 'Point to a location on your phone or card while asking this.',
    pronunciationGuide: 'Il-li-ge he-ge ho-gu-vu-du?',
    formality: 'polite',
    situation: 'Asking a pedestrian or shopkeeper for directions',
    tags: ['directions', 'route', 'destination', 'navigation'],
    literalMeaning: 'To here how going?',
    variants: [
      {
        id: 'td-01-polite',
        formality: 'polite',
        kannada: 'ಇಲ್ಲಿಗೆ ಹೇಗೆ ಹೋಗುವುದು ಸರ್?',
        transliteration: 'Illige hege hoguvudu sir?',
        english: 'How do I reach here, sir?',
        usageContext: 'Default polite approach with strangers, traffic police, or shopkeepers in Bengaluru.',
        isRecommendedDefault: true
      },
      {
        id: 'td-01-casual',
        formality: 'casual',
        kannada: 'ಇಲ್ಲಿಗೆ ಹೇಗೆ ಹೋಗೋದು?',
        transliteration: 'Illige hege hogodu?',
        english: 'How to go here? (spoken casual)',
        usageContext: 'Everyday spoken contraction among peers, colleagues, or familiar shopkeepers.'
      },
      {
        id: 'td-01-formal',
        formality: 'formal',
        kannada: 'ದಯವಿಟ್ಟು ಈ ಸ್ಥಳಕ್ಕೆ ಹೋಗುವ ದಾರಿ ತಿಳಿಸಿ.',
        transliteration: 'Dayavittu ee sthalakke hoguva daari thilisi.',
        english: 'Please inform me of the route to this place.',
        usageContext: 'Formal, highly respectful request suitable when addressing senior citizens or in writing.'
      }
    ]
  },
  {
    id: 'td-02',
    categoryId: 'travel-directions',
    kannada: 'ಸ್ವಲ್ಪ ಮುಂದಕ್ಕೆ ಹೋಗಿ, ಆಮೇಲೆ ಬಲಕ್ಕೆ ತಿರುಗಿ.',
    transliteration: 'Swalpa mundakke hogi, aamele balakke tirugi.',
    english: 'Go a little forward, then turn right.',
    contextNote: 'Standard response you will hear when asking for directions in Bengaluru.',
    pronunciationGuide: 'Swal-pa mun-dak-ke ho-gi, aa-me-le ba-lak-ke ti-ru-gi.',
    formality: 'polite',
    situation: 'Direction guidance',
    tags: ['directions', 'right turn', 'forward']
  },
  {
    id: 'td-03',
    categoryId: 'travel-directions',
    kannada: 'ಎಡಕ್ಕೆ ಹೋಗಬೇಕಾ ಅಥವಾ ಬಲಕ್ಕಾ?',
    transliteration: 'Yedakke hogabeka athava balakka?',
    english: 'Should I go left or right?',
    contextNote: 'Useful at intersections or fork in the road.',
    pronunciationGuide: 'Ye-dak-ke ho-ga-be-kaa a-tha-va ba-lak-kaa?',
    formality: 'polite',
    situation: 'At a junction or fork in the road',
    tags: ['left', 'right', 'junction', 'crossroad']
  },
  {
    id: 'td-04',
    categoryId: 'travel-directions',
    kannada: 'ಇಲ್ಲಿ ಹತ್ತಿರ ಮೆಟ್ರೋ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?',
    transliteration: 'Illi hathira Metro nildaana yellide?',
    english: 'Where is the nearest Metro station around here?',
    contextNote: 'Essential phrase for navigating Namma Metro in Bengaluru.',
    pronunciationGuide: 'Il-li ha-thi-ra Met-ro nil-daa-na yel-li-de?',
    formality: 'polite',
    situation: 'Commuter seeking Namma Metro',
    tags: ['metro', 'transit', 'nearby', 'station']
  },
  {
    id: 'td-05',
    categoryId: 'travel-directions',
    kannada: 'ಇದು ಎಷ್ಟು ದೂರ ಇದೆ?',
    transliteration: 'Idu eshtu doora ide?',
    english: 'How far is this?',
    contextNote: 'Use this before deciding whether to take an auto or walk.',
    pronunciationGuide: 'I-du esh-tu doo-ra i-de?',
    formality: 'polite',
    situation: 'Checking travel distance',
    tags: ['distance', 'travel', 'walking']
  },
  {
    id: 'td-06',
    categoryId: 'travel-directions',
    kannada: 'ನಾನು ದಾರಿ ತಪ್ಪಿದ್ದೇನೆ, ದಯವಿಟ್ಟು ಸಹಾಯ ಮಾಡಿ.',
    transliteration: 'Naanu daari thappiddeene, dayavittu sahaaya maadi.',
    english: 'I have lost my way, please help me.',
    contextNote: 'A respectful and humble plea that encourages local passers-by to help immediately.',
    pronunciationGuide: 'Naa-nu daa-ri thap-pid-dee-ne, da-ya-vit-tu sa-haa-ya maa-di.',
    formality: 'polite',
    situation: 'When completely lost in an unfamiliar locality',
    tags: ['help', 'lost', 'emergency', 'assistance'],
    variants: [
      {
        id: 'td-06-polite',
        formality: 'polite',
        kannada: 'ನಾನು ದಾರಿ ತಪ್ಪಿದ್ದೇನೆ, ದಯವಿಟ್ಟು ಸಹಾಯ ಮಾಡಿ.',
        transliteration: 'Naanu daari thappiddeene, dayavittu sahaaya maadi.',
        english: 'I have lost my way, please help me.',
        usageContext: 'Standard courteous plea that encourages any passerby to help.',
        isRecommendedDefault: true
      },
      {
        id: 'td-06-spoken',
        formality: 'casual',
        kannada: 'ದಾರಿ ಗೊತ್ತಾಗ್ತಿಲ್ಲ ಅಣ್ಣಾ, ಸ್ವಲ್ಪ ಹೆಲ್ಪ್ ಮಾಡ್ತೀರಾ?',
        transliteration: 'Daari gotthaagthilla anna, swalpa help maadtheera?',
        english: 'Not getting the route brother, could you help a bit?',
        usageContext: 'Everyday Bengaluru street phrasing with auto drivers or local vendors.'
      }
    ]
  },
  {
    id: 'td-07',
    categoryId: 'travel-directions',
    kannada: 'ನೇರವಾಗಿ ಹೋಗಿ, ಸರ್ಕಲ್ ಹತ್ತಿರ ನಿಲ್ಲಿಸಿ.',
    transliteration: 'Neraavaagi hogi, circle hathira nillisi.',
    english: 'Go straight and stop near the circle / roundabout.',
    contextNote: 'Bengaluru has many famous "circles" (roundabouts). "Vruttha" is formal Kannada, but "circle" is universally used.',
    pronunciationGuide: 'Ne-raa-vaa-gi ho-gi, cir-cle ha-thi-ra nil-li-si.',
    formality: 'polite',
    situation: 'Guiding a cab/auto or giving instructions',
    tags: ['straight', 'circle', 'landmark']
  },
  {
    id: 'td-08',
    categoryId: 'travel-directions',
    kannada: 'ರೈಲ್ವೆ ನಿಲ್ದಾಣ ಯಾವ ಕಡೆ ಬರುತ್ತದೆ?',
    transliteration: 'Railway nildaana yaava kade barutthe?',
    english: 'Which direction is the railway station?',
    contextNote: 'Works for KSR Bengaluru (Majestic), Yeshwantpur, or Cantonment.',
    pronunciationGuide: 'Rail-way nil-daa-na yaa-va ka-de ba-rut-the?',
    formality: 'polite',
    situation: 'Seeking railway terminals',
    tags: ['train', 'station', 'direction']
  },
  {
    id: 'td-09',
    categoryId: 'travel-directions',
    kannada: 'ಇಲ್ಲಿಂದ ನಡ್ಕೊಂಡು ಹೋಗಬಹುದಾ?',
    transliteration: 'Illinda nadkondu hogabahuda?',
    english: 'Can I walk from here?',
    contextNote: 'Very handy when an auto driver quotes an unreasonable fare. "Nadkondu" is colloquial spoken Kannada for "nadedukondu".',
    pronunciationGuide: 'Il-lin-da nad-kon-du ho-ga-ba-hu-daa?',
    formality: 'casual',
    situation: 'Assessing if walking is feasible',
    tags: ['walk', 'distance', 'short'],
    needsDialectReview: true,
    needsSpeakerReview: true
  },
  {
    id: 'td-10',
    categoryId: 'travel-directions',
    kannada: 'ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸಬಹುದಾ?',
    transliteration: 'Naksheyalli thorisabahuda?',
    english: 'Can you show it on the map?',
    contextNote: '"Nakshe" means map. Show your Google Maps screen when language barrier is high.',
    pronunciationGuide: 'Nak-she-yal-li tho-ri-sa-ba-hu-daa?',
    formality: 'polite',
    situation: 'Visual map clarification with a local',
    tags: ['map', 'phone', 'gps']
  },

  // 2. PUBLIC TRANSPORT & BUS STATIONS (public-transport)
  {
    id: 'pt-01',
    categoryId: 'public-transport',
    kannada: 'ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಒಂದು ಟಿಕೆಟ್ ಕೊಡಿ.',
    transliteration: 'Majestic-ge ondu ticket kodi.',
    english: 'Please give one ticket to Majestic.',
    contextNote: 'Replace "Majestic" with any destination like "Koramangala" or "Whitefield".',
    pronunciationGuide: 'Ma-jes-tic-ge on-du tic-ket ko-di.',
    formality: 'polite',
    situation: 'Buying ticket from a BMTC bus conductor',
    tags: ['bmtc', 'ticket', 'bus', 'conductor'],
    variants: [
      {
        id: 'pt-01-polite',
        formality: 'polite',
        kannada: 'ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಒಂದು ಟಿಕೆಟ್ ಕೊಡಿ.',
        transliteration: 'Majestic-ge ondu ticket kodi.',
        english: 'Please give one ticket to Majestic.',
        usageContext: 'Standard courteous request with BMTC conductor.',
        isRecommendedDefault: true
      },
      {
        id: 'pt-01-spoken',
        formality: 'casual',
        kannada: 'ಮೆಜೆಸ್ಟಿಕ್ ಒಂದು ಟಿಕೆಟ್ ಅಣ್ಣಾ.',
        transliteration: 'Majestic ondu ticket anna.',
        english: 'One ticket to Majestic brother.',
        usageContext: 'Natural colloquial address using "anna" (brother), common on crowded buses.'
      },
      {
        id: 'pt-01-formal',
        formality: 'formal',
        kannada: 'ದಯವಿಟ್ಟು ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಒಂದು ಟಿಕೆಟ್ ಕೊಡಿ ಸರ್.',
        transliteration: 'Dayavittu Majestic-ge ondu ticket kodi sir.',
        english: 'Please give one ticket to Majestic, sir.',
        usageContext: 'Extra-polite formal request with conductor.'
      }
    ]
  },
  {
    id: 'pt-02',
    categoryId: 'public-transport',
    kannada: 'ಈ ಬಸ್ ಶಿವಾಜಿನಗರಕ್ಕೆ ಹೋಗುತ್ತಾ?',
    transliteration: 'Ee bus Shivajinagara-kke hogutthaa?',
    english: 'Does this bus go to Shivajinagar?',
    contextNote: 'Ask conductor or fellow passenger before boarding.',
    pronunciationGuide: 'Ee bus Shi-vaa-ji-na-ga-rak-ke ho-gut-thaa?',
    formality: 'polite',
    situation: 'Confirming bus route before stepping inside',
    tags: ['bus route', 'bmtc', 'stop']
  },
  {
    id: 'pt-03',
    categoryId: 'public-transport',
    kannada: 'ಮುಂದಿನ ನಿಲ್ದಾಣ ಯಾವುದು?',
    transliteration: 'Mundina nildaana yaavudu?',
    english: 'Which is the next stop?',
    contextNote: 'Ask a co-passenger on a crowded bus without digital announcements.',
    pronunciationGuide: 'Mun-di-na nil-daa-na yaa-vu-du?',
    formality: 'polite',
    situation: 'Checking current transit stop',
    tags: ['next stop', 'station', 'bus']
  },
  {
    id: 'pt-04',
    categoryId: 'public-transport',
    kannada: 'ನನ್ನ ಸ್ಟಾಪ್ ಬಂದಾಗ ದಯವಿಟ್ಟು ತಿಳಿಸಿ.',
    transliteration: 'Nanna stop bandaaga dayavittu thilisi.',
    english: 'Please let me know when my stop arrives.',
    contextNote: 'Polite request to conductor or neighbor sitting next to you.',
    pronunciationGuide: 'Nan-na stop ban-daa-ga da-ya-vit-tu thi-li-si.',
    formality: 'polite',
    situation: 'Ensuring you do not miss your drop stop',
    tags: ['alert', 'stop', 'conductor']
  },
  {
    id: 'pt-05',
    categoryId: 'public-transport',
    kannada: 'ಆಟೋ ಮೀಟರ್ ಹಾಕಿ ಬರುತ್ತೀರಾ?',
    transliteration: 'Auto meter haaki baruttheera?',
    english: 'Will you come by meter?',
    contextNote: 'Golden phrase in Bengaluru. Asking politely often gets you a fair ride.',
    pronunciationGuide: 'Au-to mee-ter haa-ki ba-rut-thee-raa?',
    formality: 'polite',
    situation: 'Hailing an auto rickshaw on the street',
    tags: ['auto', 'meter', 'fare', 'rickshaw'],
    variants: [
      {
        id: 'pt-05-polite',
        formality: 'polite',
        kannada: 'ಮೀಟರ್ ಹಾಕಿ ಬರುತ್ತೀರಾ ಸರ್?',
        transliteration: 'Meter haaki baruttheera sir?',
        english: 'Will you come by meter, sir?',
        usageContext: 'Courteous question to auto driver when hailing on roadside.',
        isRecommendedDefault: true
      },
      {
        id: 'pt-05-colloquial',
        formality: 'casual',
        kannada: 'ಮೀಟರ್ ಹಾಕಪ್ಪಾ, ಹೋಗೋಣ.',
        transliteration: 'Meter haakappa, hogona.',
        english: 'Please put the meter brother, let us go.',
        usageContext: 'Warm Bengaluru colloquial request with "haakappa" (friendly request).'
      },
      {
        id: 'pt-05-direct',
        formality: 'polite',
        kannada: 'ಮೀಟರ್ ಹಾಕಿ.',
        transliteration: 'Meter haaki.',
        english: 'Please turn on the meter.',
        usageContext: 'Direct, clear polite command upon sitting inside the auto.'
      }
    ]
  },
  {
    id: 'pt-06',
    categoryId: 'public-transport',
    kannada: 'ಇಲ್ಲಿ ಇಳಿಯುತ್ತೇನೆ, ನಿಲ್ಲಿಸಿ ಅಣ್ಣಾ.',
    transliteration: 'Illi iliyutthene, nillisi anna.',
    english: 'I will get down here, please stop brother.',
    contextNote: '"Anna" (elder brother) is universally polite and respectful in Karnataka.',
    pronunciationGuide: 'Il-li i-li-yut-the-ne, nil-li-si an-naa.',
    formality: 'polite',
    situation: 'Signaling bus conductor or auto driver to halt',
    tags: ['get down', 'stop', 'anna', 'alight'],
    variants: [
      {
        id: 'pt-06-polite',
        formality: 'polite',
        kannada: 'ಇಲ್ಲಿ ಇಳಿಯುತ್ತೇನೆ, ನಿಲ್ಲಿಸಿ ಅಣ್ಣಾ.',
        transliteration: 'Illi iliyutthene, nillisi anna.',
        english: 'I will get down here, please stop brother.',
        usageContext: 'Standard respectful signal to auto driver or bus conductor.',
        isRecommendedDefault: true
      },
      {
        id: 'pt-06-urgent',
        formality: 'casual',
        kannada: 'ಸ್ವಲ್ಪ ಸೈಡಲ್ಲಿ ನಿಲ್ಲಿಸಿ!',
        transliteration: 'Swalpa side-alli nillisi!',
        english: 'Please pull over to the side!',
        usageContext: 'Quick instruction when approaching your gate or corner.'
      },
      {
        id: 'pt-06-formal',
        formality: 'formal',
        kannada: 'ಮುಂದಿನ ನಿಲ್ದಾಣದಲ್ಲಿ ದಯವಿಟ್ಟು ನಿಲ್ಲಿಸಿ.',
        transliteration: 'Mundina nildaana-dalli dayavittu nillisi.',
        english: 'Please halt at the next stop.',
        usageContext: 'Formal bus stop drop request.'
      }
    ]
  },
  {
    id: 'pt-07',
    categoryId: 'public-transport',
    kannada: 'ಮೆಟ್ರೋ ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ರಿಚಾರ್ಜ್ ಮಾಡಬೇಕು.',
    transliteration: 'Metro smart card recharge maadabeku.',
    english: 'I need to recharge my Metro smart card.',
    contextNote: 'Use at Namma Metro customer care counter or kiosk.',
    pronunciationGuide: 'Met-ro smart card re-charge maa-da-be-ku.',
    formality: 'polite',
    situation: 'At metro token/recharge counter',
    tags: ['metro', 'recharge', 'card']
  },
  {
    id: 'pt-08',
    categoryId: 'public-transport',
    kannada: 'ಚಿಲ್ಲರೆ ಇಲ್ಲ, ಯುಪಿಐ ಮಾಡಬಹುದಾ?',
    transliteration: 'Chillare illa, UPI maadabahuda?',
    english: 'I don’t have change, can I pay via UPI?',
    contextNote: '"Chillare" means loose change / coins. Crucial for BMTC & auto rides.',
    pronunciationGuide: 'Chil-la-re il-la, U-P-I maa-da-ba-hu-daa?',
    formality: 'polite',
    situation: 'Payment negotiation when lacking coins or exact cash',
    tags: ['upi', 'change', 'chillare', 'payment']
  },
  {
    id: 'pt-09',
    categoryId: 'public-transport',
    kannada: 'ಬಸ್ ಎಷ್ಟು ಹೊತ್ತಿಗೆ ಹೊರಡುತ್ತದೆ?',
    transliteration: 'Bus eshtu hotthige horaduttade?',
    english: 'What time does the bus leave?',
    contextNote: 'Helpful at KSRTC long-distance bus stands like Shanthinagar or Majestic.',
    pronunciationGuide: 'Bus esh-tu hot-thi-ge ho-ra-dut-ta-de?',
    formality: 'polite',
    situation: 'Intercity or long-distance bus terminal',
    tags: ['departure', 'ksrtc', 'schedule', 'time']
  },
  {
    id: 'pt-10',
    categoryId: 'public-transport',
    kannada: 'ಇಂದಿರಾನಗರಕ್ಕೆ ಎಷ್ಟು ಆಗುತ್ತೆ ಅಣ್ಣಾ?',
    transliteration: 'Indiranagara-kke eshtu aagutthe anna?',
    english: 'How much will it cost to Indiranagar, brother?',
    contextNote: 'Direct fare inquiry when meter is not being used. "Aagutthe" is common spoken Bengaluru Kannada for formal "aaguttade".',
    pronunciationGuide: 'In-di-ra-na-ga-rak-ke esh-tu aa-gut-the an-naa?',
    formality: 'polite',
    situation: 'Auto fare inquiry',
    tags: ['fare', 'cost', 'auto'],
    needsDialectReview: true
  },

  // 3. SHOPPING & MARKETS (shopping-markets)
  {
    id: 'sm-01',
    categoryId: 'shopping-markets',
    kannada: 'ಇದು ಎಷ್ಟು ರೂಪಾಯಿ?',
    transliteration: 'Idu eshtu roopaayi?',
    english: 'How much is this? (What is the price?)',
    contextNote: 'The universal shopping question. Point at the item and ask.',
    pronunciationGuide: 'I-du esh-tu roo-paa-yi?',
    formality: 'polite',
    situation: 'Asking price in any shop or roadside stall',
    tags: ['price', 'cost', 'shopping', 'money'],
    variants: [
      {
        id: 'sm-01-polite',
        formality: 'polite',
        kannada: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು ಸರ್?',
        transliteration: 'Idara bele eshtu sir?',
        english: 'What is the price of this, sir?',
        usageContext: 'Courteous phrasing at retail counters and formal shops.',
        isRecommendedDefault: true
      },
      {
        id: 'sm-01-spoken',
        formality: 'casual',
        kannada: 'ಇದು ಎಷ್ಟು ಅಣ್ಣಾ?',
        transliteration: 'Idu eshtu anna?',
        english: 'How much is this, brother?',
        usageContext: 'Everyday market street phrasing at KR Market, fruit stalls, or flower vendors.'
      },
      {
        id: 'sm-01-deal',
        formality: 'casual',
        kannada: 'ಇದು ಎಷ್ಟಕ್ಕೆ ಕೊಡ್ತೀರಾ?',
        transliteration: 'Idu eshtakke kodtheera?',
        english: 'For how much will you give this?',
        usageContext: 'Opening question when preparing to negotiate in local bazaars.'
      }
    ]
  },
  {
    id: 'sm-02',
    categoryId: 'shopping-markets',
    kannada: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ ಕೊಡಿ.',
    transliteration: 'Swalpa kadime maadi kodi.',
    english: 'Please give some discount / make it a little cheaper.',
    contextNote: '"Kadime maadi kodi" is polite and very common in street markets.',
    pronunciationGuide: 'Swal-pa ka-di-me maa-di ko-di.',
    formality: 'polite',
    situation: 'Bargaining at KR Market, Commercial Street or local bazaar',
    tags: ['bargain', 'discount', 'cheaper'],
    variants: [
      {
        id: 'sm-02-polite',
        formality: 'polite',
        kannada: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ ಕೊಡಿ ಅಣ್ಣಾ.',
        transliteration: 'Swalpa kadime maadi kodi anna.',
        english: 'Please reduce a little bit, brother.',
        usageContext: 'Standard friendly bargaining in street markets.',
        isRecommendedDefault: true
      },
      {
        id: 'sm-02-idiom',
        formality: 'casual',
        kannada: 'ಸ್ವಲ್ಪ ನೋಡಿ ಮಾಡಿ ಕೊಡಿ.',
        transliteration: 'Swalpa nodi maadi kodi.',
        english: 'Please look into it and adjust the price nicely.',
        usageContext: 'Authentic local colloquial idiom widely appreciated by Bengaluru merchants.'
      },
      {
        id: 'sm-02-formal',
        formality: 'formal',
        kannada: 'ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ರಿಯಾಯಿತಿ ನೀಡಿ.',
        transliteration: 'Dayavittu swalpa riyaayiti needi.',
        english: 'Please provide some discount.',
        usageContext: 'Formal retail negotiation at established stores.'
      }
    ]
  },
  {
    id: 'sm-03',
    categoryId: 'shopping-markets',
    kannada: 'ತಾಜಾ ತರಕಾರಿಗಳು ಇವೆಯಾ?',
    transliteration: 'Taaja tharakarigalu iveya?',
    english: 'Are there fresh vegetables?',
    contextNote: 'Used at local hopcoms or vegetable vendor carts.',
    pronunciationGuide: 'Taa-jaa tha-ra-ka-ri-ga-lu i-ve-yaa?',
    formality: 'polite',
    situation: 'Morning vegetable market purchase',
    tags: ['vegetables', 'fresh', 'groceries']
  },
  {
    id: 'sm-04',
    categoryId: 'shopping-markets',
    kannada: 'ಒಂದು ಕೆಜಿ ಈರುಳ್ಳಿ ಕೊಡಿ.',
    transliteration: 'Ondu kg eerulli kodi.',
    english: 'Give one kilo of onions.',
    contextNote: 'Substitute: "Alugadde" (potato), "Tomato" (tomato), "Thenginakaayi" (coconut).',
    pronunciationGuide: 'On-du K-G ee-rul-li ko-di.',
    formality: 'polite',
    situation: 'Ordering weighed produce',
    tags: ['onions', 'vegetables', 'weight']
  },
  {
    id: 'sm-05',
    categoryId: 'shopping-markets',
    kannada: 'ಯುಪಿಐ ಕ್ಯೂಆರ್ ಕೋಡ್ ಎಲ್ಲಿದೆ?',
    transliteration: 'UPI QR code yellide?',
    english: 'Where is the UPI QR code?',
    contextNote: 'Almost every street vendor in Karnataka accepts PhonePe/GPay.',
    pronunciationGuide: 'U-P-I Q-R code yel-li-de?',
    formality: 'casual',
    situation: 'Looking for digital payment scanner',
    tags: ['upi', 'qr code', 'payment', 'phonepe']
  },
  {
    id: 'sm-06',
    categoryId: 'shopping-markets',
    kannada: 'ಇದು ಬೇರೆ ಬಣ್ಣದಲ್ಲಿ ಸಿಗುತ್ತಾ?',
    transliteration: 'Idu bere bannadalli sigutthaa?',
    english: 'Is this available in another colour?',
    contextNote: '"Banna" means colour. Helpful in clothing, footwear, and textile shops.',
    pronunciationGuide: 'I-du be-re ban-na-dal-li si-gut-thaa?',
    formality: 'polite',
    situation: 'Garment or footwear shopping',
    tags: ['colour', 'variety', 'clothing']
  },
  {
    id: 'sm-07',
    categoryId: 'shopping-markets',
    kannada: 'ಸ್ವಲ್ಪ ದೊಡ್ಡ ಸೈಜ್ ತೋರಿಸಿ.',
    transliteration: 'Swalpa dodda size thorisi.',
    english: 'Please show a slightly bigger size.',
    contextNote: 'Opposite: "Chikka size" (smaller size). "Gaathra" is formal Kannada for size.',
    pronunciationGuide: 'Swal-pa dod-da size tho-ri-si.',
    formality: 'polite',
    situation: 'Fitting clothes or shoes',
    tags: ['size', 'clothes', 'fitting']
  },
  {
    id: 'sm-08',
    categoryId: 'shopping-markets',
    kannada: 'ಬಿಲ್ ಕೊಡ್ತೀರಾ?',
    transliteration: 'Bill kodtheera?',
    english: 'Will you give a bill / receipt?',
    contextNote: 'Polite request for printed invoice or paper receipt.',
    pronunciationGuide: 'Bill kod-thee-raa?',
    formality: 'polite',
    situation: 'Retail checkout',
    tags: ['bill', 'receipt', 'tax']
  },
  {
    id: 'sm-09',
    categoryId: 'shopping-markets',
    kannada: 'ಕ್ಯಾರಿ ಬ್ಯಾಗ್ ಅಥವಾ ಚೀಲ ಇದೆಯಾ?',
    transliteration: 'Carry bag athava cheela ideya?',
    english: 'Do you have a carry bag or cloth bag?',
    contextNote: '"Cheela" is the traditional Kannada word for cloth/jute bag.',
    pronunciationGuide: 'Car-ry bag a-tha-va chee-la i-de-yaa?',
    formality: 'polite',
    situation: 'At billing counter when you forgot your bag',
    tags: ['bag', 'cheela', 'shopping']
  },
  {
    id: 'sm-10',
    categoryId: 'shopping-markets',
    kannada: 'ನನಗೆ ಇದು ಬೇಡ, ಬೇರೆ ತೋರಿಸಿ.',
    transliteration: 'Nanage idu beda, bere thorisi.',
    english: 'I don’t want this, show another one.',
    contextNote: 'Polite way to reject an item without causing offence.',
    pronunciationGuide: 'Na-na-ge i-du be-da, be-re tho-ri-si.',
    formality: 'polite',
    situation: 'Declining a product option',
    tags: ['reject', 'browse', 'options']
  },

  // 4. FOOD & RESTAURANTS (food-dining)
  {
    id: 'fd-01',
    categoryId: 'food-dining',
    kannada: 'ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ.',
    transliteration: 'Ondu masala dose matthu bisi filter coffee kodi.',
    english: 'One masala dosa and hot filter coffee please.',
    contextNote: 'The ultimate Bengaluru Darshini staple order. Pronounced "dose", not "dosa"!',
    pronunciationGuide: 'On-du ma-sa-le do-se mat-thu bi-si fil-ter cof-fee ko-di.',
    formality: 'polite',
    situation: 'Ordering breakfast at Darshini / Sagar / Udupi hotel',
    tags: ['dosa', 'coffee', 'darshini', 'breakfast'],
    variants: [
      {
        id: 'fd-01-polite',
        formality: 'polite',
        kannada: 'ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಕಾಫಿ ಕೊಡಿ.',
        transliteration: 'Ondu masala dose matthu coffee kodi.',
        english: 'Please give one masala dosa and coffee.',
        usageContext: 'Standard courteous request at Darshini counters.',
        isRecommendedDefault: true
      },
      {
        id: 'fd-01-formal',
        formality: 'formal',
        kannada: 'ದಯವಿಟ್ಟು ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ ಸರ್.',
        transliteration: 'Dayavittu ondu masala dose matthu filter coffee kodi sir.',
        english: 'Please give one masala dosa and filter coffee, sir.',
        usageContext: 'Extra-polite formal request to service staff or restaurant captain.'
      },
      {
        id: 'fd-01-casual',
        formality: 'casual',
        kannada: 'ನನಗೊಂದು ದೋಸೆ ಕೊಡು.',
        transliteration: 'Nanagondu dose kodu.',
        english: 'Give me one dosa (informal).',
        usageContext: 'Use only among intimate family or peers; strictly avoid with restaurant staff.'
      }
    ]
  },
  {
    id: 'fd-02',
    categoryId: 'food-dining',
    kannada: 'ಸ್ವಲ್ಪ ಖಾರ ಕಡಿಮೆ ಮಾಡಿ.',
    transliteration: 'Swalpa khaara kadime maadi.',
    english: 'Please make it less spicy.',
    contextNote: 'Essential for those sensitive to South Indian green chillies and pepper.',
    pronunciationGuide: 'Swal-pa khaa-ra ka-di-me maa-di.',
    formality: 'polite',
    situation: 'Giving special cooking preference to waiter',
    tags: ['spicy', 'food', 'preference', 'mild'],
    variants: [
      {
        id: 'fd-02-polite',
        formality: 'polite',
        kannada: 'ಸ್ವಲ್ಪ ಖಾರ ಕಡಿಮೆ ಮಾಡಿ.',
        transliteration: 'Swalpa khaara kadime maadi.',
        english: 'Please make it less spicy.',
        usageContext: 'Polite instruction to kitchen or counter staff.',
        isRecommendedDefault: true
      },
      {
        id: 'fd-02-bengaluru',
        formality: 'casual',
        kannada: 'ಖಾರ ಕಮ್ಮಿ ಇರಲಿ ಅಣ್ಣಾ.',
        transliteration: 'Khaara kammi irali anna.',
        english: 'Let the spice be mild brother.',
        usageContext: 'Everyday Bengaluru spoken phrasing at local food joints.'
      },
      {
        id: 'fd-02-mild',
        formality: 'polite',
        kannada: 'ಖಾರ ಜಾಸ್ತಿ ಹಾಕಬೇಡಿ, ಮೀಡಿಯಂ ಮಾಡಿ.',
        transliteration: 'Khaara jaasti haakabedi, medium maadi.',
        english: 'Do not add too much spice, please make it medium.',
        usageContext: 'Clear specification when ordering for children or spice-sensitive guests.'
      }
    ]
  },
  {
    id: 'fd-03',
    categoryId: 'food-dining',
    kannada: 'ಕುಡಿಯಲು ಬಿಸಿ ನೀರು ಸಿಗುತ್ತಾ?',
    transliteration: 'Kudiyalu bisi neeru sigutthaa?',
    english: 'Can I get warm / hot drinking water?',
    contextNote: 'Many Karnataka restaurants readily serve boiled warm water upon request.',
    pronunciationGuide: 'Ku-di-ya-lu bi-si nee-ru si-gut-thaa?',
    formality: 'polite',
    situation: 'Seated at a dining table',
    tags: ['water', 'warm water', 'drink']
  },
  {
    id: 'fd-04',
    categoryId: 'food-dining',
    kannada: 'ಇಲ್ಲಿ ಸ್ಪೆಷಲ್ ಊಟ ಏನು?',
    transliteration: 'Illi special oota yenu?',
    english: 'What is the special meal / dish here?',
    contextNote: '"Oota" means full meal (thali / lunch / dinner).',
    pronunciationGuide: 'Il-li spe-cial oo-ta ye-nu?',
    formality: 'polite',
    situation: 'Asking waiter for menu recommendations',
    tags: ['special', 'meals', 'oota', 'recommendation']
  },
  {
    id: 'fd-05',
    categoryId: 'food-dining',
    kannada: 'ಬಿಲ್ ತನ್ನಿ, ಕೈ ತೊಳೆಯುವ ಜಾಗ ಎಲ್ಲಿದೆ?',
    transliteration: 'Bill tanni, kai tholeyuva jaaga yellide?',
    english: 'Bring the bill, and where is the handwash area?',
    contextNote: 'Traditional restaurants have a dedicated washbasin corner.',
    pronunciationGuide: 'Bill tan-ni, kai tho-le-yu-va jaa-ga yel-li-de?',
    formality: 'polite',
    situation: 'After finishing your meal',
    tags: ['bill', 'handwash', 'checkout']
  },
  {
    id: 'fd-06',
    categoryId: 'food-dining',
    kannada: 'ಪಾರ್ಸಲ್ ಕಟ್ಟಿ ಕೊಡಿ.',
    transliteration: 'Parcel katti kodi.',
    english: 'Please pack it for takeaway / parcel.',
    contextNote: '"Katti kodi" literally means "tie/pack and give".',
    pronunciationGuide: 'Par-cel kat-ti ko-di.',
    formality: 'polite',
    situation: 'Ordering food to go',
    tags: ['takeaway', 'parcel', 'packing']
  },
  {
    id: 'fd-07',
    categoryId: 'food-dining',
    kannada: 'ಸಾಂಬಾರ್ ಸ್ವಲ್ಪ ಜಾಸ್ತಿ ಹಾಕಿ.',
    transliteration: 'Sambar swalpa jaasti haaki.',
    english: 'Please pour a little more sambar.',
    contextNote: 'Free sambar refills are customary with idli-vada in Darshinis!',
    pronunciationGuide: 'Saam-baar swal-pa jaas-ti haa-ki.',
    formality: 'polite',
    situation: 'Counter food refill',
    tags: ['sambar', 'extra', 'darshini']
  },
  {
    id: 'fd-08',
    categoryId: 'food-dining',
    kannada: 'ಇದು ಸಸ್ಯಾಹಾರ ಹೋಟೆಲ್ ಅಲ್ವಾ?',
    transliteration: 'Idu sasyaahaara hotel alva?',
    english: 'This is a vegetarian restaurant, right?',
    contextNote: '"Sasyaahaara" means pure vegetarian; "Mamsaahaara" means non-vegetarian.',
    pronunciationGuide: 'I-du sas-yaa-haa-ra ho-tel al-vaa?',
    formality: 'polite',
    situation: 'Confirming dietary restriction',
    tags: ['veg', 'vegetarian', 'diet']
  },
  {
    id: 'fd-09',
    categoryId: 'food-dining',
    kannada: 'ಉಪ್ಪು ಸ್ವಲ್ಪ ಕಡಿಮೆ ಇದೆ.',
    transliteration: 'Uppu swalpa kadime ide.',
    english: 'Salt is a bit less.',
    contextNote: 'Use to request extra salt container: "Uppu kodi" (Give salt).',
    pronunciationGuide: 'Up-pu swal-pa ka-di-me i-de.',
    formality: 'casual',
    situation: 'Tasting food',
    tags: ['salt', 'taste', 'seasoning']
  },
  {
    id: 'fd-10',
    categoryId: 'food-dining',
    kannada: 'ತಿಂಡಿ ತುಂಬಾ ರುಚಿಯಾಗಿದೆ!',
    transliteration: 'Thindi thumba ruchiyaagide!',
    english: 'The snack / food is very delicious!',
    contextNote: 'Saying this will bring a huge smile to the hotel chef or server.',
    pronunciationGuide: 'Thin-di thum-ba ru-chi-yaa-gi-de!',
    formality: 'polite',
    situation: 'Complimenting the food and staff',
    tags: ['delicious', 'compliment', 'tasty']
  },

  // 5. HEALTHCARE & MEDICAL (healthcare)
  {
    id: 'hc-01',
    categoryId: 'healthcare',
    kannada: 'ನನಗೆ ತಲೆನೋವು ಮತ್ತು ಜ್ವರ ಬಂದಿದೆ.',
    transliteration: 'Nanage thalenoovu matthu jwara bandide.',
    english: 'I have a headache and fever.',
    contextNote: '"Thalenoovu" = headache, "Jwara" = fever.',
    pronunciationGuide: 'Na-na-ge tha-le-noo-vu mat-thu jwa-ra ban-di-de.',
    formality: 'polite',
    situation: 'Describing symptoms at clinic or pharmacy',
    tags: ['headache', 'fever', 'illness', 'doctor']
  },
  {
    id: 'hc-02',
    categoryId: 'healthcare',
    kannada: 'ಹತ್ತಿರದ ಔಷಧಿ ಅಂಗಡಿ ಎಲ್ಲಿದೆ?',
    transliteration: 'Hatthirada aushadhi angadi yellide?',
    english: 'Where is the nearest medical shop / pharmacy?',
    contextNote: '"Aushadhi angadi" means medicine shop; most locals also understand "medical store".',
    pronunciationGuide: 'Hat-thi-ra-da au-sha-dhi an-ga-di yel-li-de?',
    formality: 'polite',
    situation: 'Looking for a pharmacy to purchase drugs',
    tags: ['pharmacy', 'chemist', 'medicine'],
    variants: [
      {
        id: 'hc-02-polite',
        formality: 'polite',
        kannada: 'ಹತ್ತಿರದ ಔಷಧಿ ಅಂಗಡಿ ಎಲ್ಲಿದೆ?',
        transliteration: 'Hatthirada aushadhi angadi yellide?',
        english: 'Where is the nearest medical shop / pharmacy?',
        usageContext: 'Standard courteous inquiry for pharmacy.',
        isRecommendedDefault: true
      },
      {
        id: 'hc-02-spoken',
        formality: 'casual',
        kannada: 'ಇಲ್ಲಿ ಹತ್ತಿರ ಮೆಡಿಕಲ್ ಶಾಪ್ ಎಲ್ಲಿದೆ ಅಣ್ಣಾ?',
        transliteration: 'Illi hathira medical shop yellide anna?',
        english: 'Where is the medical shop near here, brother?',
        usageContext: 'Most natural everyday spoken asking style on Bengaluru streets.'
      },
      {
        id: 'hc-02-formal',
        formality: 'formal',
        kannada: 'ದಯವಿಟ್ಟು ಸಮೀಪದ ಔಷಧಾಲಯ ಎಲ್ಲಿದೆ ಎಂದು ತಿಳಿಸಿ.',
        transliteration: 'Dayavittu sameepada aushadhaalaya yellide yendu thilisi.',
        english: 'Please inform me where the nearest pharmacy is located.',
        usageContext: 'Formal, literary Kannada query.'
      }
    ]
  },
  {
    id: 'hc-03',
    categoryId: 'healthcare',
    kannada: 'ಡಾಕ್ಟರ್ ಯಾವಾಗ ಸಿಗುತ್ತಾರೆ?',
    transliteration: 'Doctor yaavaaga sigutthaare?',
    english: 'When will the doctor be available?',
    contextNote: 'Used at nursing homes or consultation clinics.',
    pronunciationGuide: 'Doc-tor yaa-vaa-ga si-gut-thaa-re?',
    formality: 'formal',
    situation: 'Inquiring doctor visiting hours',
    tags: ['doctor', 'timing', 'appointment']
  },
  {
    id: 'hc-04',
    categoryId: 'healthcare',
    kannada: 'ಹೊಟ್ಟೆ ನೋವಿಗೆ ಮಾತ್ರೆ ಇದೆಯಾ?',
    transliteration: 'Hotte novige maathre ideya?',
    english: 'Is there a tablet for stomach ache?',
    contextNote: '"Maathre" is the Kannada word for tablet / pill.',
    pronunciationGuide: 'Hot-te no-vi-ge maath-re i-de-yaa?',
    formality: 'polite',
    situation: 'Buying over-the-counter medication',
    tags: ['stomach', 'tablet', 'pharmacy']
  },
  {
    id: 'hc-05',
    categoryId: 'healthcare',
    kannada: 'ಈ ಔಷಧಿಯನ್ನು ಊಟದ ನಂತರ ತಗೋಬೇಕಾ?',
    transliteration: 'Ee aushadhiyannu ootada nanthara thagobeka?',
    english: 'Should I take this medicine after food?',
    contextNote: '"Ootada nanthara" = after food; "Ootada munche" = before food.',
    pronunciationGuide: 'Ee au-sha-dhi-yan-nu oo-ta-da nan-tha-ra tha-go-be-kaa?',
    formality: 'polite',
    situation: 'Clarifying drug dosage timings',
    tags: ['dosage', 'prescription', 'food']
  },
  {
    id: 'hc-06',
    categoryId: 'healthcare',
    kannada: 'ನನಗೆ ಅಲರ್ಜಿ ಇದೆ, ಬೇರೆ ಔಷಧಿ ಕೊಡಿ.',
    transliteration: 'Nanage allergy ide, bere aushadhi kodi.',
    english: 'I have an allergy, give another medicine.',
    contextNote: 'Important safety communication when pharmacist offers alternates.',
    pronunciationGuide: 'Na-na-ge al-ler-gy i-de, be-re au-sha-dhi ko-di.',
    formality: 'polite',
    situation: 'Highlighting medicinal sensitivity',
    tags: ['allergy', 'caution', 'medical']
  },
  {
    id: 'hc-07',
    categoryId: 'healthcare',
    kannada: 'ಬಿಪಿ ಮತ್ತು ಶುಗರ್ ಪರೀಕ್ಷೆ ಮಾಡಿಸಬೇಕು.',
    transliteration: 'BP matthu sugar pareekshe maadisabeku.',
    english: 'I need to get my blood pressure and sugar checked.',
    contextNote: '"Pareekshe" means test / checkup.',
    pronunciationGuide: 'B-P mat-thu su-gar pa-reek-she maa-di-sa-be-ku.',
    formality: 'polite',
    situation: 'At diagnostic center or clinic reception',
    tags: ['bp', 'sugar', 'blood test', 'lab']
  },
  {
    id: 'hc-08',
    categoryId: 'healthcare',
    kannada: 'ನನಗೆ ಉಸಿರಾಡಲು ಸ್ವಲ್ಪ ಕಷ್ಟವಾಗುತ್ತಿದೆ.',
    transliteration: 'Nanage usiraadalu swalpa kashtavaagutthide.',
    english: 'I am finding it a little difficult to breathe.',
    contextNote: 'Critical clinical symptom requiring immediate medical attention.',
    pronunciationGuide: 'Na-na-ge u-si-raa-da-lu swal-pa kash-ta-vaa-gut-thi-de.',
    formality: 'polite',
    situation: 'Urgent hospital triage consultation',
    tags: ['breathing', 'asthma', 'emergency']
  },
  {
    id: 'hc-09',
    categoryId: 'healthcare',
    kannada: 'ದಯವಿಟ್ಟು ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆಯಿರಿ.',
    transliteration: 'Dayavittu ambulance kareyiri.',
    english: 'Please call an ambulance.',
    contextNote: 'Emergency helpline number for ambulance in Karnataka is 108 or 112.',
    pronunciationGuide: 'Da-ya-vit-tu am-bu-lance ka-re-yi-ri.',
    formality: 'polite',
    situation: 'Medical emergency',
    tags: ['ambulance', '108', '112', 'emergency']
  },
  {
    id: 'hc-10',
    categoryId: 'healthcare',
    kannada: 'ದಿನಕ್ಕೆ ಎಷ್ಟು ಸಲ ಈ ಮಾತ್ರೆ ತಗೋಬೇಕು?',
    transliteration: 'Dinakke eshtu sala ee maathre thagobeku?',
    english: 'How many times a day should I take this tablet?',
    contextNote: 'Common answer: "Eradu sala" (two times), "Mooru sala" (three times).',
    pronunciationGuide: 'Di-nak-ke esh-tu sa-la ee maath-re tha-go-be-ku?',
    formality: 'polite',
    situation: 'Confirming tablet schedule with pharmacist',
    tags: ['schedule', 'dosage', 'frequency']
  },

  // 6. EMERGENCIES (emergencies)
  {
    id: 'em-01',
    categoryId: 'emergencies',
    kannada: 'ದಯವಿಟ್ಟು ಬೇಗ ಸಹಾಯ ಮಾಡಿ!',
    transliteration: 'Dayavittu bega sahaaya maadi!',
    english: 'Please help quickly!',
    contextNote: 'Universal distress call that commands immediate crowd attention.',
    pronunciationGuide: 'Da-ya-vit-tu be-ga sa-haa-ya maa-di!',
    formality: 'polite',
    situation: 'Crisis or distress requiring immediate assistance',
    tags: ['urgent', 'help', 'danger', 'sos']
  },
  {
    id: 'em-02',
    categoryId: 'emergencies',
    kannada: 'ಪೊಲೀಸ್ ಠಾಣೆ ಎಲ್ಲಿದೆ?',
    transliteration: 'Police thaane yellide?',
    english: 'Where is the police station?',
    contextNote: '"Police thaane" is formal Kannada; "police station" is also widely understood.',
    pronunciationGuide: 'Po-lice thaa-ne yel-li-de?',
    formality: 'polite',
    situation: 'Reporting incident or theft',
    tags: ['police', 'station', 'report']
  },
  {
    id: 'em-03',
    categoryId: 'emergencies',
    kannada: 'ನನ್ನ ಮೊಬೈಲ್ ಮತ್ತು ಪರ್ಸ್ ಕಳೆದುಹೋಗಿದೆ.',
    transliteration: 'Nanna mobile matthu purse kaleduhogide.',
    english: 'My phone and purse are lost / missing.',
    contextNote: 'Necessary phrase when filing an e-lost report with Bengaluru police.',
    pronunciationGuide: 'Nan-na mo-bile mat-thu purse ka-le-du-ho-gi-de.',
    formality: 'polite',
    situation: 'Lost property report',
    tags: ['lost', 'phone', 'purse', 'wallet']
  },
  {
    id: 'em-04',
    categoryId: 'emergencies',
    kannada: 'ಇಲ್ಲಿ ಅಪಘಾತ ಆಗಿದೆ.',
    transliteration: 'Illi apaghaatha aagide.',
    english: 'An accident has happened here.',
    contextNote: '"Apaghaatha" means accident. Locals also readily understand "accident".',
    pronunciationGuide: 'Il-li a-pa-ghaa-tha aa-gi-de.',
    formality: 'casual',
    situation: 'Roadside accident or collision',
    tags: ['accident', 'crash', 'police']
  },
  {
    id: 'em-05',
    categoryId: 'emergencies',
    kannada: 'ದಯವಿಟ್ಟು ಪೊಲೀಸ್ ಅಥವಾ 112 ಗೆ ಕರೆ ಮಾಡಿ.',
    transliteration: 'Dayavittu police athava 112 ge kare maadi.',
    english: 'Please call the police or 112.',
    contextNote: '112 is the unified all-India emergency response support system (ERSS).',
    pronunciationGuide: 'Da-ya-vit-tu po-lice a-tha-va 112 ge ka-re maa-di.',
    formality: 'polite',
    situation: 'Urgent emergency services request',
    tags: ['112', 'police', 'call', 'emergency']
  },
  {
    id: 'em-06',
    categoryId: 'emergencies',
    kannada: 'ನನಗೆ ತುರ್ತು ಸಹಾಯ ಬೇಕಾಗಿದೆ.',
    transliteration: 'Nanage thurtu sahaaya bekaagide.',
    english: 'I need urgent emergency help.',
    contextNote: '"Thurtu" means urgent / emergency.',
    pronunciationGuide: 'Na-na-ge thur-tu sa-haa-ya be-kaa-gi-de.',
    formality: 'formal',
    situation: 'Formal request for emergency aid',
    tags: ['urgent', 'emergency', 'help']
  },
  {
    id: 'em-07',
    categoryId: 'emergencies',
    kannada: 'ನನ್ನನ್ನು ಯಾರೋ ಹಿಂಬಾಲಿಸುತ್ತಿದ್ದಾರೆ, ರಕ್ಷಿಸಿ.',
    transliteration: 'Nannannu yaaroo himbaalisutthiddaare, rakshisi.',
    english: 'Someone is following me, please protect me.',
    contextNote: 'Crucial safety phrase if feeling threatened or stalked in public.',
    pronunciationGuide: 'Nan-nan-nu yaa-roo him-baa-li-sut-thid-daa-re, rak-shi-si.',
    formality: 'polite',
    situation: 'Personal safety / harassment protection',
    tags: ['safety', 'stalking', 'security', 'women safety']
  },
  {
    id: 'em-08',
    categoryId: 'emergencies',
    kannada: 'ಬೆಂಕಿ ಬಿದ್ದಿದೆ, ಫೈರ್ ಬ್ರಿಗೇಡ್ ಕರೆಯಿರಿ.',
    transliteration: 'Benki biddide, fire brigade kareyiri.',
    english: 'A fire has broken out, call the fire brigade.',
    contextNote: 'Karnataka Fire and Emergency services number is 101 or 112.',
    pronunciationGuide: 'Ben-ki bid-di-de, fire bri-gade ka-re-yi-ri.',
    formality: 'polite',
    situation: 'Fire hazard reporting',
    tags: ['fire', '101', 'brigade', 'hazard']
  },
  {
    id: 'em-09',
    categoryId: 'emergencies',
    kannada: 'ನನಗೆ ದಾರಿ ಗೊತ್ತಿಲ್ಲ, ನಾನು ಕಳೆದುಹೋಗಿದ್ದೇನೆ.',
    transliteration: 'Nanage daari gotthilla, naanu kaleduhogiddene.',
    english: 'I don’t know the way, I am lost.',
    contextNote: 'Simple, candid phrase that locals will compassionately respond to.',
    pronunciationGuide: 'Na-na-ge daa-ri got-thil-la, naa-nu ka-le-du-ho-gid-dee-ne.',
    formality: 'casual',
    situation: 'Being stranded in unfamiliar area',
    tags: ['lost', 'directions', 'help']
  },
  {
    id: 'em-10',
    categoryId: 'emergencies',
    kannada: 'ಶಾಂತರಾಗಿರಿ, ಎಲ್ಲವೂ ಸರಿಯಾಗುತ್ತದೆ.',
    transliteration: 'Shaantharaagiri, yellavoo sariyaagutthe.',
    english: 'Stay calm, everything will be alright.',
    contextNote: 'Calming assurance phrase to de-escalate tension or panic.',
    pronunciationGuide: 'Shaan-tha-raa-gi-ri, yel-la-voo sa-ri-yaa-gut-the.',
    formality: 'polite',
    situation: 'Comforting someone in distress',
    tags: ['calm', 'reassurance', 'comfort']
  },

  // 7. EDUCATION & CAMPUS (education-campus)
  {
    id: 'ed-01',
    categoryId: 'education-campus',
    kannada: 'ಗ್ರಂಥಾಲಯ ಎಷ್ಟು ಗಂಟೆಗೆ ಮುಚ್ಚುತ್ತಾರೆ?',
    transliteration: 'Granthaalaya eshtu gantege mucchutthaare?',
    english: 'What time does the library close?',
    contextNote: '"Granthaalaya" is formal Kannada; "library" is widely used by students.',
    pronunciationGuide: 'Gran-thaa-la-ya esh-tu gan-te-ge muc-chut-thaa-re?',
    formality: 'polite',
    situation: 'Checking campus library operational hours',
    tags: ['library', 'study', 'hours', 'campus']
  },
  {
    id: 'ed-02',
    categoryId: 'education-campus',
    kannada: 'ಪ್ರೊಫೆಸರ್ ಅವರ ಕೊಠಡಿ ಎಲ್ಲಿದೆ?',
    transliteration: 'Professor avara kothadi yellide?',
    english: 'Where is the professor’s cabin / room?',
    contextNote: 'Using "avara" shows respect towards teachers.',
    pronunciationGuide: 'Pro-fes-sor a-va-ra ko-tha-di yel-li-de?',
    formality: 'formal',
    situation: 'Navigating academic department',
    tags: ['professor', 'faculty', 'cabin']
  },
  {
    id: 'ed-03',
    categoryId: 'education-campus',
    kannada: 'ನನಗೆ ಈ ನೋಟ್ಸ್ ಜೆರಾಕ್ಸ್ ಮಾಡಿಕೊಳ್ಳಲು ಕೊಡ್ತೀರಾ?',
    transliteration: 'Nanage ee notes xerox maadikollalu kodtheera?',
    english: 'Will you lend me these notes to make photocopies?',
    contextNote: 'Quintessential Indian college phrase for borrowing class notes.',
    pronunciationGuide: 'Na-na-ge ee notes xe-rox maa-di-kol-la-lu kod-thee-raa?',
    formality: 'polite',
    situation: 'Asking a classmate for study material',
    tags: ['notes', 'xerox', 'classmate', 'study']
  },
  {
    id: 'ed-04',
    categoryId: 'education-campus',
    kannada: 'ಪರೀಕ್ಷಾ ಹಾಲ್ ಎಲ್ಲಿದೆ?',
    transliteration: 'Pareekshaa hall yellide?',
    english: 'Where is the examination hall?',
    contextNote: '"Pareekshe" means exam.',
    pronunciationGuide: 'Pa-reek-shaa hall yel-li-de?',
    formality: 'polite',
    situation: 'On exam morning looking for assigned block',
    tags: ['exam', 'hall', 'campus']
  },
  {
    id: 'ed-05',
    categoryId: 'education-campus',
    kannada: 'ಈ ಅಸೈನ್‌ಮೆಂಟ್ ಸಲ್ಲಿಸಲು ಕೊನೆಯ ದಿನಾಂಕ ಯಾವಾಗ?',
    transliteration: 'Ee assignment sallisalu koneya dinaanka yaavaaga?',
    english: 'When is the deadline / last date to submit this assignment?',
    contextNote: '"Koneya dinaanka" means final deadline / last date.',
    pronunciationGuide: 'Ee as-sign-ment sal-li-sa-lu ko-ne-ya di-naan-ka yaa-vaa-ga?',
    formality: 'polite',
    situation: 'Clarifying academic deadline with peers',
    tags: ['assignment', 'deadline', 'submission']
  },
  {
    id: 'ed-06',
    categoryId: 'education-campus',
    kannada: 'ಕ್ಲಾಸ್ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ?',
    transliteration: 'Class yaavaaga praarambhavaagutthe?',
    english: 'When does the class start?',
    contextNote: '"Praarambha" means start / beginning.',
    pronunciationGuide: 'Class yaa-vaa-ga praa-ram-bha-vaa-gut-the?',
    formality: 'polite',
    situation: 'Schedule query with classmate',
    tags: ['class', 'timetable', 'timing']
  },
  {
    id: 'ed-07',
    categoryId: 'education-campus',
    kannada: 'ಕ್ಯಾಂಟೀನ್ ಯಾವ ಕಡೆ ಇದೆ?',
    transliteration: 'Canteen yaava kade ide?',
    english: 'Which side is the campus canteen?',
    contextNote: 'Freshman staple question on college campus.',
    pronunciationGuide: 'Can-teen yaa-va ka-de i-de?',
    formality: 'casual',
    situation: 'Locating student dining hall',
    tags: ['canteen', 'food', 'campus']
  },
  {
    id: 'ed-08',
    categoryId: 'education-campus',
    kannada: 'ಕನ್ನಡ ಕಲಿಯಲು ನನಗೆ ಸ್ವಲ್ಪ ಸಹಾಯ ಮಾಡ್ತೀರಾ?',
    transliteration: 'Kannada kaliyalu nanage swalpa sahaaya maadtheera?',
    english: 'Will you help me a little with learning Kannada?',
    contextNote: 'Local college students love helping peer non-native speakers pick up Kannada.',
    pronunciationGuide: 'Kan-na-da ka-li-ya-lu na-na-ge swal-pa sa-haa-ya maad-thee-raa?',
    formality: 'polite',
    situation: 'Peer language learning partnership',
    tags: ['learning', 'friendship', 'language']
  },
  {
    id: 'ed-09',
    categoryId: 'education-campus',
    kannada: 'ನನ್ನ ಐಡಿ ಕಾರ್ಡ್ ಕಳೆದುಹೋಗಿದೆ, ಹೊಸದು ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?',
    transliteration: 'Nanna ID card kaleduhogide, hosadu yelli sigutthe?',
    english: 'I lost my student ID card, where do I get a new one?',
    contextNote: 'Inquire at administrative block or registrar office.',
    pronunciationGuide: 'Nan-na I-D card ka-le-du-ho-gi-de, ho-sa-du yel-li si-gut-the?',
    formality: 'polite',
    situation: 'Admin desk query',
    tags: ['id card', 'admin', 'student']
  },
  {
    id: 'ed-10',
    categoryId: 'education-campus',
    kannada: 'ಇವತ್ತು ರಜೆ ಇದೆಯಾ?',
    transliteration: 'Ivatthu raje ideya?',
    english: 'Is today a holiday?',
    contextNote: '"Raje" means holiday / day off.',
    pronunciationGuide: 'I-vat-thu ra-je i-de-yaa?',
    formality: 'casual',
    situation: 'Checking if campus is closed due to festival or bandh',
    tags: ['holiday', 'raje', 'leave']
  },

  // 8. WORKPLACE & OFFICE (workplace)
  {
    id: 'wp-01',
    categoryId: 'workplace',
    kannada: 'ಶುಭೋದಯ! ಹೇಗಿದ್ದೀರಾ?',
    transliteration: 'Shubhodaya! Hegiddeera?',
    english: 'Good morning! How are you?',
    contextNote: 'Classic polite Kannada greeting for colleagues entering the office.',
    pronunciationGuide: 'Shu-bho-da-ya! He-gid-dee-raa?',
    formality: 'polite',
    situation: 'Morning greeting to teammates or manager',
    tags: ['greeting', 'morning', 'courtesy', 'office']
  },
  {
    id: 'wp-02',
    categoryId: 'workplace',
    kannada: 'ಮೀಟಿಂಗ್ ಎಷ್ಟು ಗಂಟೆಗೆ ಆರಂಭವಾಗುತ್ತದೆ?',
    transliteration: 'Meeting eshtu gantege aarambhavaagutthe?',
    english: 'What time does the meeting start?',
    contextNote: 'Helpful for syncs and standups.',
    pronunciationGuide: 'Mee-ting esh-tu gan-te-ge aa-ram-bha-vaa-gut-the?',
    formality: 'polite',
    situation: 'Checking meeting schedule',
    tags: ['meeting', 'schedule', 'office']
  },
  {
    id: 'wp-03',
    categoryId: 'workplace',
    kannada: 'ಊಟಕ್ಕೆ ಹೋಗೋಣ್ವಾ?',
    transliteration: 'Ootakke hogonvaa?',
    english: 'Shall we go for lunch?',
    contextNote: 'Friendly invitation to office colleagues for cafeteria lunch. The suffix "-ಣ್ವಾ" (-nvaa) is colloquial Bengaluru spoken Kannada.',
    pronunciationGuide: 'Oo-tak-ke ho-gon-vaa?',
    formality: 'casual',
    situation: 'Lunch break coordination with coworkers',
    tags: ['lunch', 'oota', 'break', 'team'],
    needsDialectReview: true,
    needsSpeakerReview: true
  },
  {
    id: 'wp-04',
    categoryId: 'workplace',
    kannada: 'ನಾನು ಒಂದು ದಿನ ರಜೆ ತೆಗೆದುಕೊಳ್ಳಬಹುದಾ?',
    transliteration: 'Naanu ondu dina raje thegedukollabahuda?',
    english: 'Can I take one day of leave?',
    contextNote: 'Polite request to manager or team lead. "Raje" means leave / holiday.',
    pronunciationGuide: 'Naa-nu on-du di-na ra-je the-ge-du-kol-la-ba-hu-daa?',
    formality: 'formal',
    situation: 'Requesting casual leave approval',
    tags: ['leave', 'holiday', 'manager', 'approval']
  },
  {
    id: 'wp-05',
    categoryId: 'workplace',
    kannada: 'ಈ ಕೆಲಸವನ್ನು ಇವತ್ತೇ ಮುಗಿಸುತ್ತೇನೆ.',
    transliteration: 'Ee kelasavannu ivatthe mugisutthene.',
    english: 'I will finish this task today itself.',
    contextNote: 'Demonstrates accountability and proactive commitment.',
    pronunciationGuide: 'Ee ke-la-sa-van-nu i-vat-the mu-gi-sut-the-ne.',
    formality: 'polite',
    situation: 'Commitment update to team lead',
    tags: ['work', 'deadline', 'commitment']
  },
  {
    id: 'wp-06',
    categoryId: 'workplace',
    kannada: 'ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ತುಂಬಾ ಧನ್ಯವಾದಗಳು.',
    transliteration: 'Nimma sahaayakke thumba dhanyavaadagalu.',
    english: 'Thank you very much for your help.',
    contextNote: '"Dhanyavaadagalu" is the formal Kannada expression for Thank You.',
    pronunciationGuide: 'Nim-ma sa-haa-yak-ke thum-ba dhan-ya-vaa-da-ga-lu.',
    formality: 'formal',
    situation: 'Expressing gratitude to peers or support team',
    tags: ['thank you', 'gratitude', 'polite']
  },
  {
    id: 'wp-07',
    categoryId: 'workplace',
    kannada: 'ದಯವಿಟ್ಟು ಈ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ.',
    transliteration: 'Dayavittu ee email parisheelisi.',
    english: 'Please review / check this email.',
    contextNote: '"Parisheelisi" means inspect / examine.',
    pronunciationGuide: 'Da-ya-vit-tu ee e-mail pa-ri-shee-li-si.',
    formality: 'formal',
    situation: 'Email follow-up with supervisor',
    tags: ['email', 'review', 'colleague']
  },
  {
    id: 'wp-08',
    categoryId: 'workplace',
    kannada: 'ನನಗೆ ಈ ವಿಷಯ ಅರ್ಥವಾಗಲಿಲ್ಲ, ಮತ್ತೊಮ್ಮೆ ಹೇಳಿ.',
    transliteration: 'Nanage ee vishaya arthavaagalilla, matthomme heli.',
    english: 'I did not understand this topic, please explain again.',
    contextNote: 'Polite and clear when onboarding or reviewing architectural specs.',
    pronunciationGuide: 'Na-na-ge ee vi-sha-ya ar-tha-vaa-ga-lil-la, mat-thom-me he-li.',
    formality: 'polite',
    situation: 'Clarifying instructions during sprint planning',
    tags: ['clarification', 'understanding', 'questions']
  },
  {
    id: 'wp-09',
    categoryId: 'workplace',
    kannada: 'ಟೀ ಬ್ರೇಕ್ ತಗೊಳ್ಳೋಣ್ವಾ?',
    transliteration: 'Tea break thagollonvaa?',
    english: 'Shall we take a quick tea / coffee break?',
    contextNote: 'Very casual, common team bonding prompt around 4 PM. Colloquial Bengaluru office usage.',
    pronunciationGuide: 'Tea break tha-gol-lon-vaa?',
    formality: 'casual',
    situation: 'Afternoon refreshments with teammates',
    tags: ['tea', 'break', 'chai', 'coffee'],
    needsDialectReview: true,
    needsSpeakerReview: true
  },
  {
    id: 'wp-10',
    categoryId: 'workplace',
    kannada: 'ನಾಳೆ ಸಿಗೋಣ, ಬಾಯ್!',
    transliteration: 'Naale sigona, bye!',
    english: 'See you tomorrow, bye!',
    contextNote: '"Naale sigona" is warm and friendly when wrapping up for the day.',
    pronunciationGuide: 'Naa-le si-go-na, bye!',
    formality: 'casual',
    situation: 'Evening sign-off leaving office',
    tags: ['farewell', 'tomorrow', 'goodbye']
  },

  // 9. ACCOMMODATION & DAILY NEEDS (accommodation-daily)
  {
    id: 'ad-01',
    categoryId: 'accommodation-daily',
    kannada: 'ಇಲ್ಲಿ 2BHK ಬಾಡಿಗೆ ಮನೆ ಇದೆಯಾ?',
    transliteration: 'Illi 2BHK baadige mane ideya?',
    english: 'Is there a 2BHK rental house available here?',
    contextNote: '"Baadige mane" = rental house.',
    pronunciationGuide: 'Il-li 2-B-H-K baa-di-ge ma-ne i-de-yaa?',
    formality: 'polite',
    situation: 'House hunting in residential layouts (Jayanagar, Indiranagar, HSR)',
    tags: ['rent', 'house', 'flat', 'apartment']
  },
  {
    id: 'ad-02',
    categoryId: 'accommodation-daily',
    kannada: 'ತಿಂಗಳಿಗೆ ಬಾಡಿಗೆ ಎಷ್ಟು ಮತ್ತು ಅಡ್ವಾನ್ಸ್ ಎಷ್ಟು?',
    transliteration: 'Thingalige baadige eshtu matthu advance eshtu?',
    english: 'How much is the monthly rent and deposit/advance?',
    contextNote: 'Advance in Bengaluru is historically discussed upfront.',
    pronunciationGuide: 'Thin-ga-li-ge baa-di-ge esh-tu mat-thu ad-vance esh-tu?',
    formality: 'formal',
    situation: 'Negotiating rental contract terms with landlord',
    tags: ['rent', 'deposit', 'advance', 'money']
  },
  {
    id: 'ad-03',
    categoryId: 'accommodation-daily',
    kannada: 'ನೀರು ಮತ್ತು ಕರೆಂಟ್ 24 ಗಂಟೆ ಬರುತ್ತಾ?',
    transliteration: 'Neeru matthu current 24 gante barutthaa?',
    english: 'Is water and electricity available 24 hours?',
    contextNote: 'Crucial verification question regarding Cauvery water and BESCOM backup.',
    pronunciationGuide: 'Nee-ru mat-thu cur-rent 24 gan-te ba-rut-thaa?',
    formality: 'polite',
    situation: 'Checking residential utilities quality',
    tags: ['water', 'electricity', 'power', 'bescom']
  },
  {
    id: 'ad-04',
    categoryId: 'accommodation-daily',
    kannada: 'ಮನೆಯಲ್ಲಿ ಪೈಪ್ ಸೋರುತ್ತಿದೆ, ಪ್ಲಂಬರ್ ಕರೆಯಿರಿ.',
    transliteration: 'Maneyalli pipe sorutthide, plumber kareyiri.',
    english: 'The pipe is leaking in the house, please call a plumber.',
    contextNote: '"Sorutthide" means leaking.',
    pronunciationGuide: 'Ma-ne-yal-li pipe so-rut-thi-de, plum-ber ka-re-yi-ri.',
    formality: 'polite',
    situation: 'Informing building caretaker or landlord of maintenance issue',
    tags: ['leak', 'plumber', 'repair', 'maintenance']
  },
  {
    id: 'ad-05',
    categoryId: 'accommodation-daily',
    kannada: 'ಕಸ ತಗೋಳೋ ಗಾಡಿ ಬಂತಾ?',
    transliteration: 'Kasa thagolo gaadi banthaa?',
    english: 'Has the garbage collection vehicle arrived?',
    contextNote: 'BBMP garbage vehicle plays a whistle or bell every morning. Colloquial Bengaluru spoken phrasing; North Karnataka uses "ಕಸದ ಗಾಡಿ ಬಂತೇನ್ರೀ?".',
    pronunciationGuide: 'Ka-sa tha-go-lo gaa-di ban-thaa?',
    formality: 'casual',
    situation: 'Asking neighbors about morning waste collection',
    tags: ['garbage', 'bbmp', 'waste', 'morning'],
    needsDialectReview: true,
    needsSpeakerReview: true
  },
  {
    id: 'ad-06',
    categoryId: 'accommodation-daily',
    kannada: 'ಮನೆ ಕೆಲಸಕ್ಕೆ ಯಾರಾದರೂ ಪರಿಚಿತರು ಸಿಗುತ್ತಾರಾ?',
    transliteration: 'Mane kelasakke yaaraadaroo parichitharu sigutthaaraa?',
    english: 'Do you know someone reliable for household work / cleaning?',
    contextNote: '"Mane kelasa" = domestic help / maid / cooking.',
    pronunciationGuide: 'Ma-ne ke-la-sak-ke yaa-raa-da-roo pa-ri-chi-tha-ru si-gut-thaa-raa?',
    formality: 'polite',
    situation: 'Asking apartment security or neighbor for domestic help recommendation',
    tags: ['maid', 'cook', 'housework', 'domestic help']
  },
  {
    id: 'ad-07',
    categoryId: 'accommodation-daily',
    kannada: 'ಕರೆಂಟ್ ಬಿಲ್ ಎಲ್ಲಿ ಕಟ್ಟಬೇಕು?',
    transliteration: 'Current bill yelli kattabeku?',
    english: 'Where should I pay the electricity bill (BESCOM)?',
    contextNote: 'BESCOM bills can be paid online or at Bangalore One centers.',
    pronunciationGuide: 'Cur-rent bill yel-li kat-ta-be-ku?',
    formality: 'polite',
    situation: 'Utility payment inquiry',
    tags: ['bescom', 'electricity', 'utility', 'bills']
  },
  {
    id: 'ad-08',
    categoryId: 'accommodation-daily',
    kannada: 'ನಮಗೆ 20 ಲೀಟರ್ ಕುಡಿಯುವ ನೀರಿನ ಕ್ಯಾನ್ ಬೇಕು.',
    transliteration: 'Namage 20 litre kudiyuva neerina can beku.',
    english: 'We need a 20-litre drinking water can.',
    contextNote: 'Essential for ordering RO water cans from local vendor.',
    pronunciationGuide: 'Na-ma-ge 20 li-tre ku-di-yu-va nee-ri-na can be-ku.',
    formality: 'polite',
    situation: 'Calling drinking water supply agency',
    tags: ['water can', 'ro water', 'delivery']
  },
  {
    id: 'ad-09',
    categoryId: 'accommodation-daily',
    kannada: 'ಇಂಟರ್ನೆಟ್ ವೈಫೈ ಕೆಲಸ ಮಾಡುತ್ತಿಲ್ಲ.',
    transliteration: 'Internet WiFi kelasa maadutthilla.',
    english: 'The internet WiFi is not working.',
    contextNote: '"Kelasa maadutthilla" = is not working.',
    pronunciationGuide: 'In-ter-net Wi-Fi ke-la-sa maa-dut-thil-la.',
    formality: 'polite',
    situation: 'Reporting broadband outage to ISP or landlord',
    tags: ['wifi', 'internet', 'broadband', 'service']
  },
  {
    id: 'ad-10',
    categoryId: 'accommodation-daily',
    kannada: 'ಅಕ್ಕಪಕ್ಕದಲ್ಲಿ ಲಾಂಡ್ರಿ ಶಾಪ್ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?',
    transliteration: 'Akkapakkadalli laundry shop yelli sigutthe?',
    english: 'Where can I find an ironing / laundry shop nearby?',
    contextNote: '"Akkapakkadalli" means in the neighborhood / nearby.',
    pronunciationGuide: 'Ak-ka-pak-ka-dal-li laun-dry shop yel-li si-gut-the?',
    formality: 'polite',
    situation: 'Looking for clothes pressing / dry cleaning vendor',
    tags: ['laundry', 'ironing', 'neighborhood']
  },

  // BONUS ESSENTIAL KANNADA EVERYDAY SURVIVAL PHRASES
  {
    id: 'bs-01',
    categoryId: 'travel-directions',
    kannada: 'ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರಾ?',
    transliteration: 'Namaskara! Hegiddeera?',
    english: 'Hello / Greetings! How are you?',
    contextNote: 'The most respectful, heartwarming way to greet anyone in Karnataka.',
    pronunciationGuide: 'Na-mas-kaa-ra! He-gid-dee-raa?',
    formality: 'polite',
    situation: 'Everyday respectful greeting',
    tags: ['greeting', 'namaskara', 'respect']
  },
  {
    id: 'bs-02',
    categoryId: 'public-transport',
    kannada: 'ಕನ್ನಡ ಸ್ವಲ್ಪ ಸ್ವಲ್ಪ ಬರುತ್ತೆ.',
    transliteration: 'Kannada swalpa swalpa barutthe.',
    english: 'I know a little bit of Kannada.',
    contextNote: 'Saying this will instantly warm locals to you and make them smile!',
    pronunciationGuide: 'Kan-na-da swal-pa swal-pa ba-rut-the.',
    formality: 'casual',
    situation: 'Conversing with shopkeepers, drivers, conductors',
    tags: ['beginner', 'conversation', 'swalpa'],
    needsDialectReview: true,
    needsSpeakerReview: true
  },
  {
    id: 'bs-03',
    categoryId: 'travel-directions',
    kannada: 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.',
    transliteration: 'Dayavittu nidhaanavaagi maathanaadi.',
    english: 'Please speak slowly.',
    contextNote: 'Useful when someone is replying too rapidly in colloquial Kannada.',
    pronunciationGuide: 'Da-ya-vit-tu ni-dhaa-na-vaa-gi maa-tha-naa-di.',
    formality: 'polite',
    situation: 'Asking speaker to slow down pace',
    tags: ['slow', 'comprehension', 'listen']
  },
  {
    id: 'bs-04',
    categoryId: 'workplace',
    kannada: 'ನನಗೆ ಕನ್ನಡ ಸರಿಯಾಗಿ ಗೊತ್ತಿಲ್ಲ.',
    transliteration: 'Nanage Kannada sariyaagi gotthilla.',
    english: 'I do not know Kannada properly.',
    contextNote: 'Modest and widely appreciated expression when you want to signal you are a beginner learner.',
    pronunciationGuide: 'Na-na-ge Kan-na-da sa-ri-yaa-gi got-thil-la.',
    formality: 'casual',
    situation: 'Quick language barrier indication',
    tags: ['beginner', 'kannada', 'learner']
  },
  {
    id: 'bs-05',
    categoryId: 'food-dining',
    kannada: 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು ಅಣ್ಣಾ!',
    transliteration: 'Thumba dhanyavaadagalu anna!',
    english: 'Thank you very much, brother!',
    contextNote: 'Perfect parting gratitude after getting help or receiving your order.',
    pronunciationGuide: 'Thum-ba dhan-ya-vaa-da-ga-lu an-naa!',
    formality: 'polite',
    situation: 'Heartfelt thank you',
    tags: ['thank you', 'anna', 'gratitude']
  }
];
