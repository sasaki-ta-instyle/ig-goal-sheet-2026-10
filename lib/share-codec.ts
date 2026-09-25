import LZString from 'lz-string';
import { FormData } from './types';
import { mergeFormData } from './normalize-form-data';

export function encodeFormData(data: FormData): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(data));
}

export function decodeFormData(encoded: string): FormData | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') return null;
    // 閲覧側なので上長側 finalized はそのまま残し、期も受信 payload を尊重する。
    return mergeFormData(parsed, { forceCurrentPeriod: false, finalized: 'preserve' });
  } catch {
    return null;
  }
}

export function baseFromPathname(pathname: string): string {
  const trimmed = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  // basePath 剥がしの対象: /share / /s/... / /pdf(/...) / /history / /api/share...
  // 追加ルートを作ったらここに含める。含めないと /history 内の相対 URL が
  // /ig-goal-sheet-2026-10/history/s/xxxx のような base 重複で 404 になる。
  return trimmed.replace(/\/(share|s|history|pdf(\/[^/]+)?|api\/share)(\/.*)?$/, '');
}

export function buildLongShareUrl(origin: string, pathname: string, encoded: string): string {
  return `${origin}${baseFromPathname(pathname)}/share?d=${encoded}`;
}

export function buildShortShareUrl(origin: string, pathname: string, token: string): string {
  return `${origin}${baseFromPathname(pathname)}/s/${token}`;
}
