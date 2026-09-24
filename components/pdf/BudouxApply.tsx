import Script from 'next/script';

// BudouX を PDF ページに適用。esm.sh から module として読み込み、
// 対象要素の innerHTML に <wbr> を挿し込む。CSS 側で word-break: keep-all を
// 併用しているので、budoux が入った位置以外では改行しない。
const SELECTOR = '.pdf-doc h1, .pdf-doc h2, .pdf-doc h3, .pdf-doc p, .pdf-doc li, .pdf-doc dd, .pdf-doc td';

export default function BudouxApply() {
  const src = `
    import { loadDefaultJapaneseParser } from 'https://esm.sh/budoux@0.7.0';
    const parser = loadDefaultJapaneseParser();
    const apply = () => {
      document.querySelectorAll(${JSON.stringify(SELECTOR)}).forEach(el => {
        if (el.dataset.budoux === '1') return;
        if (!el.textContent || !el.textContent.trim()) return;
        el.innerHTML = parser.translateHTMLString(el.innerHTML);
        el.dataset.budoux = '1';
      });
    };
    apply();
    // 動的に追加された要素にも間欠適用
    new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
  `;
  return (
    <Script id="pdf-budoux" type="module" strategy="afterInteractive">
      {src}
    </Script>
  );
}
