'use client';

import { useEffect } from 'react';
import { loadDefaultJapaneseParser } from 'budoux';

// BudouX を PDF ページに適用。npm 経由で bundle 済みの budoux を使い、CDN 依存を排除
// （esm.sh 経由だと供給チェーン侵害時に PDF 内の氏名・目標・token が外部送信される
// 恐れがある）。対象要素の innerHTML に <wbr> を挿し込み、CSS 側の word-break: keep-all
// と組み合わせて意味の切れ目でのみ改行させる。React が既に escape 済みの DOM に対する
// round-trip なので、budoux 自身も HTML entity と <wbr> しか挿入しないため XSS 面は薄い。
const SELECTOR = '.pdf-doc h1, .pdf-doc h2, .pdf-doc h3, .pdf-doc p, .pdf-doc li, .pdf-doc dd, .pdf-doc td';

export default function BudouxApply() {
  useEffect(() => {
    const parser = loadDefaultJapaneseParser();
    const apply = () => {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach(el => {
        if (el.dataset.budoux === '1') return;
        if (!el.textContent || !el.textContent.trim()) return;
        el.innerHTML = parser.translateHTMLString(el.innerHTML);
        el.dataset.budoux = '1';
      });
    };
    apply();
    // 動的に追加された要素にも間欠適用。PDF ページは基本静的なので発火は稀。
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
