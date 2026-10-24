import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'travel-directions',
    name: 'Travel & Directions',
    kannadaName: 'ದಾರಿ ಮತ್ತು ಪ್ರಯಾಣ',
    description: 'Asking for locations, landmarks, left/right turns, and distances.',
    iconName: 'Compass',
    accentColor: '#0D5C58',
    badgeBg: 'bg-teal-50 border-teal-200 text-teal-800',
    badgeText: 'text-teal-700'
  },
  {
    id: 'public-transport',
    name: 'Public Transport & Buses',
    kannadaName: 'ಸಾರಿಗೆ ಮತ್ತು ಬಸ್ ನಿಲ್ದಾಣ',
    description: 'BMTC bus stops, conductor queries, Namma Metro, auto fares & meter.',
    iconName: 'Bus',
    accentColor: '#D97706',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
    badgeText: 'text-amber-700'
  },
  {
    id: 'shopping-markets',
    name: 'Shopping & Markets',
    kannadaName: 'ಖರೀದಿ ಮತ್ತು ಮಾರುಕಟ್ಟೆ',
    description: 'Bargaining, asking prices, vegetable vendors, UPI and change.',
    iconName: 'ShoppingBag',
    accentColor: '#059669',
    badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    badgeText: 'text-emerald-700'
  },
  {
    id: 'food-dining',
    name: 'Food & Restaurants',
    kannadaName: 'ಆಹಾರ ಮತ್ತು ಹೋಟೆಲ್',
    description: 'Ordering at darshinis, asking for water/coffee, bill, and spice levels.',
    iconName: 'Utensils',
    accentColor: '#EA580C',
    badgeBg: 'bg-orange-50 border-orange-200 text-orange-800',
    badgeText: 'text-orange-700'
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medical',
    kannadaName: 'ಆರೋಗ್ಯ ಮತ್ತು ಆಸ್ಪತ್ರೆ',
    description: 'Explaining symptoms, pharmacy medicine requests, doctor appointments.',
    iconName: 'HeartPulse',
    accentColor: '#E11D48',
    badgeBg: 'bg-rose-50 border-rose-200 text-rose-800',
    badgeText: 'text-rose-700'
  },
  {
    id: 'emergencies',
    name: 'Emergencies',
    kannadaName: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿ',
    description: 'Urgent assistance, calling police, lost property, safety.',
    iconName: 'ShieldAlert',
    accentColor: '#DC2626',
    badgeBg: 'bg-red-50 border-red-200 text-red-800',
    badgeText: 'text-red-700'
  },
  {
    id: 'education-campus',
    name: 'Education & Campus',
    kannadaName: 'ಶಿಕ್ಷಣ ಮತ್ತು ಕಾಲೇಜು',
    description: 'Talking to professors, classmates, library rules, notice boards.',
    iconName: 'GraduationCap',
    accentColor: '#4F46E5',
    badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    badgeText: 'text-indigo-700'
  },
  {
    id: 'workplace',
    name: 'Workplace & Office',
    kannadaName: 'ಕಚೇರಿ ಮತ್ತು ಕೆಲಸ',
    description: 'Daily office greetings, polite workplace queries, lunch invites, colleagues.',
    iconName: 'Briefcase',
    accentColor: '#0284C7',
    badgeBg: 'bg-sky-50 border-sky-200 text-sky-800',
    badgeText: 'text-sky-700'
  },
  {
    id: 'accommodation-daily',
    name: 'Accommodation & Daily Needs',
    kannadaName: 'ವಸತಿ ಮತ್ತು ದೈನಂದಿನ ಅಗತ್ಯಗಳು',
    description: 'House rent, dealing with house help, plumber, electrician, water delivery.',
    iconName: 'Home',
    accentColor: '#7C3AED',
    badgeBg: 'bg-purple-50 border-purple-200 text-purple-800',
    badgeText: 'text-purple-700'
  }
];

