// 発行した短縮 token の履歴を localStorage に保存する。
// 認証がないため、共有 PC で誰かの履歴に他人が混ざるリスクは cookie/localStorage
// どちらでも同じ。サーバ側での参照は不要なので localStorage で足りる。

const HISTORY_KEY = 'ig-goal-sheet-2026-10-tokens';
const MAX_ENTRIES = 50;

export type HistoryKind = 'self' | 'supervisor';

export interface TokenHistoryEntry {
  token: string;
  name: string;
  period: string;
  kind: HistoryKind;
  createdAt: number;
}

function safeRead(): TokenHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is TokenHistoryEntry =>
        e && typeof e.token === 'string' && typeof e.createdAt === 'number',
    );
  } catch {
    return [];
  }
}

export function readTokenHistory(): TokenHistoryEntry[] {
  return safeRead().sort((a, b) => b.createdAt - a.createdAt);
}

export function appendTokenHistory(entry: Omit<TokenHistoryEntry, 'createdAt'>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = safeRead();
    // 同一 token は上書き（新しい createdAt に更新）
    const filtered = current.filter(e => e.token !== entry.token);
    filtered.unshift({ ...entry, createdAt: Date.now() });
    const trimmed = filtered.slice(0, MAX_ENTRIES);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // storage 満杯・privacy モード等では諦める
  }
}
