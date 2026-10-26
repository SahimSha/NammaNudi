import type { SRSItem, SRSReviewRating } from '../types';

export const STORAGE_KEY_SRS = 'nammanudi_srs_v1';

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Leitner intervals in days for boxes 1 to 5
export const BOX_INTERVALS: Record<number, number> = {
  1: 1, // Box 1: 1 day
  2: 3, // Box 2: 3 days
  3: 7, // Box 3: 7 days
  4: 14, // Box 4: 14 days
  5: 30 // Box 5: 30 days (Mastered)
};

export function addDaysToDateString(dateStr: string, days: number): string {
  const parts = dateStr.split('-');
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadSRSItems(): Record<string, SRSItem> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SRS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn('Failed to load SRS items from localStorage', e);
    return {};
  }
}

export function saveSRSItems(items: Record<string, SRSItem>): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SRS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save SRS items to localStorage', e);
  }
}

export function enrollPhrase(
  items: Record<string, SRSItem>,
  phraseId: string,
  today: string = getLocalDateString()
): Record<string, SRSItem> {
  if (items[phraseId]) return items; // Already enrolled

  const newItem: SRSItem = {
    phraseId,
    box: 1,
    nextReviewDate: today, // Due immediately for initial test
    lastReviewedDate: undefined,
    intervalDays: 1,
    repetitions: 0
  };

  const updated = { ...items, [phraseId]: newItem };
  saveSRSItems(updated);
  return updated;
}

export function removePhraseFromSRS(
  items: Record<string, SRSItem>,
  phraseId: string
): Record<string, SRSItem> {
  if (!items[phraseId]) return items;
  const copy = { ...items };
  delete copy[phraseId];
  saveSRSItems(copy);
  return copy;
}

export function processSRSReview(
  item: SRSItem,
  rating: SRSReviewRating,
  today: string = getLocalDateString()
): SRSItem {
  let newBox = item.box;

  if (rating === 'again') {
    // Drop back to Box 1
    newBox = 1;
  } else if (rating === 'good') {
    // Advance 1 box up to 5
    newBox = Math.min(5, item.box + 1);
  } else if (rating === 'easy') {
    // Advance 2 boxes up to 5
    newBox = Math.min(5, item.box + 2);
  }

  const intervalDays = BOX_INTERVALS[newBox] || 1;
  const nextReviewDate = addDaysToDateString(today, intervalDays);

  return {
    ...item,
    box: newBox,
    intervalDays,
    nextReviewDate,
    lastReviewedDate: today,
    repetitions: item.repetitions + 1
  };
}

export function getDuePhraseIds(
  items: Record<string, SRSItem>,
  today: string = getLocalDateString()
): string[] {
  return Object.values(items)
    .filter((item) => item.nextReviewDate <= today)
    .map((item) => item.phraseId);
}

export function getSRSStatistics(items: Record<string, SRSItem>, today: string = getLocalDateString()) {
  const all = Object.values(items);
  const total = all.length;
  const due = all.filter((i) => i.nextReviewDate <= today).length;
  const mastered = all.filter((i) => i.box === 5).length;
  const reviewing = all.filter((i) => i.box >= 2 && i.box < 5).length;
  const learning = all.filter((i) => i.box === 1).length;

  return {
    total,
    due,
    mastered,
    reviewing,
    learning
  };
}
