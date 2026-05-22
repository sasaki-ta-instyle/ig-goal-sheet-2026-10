import pptxgen from 'pptxgenjs';
import type { FormData } from './types';
import { GRADE_TABLE } from './types';

const C = {
  bg: 'EDE9E0',
  text: '35362D',
  muted: '82837A',
  light: 'C4C1B0',
  inv: 'F3F1EE',
  surface: 'F3F1EE',
  surface2: 'E6E2D7',
  header: 'E6E2D7',
};

const FONT = '游ゴシック';

const ROW_BORDER: [pptxgen.BorderProps, pptxgen.BorderProps, pptxgen.BorderProps, pptxgen.BorderProps] = [
  { pt: 0, color: 'FFFFFF' },
  { pt: 0, color: 'FFFFFF' },
  { pt: 0.5, color: C.light },
  { pt: 0, color: 'FFFFFF' },
];

function calcGrowth(prev: string, actual: string): string {
  const p = parseFloat((prev || '').replace(/,/g, ''));
  const a = parseFloat((actual || '').replace(/,/g, ''));
  if (!prev || !actual || isNaN(p) || isNaN(a) || p === 0) return '—';
  const val = Math.round((a / p - 1) * 100);
  return `${val > 0 ? '+' : ''}${val}%`;
}
const W = 13.33;
const H = 7.5;

function addSlideHeader(sl: pptxgen.Slide, title: string, sub: string) {
  sl.addShape('rect', { x: 0, y: 0, w: W, h: 0.9, fill: { color: C.text }, line: { width: 0, color: C.text } });
  sl.addText(title, {
    x: 0.4, y: 0.15, w: W - 1.2, h: 0.45,
    fontFace: FONT, fontSize: 14, color: C.inv, bold: true,
  });
  sl.addText(sub, {
    x: 0.4, y: 0.6, w: W - 1.2, h: 0.25,
    fontFace: FONT, fontSize: 7, color: 'A0A098', align: 'right',
  });
}

function addSectionLabel(sl: pptxgen.Slide, y: number, label: string) {
  sl.addText(label, {
    x: 0.4, y, w: W - 0.8, h: 0.24,
    fontFace: FONT, fontSize: 8, color: C.muted, bold: true,
  });
}

function addTable(sl: pptxgen.Slide, y: number, headers: string[], rows: string[][], colWidths: number[], rowH: number | number[] = 0.28) {
  const tableData: pptxgen.TableRow[] = [];

  tableData.push(headers.map(h => ({
    text: h,
    options: {
      bold: true, fontSize: 7, fontFace: FONT,
      color: C.muted,
      fill: { color: C.header },
      align: 'left' as const,
      border: ROW_BORDER,
    },
  })));

  rows.forEach((row, ri) => {
    const fillColor = ri % 2 === 0 ? C.surface : C.surface2;
    tableData.push(row.map(cell => ({
      text: cell,
      options: {
        fontSize: 8, fontFace: FONT,
        color: C.text,
        fill: { color: fillColor },
        align: 'left' as const,
        border: ROW_BORDER,
      },
    })));
  });

  const totalW = colWidths.reduce((a, b) => a + b, 0);
  const actualWidths = colWidths.map(w => (w / totalW) * (W - 0.8));

  const resolvedRowH = Array.isArray(rowH) ? [0.28, ...rowH] : rowH;

  sl.addTable(tableData, {
    x: 0.4, y,
    w: W - 0.8,
    colW: actualWidths,
    rowH: resolvedRowH,
    autoPage: false,
  });
}

function textBox(sl: pptxgen.Slide, x: number, y: number, w: number, h: number, text: string, opts?: Partial<pptxgen.TextPropsOptions>) {
  sl.addText(text || '—', {
    x, y, w, h,
    fontFace: FONT, fontSize: 8, color: C.text,
    fill: { color: C.surface }, align: 'left',
    inset: 0.06,
    wrap: true,
    ...opts,
  });
}

// スライド1/9: カバー
function slide1(prs: InstanceType<typeof pptxgen>, d: FormData) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  sl.addShape('rect', { x: 0, y: 0, w: W, h: H * 0.55, fill: { color: C.text }, line: { width: 0, color: C.text } });

  sl.addText('INSTYLE GROUP', {
    x: 0.5, y: 0.4, w: W - 1, h: 0.4,
    fontFace: FONT, fontSize: 9, color: 'C4C1B0', bold: false,
    align: 'left', charSpacing: 6,
  });

  sl.addText('目標設定シート', {
    x: 0.5, y: 0.9, w: W - 1, h: 1.2,
    fontFace: FONT, fontSize: 42, color: C.inv, bold: true,
    align: 'left',
  });

  sl.addText('グループ目標 ／ 会社目標 ／ 部署目標 ／ 個人目標 ／ グレード表 ／ 昇格・昇給 ／ ボーナス評価', {
    x: 0.5, y: 2.2, w: W - 1, h: 0.4,
    fontFace: FONT, fontSize: 9, color: 'A0A098', bold: false,
    align: 'left',
  });

  const infoY = H * 0.62;
  const rows = [
    { label: '所属法人', value: d.cover.company || '—' },
    { label: '氏名', value: d.cover.name || '—' },
    { label: 'グレード', value: d.cover.grade || '—' },
    { label: '期', value: d.cover.period || '—' },
  ];
  rows.forEach((r, i) => {
    sl.addText(r.label + '：', {
      x: 0.8, y: infoY + i * 0.5, w: 1.5, h: 0.4,
      fontFace: FONT, fontSize: 10, color: C.muted, bold: false,
    });
    sl.addText(r.value, {
      x: 2.4, y: infoY + i * 0.5, w: 6, h: 0.4,
      fontFace: FONT, fontSize: 12, color: C.text, bold: false,
    });
  });

  sl.addText('2026年10月　INSTYLE GROUP', {
    x: 0, y: H - 0.35, w: W, h: 0.3,
    fontFace: FONT, fontSize: 8, color: C.muted, align: 'center',
  });
}

// スライド2/9・3/9: グループ目標 / 会社目標（同じレイアウト・ラベルだけ差し替え）
function slideGoal(prs: InstanceType<typeof pptxgen>, d: FormData['company'], header: string, sub: string, prefix: string) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  addSlideHeader(sl, header, sub);

  const c = d;
  let y = 1.05;

  const NUM_COLS = ['前期実績（円）\n2026.4〜9', '今期目標（円）\n2026.10〜2027.3', '今期実績（円）\n2026.10〜2027.3', '成長率(%)', '来期目標'];

  // ① 戦略的フォーカス
  addSectionLabel(sl, y, '① 戦略的フォーカス');
  y += 0.3;
  textBox(sl, 0.4, y, W - 0.8, 0.6, c.strategicFocus || '—');
  y += 0.6 + 0.2;

  // ② 売上
  addSectionLabel(sl, y, '② 売上');
  y += 0.3;
  addTable(sl, y, ['指標', ...NUM_COLS], [
    [`${prefix}売上合計`, c.revenue.prev || '—', c.revenue.target || '—', c.revenue.actual || '—', calcGrowth(c.revenue.prev, c.revenue.actual), c.revenue.nextTarget || '—'],
  ], [2.2, 1.5, 1.5, 1.5, 1.0, 2.0]);
  y += 0.3 + 0.28;

  // ③ 利益
  addSectionLabel(sl, y, '③ 利益');
  y += 0.3;
  addTable(sl, y, ['指標', ...NUM_COLS], [
    [`${prefix}営業利益`, c.operatingProfit.prev || '—', c.operatingProfit.target || '—', c.operatingProfit.actual || '—', calcGrowth(c.operatingProfit.prev, c.operatingProfit.actual), c.operatingProfit.nextTarget || '—'],
    [`${prefix}営業利益率`, c.operatingMargin.prev || '—', c.operatingMargin.target || '—', c.operatingMargin.actual || '—', calcGrowth(c.operatingMargin.prev, c.operatingMargin.actual), c.operatingMargin.nextTarget || '—'],
    [`${prefix}粗利益`, c.grossProfit.prev || '—', c.grossProfit.target || '—', c.grossProfit.actual || '—', calcGrowth(c.grossProfit.prev, c.grossProfit.actual), c.grossProfit.nextTarget || '—'],
  ], [2.2, 1.5, 1.5, 1.5, 1.0, 2.0]);
  y += 0.3 + 0.28 * 3;
}

// スライド4/9: 部署目標
function slideDept(prs: InstanceType<typeof pptxgen>, d: FormData) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  addSlideHeader(sl, '03｜部署目標 記入シート', 'INSTYLE GROUP｜人事制度　4 / 9');

  const c = d.dept;
  let y = 1.05;

  // ① 上位目標との接続
  addSectionLabel(sl, y, '① 上位目標との接続（会社目標から自動転記）');
  y += 0.3;
  const halfW = (W - 0.8 - 0.16) / 2;
  textBox(sl, 0.4, y, halfW, 0.55, '戦略的フォーカス：\n' + (d.company.strategicFocus || '—'));
  textBox(sl, 0.4 + halfW + 0.16, y, halfW, 0.55, '部署のミッション：\n' + (c.mission || '—'));
  y += 0.65;

  // ② 部署KGI目標
  addSectionLabel(sl, y, '② 部署KGI目標');
  y += 0.3;
  const kgiData = [
    { label: '主要KGI①', r: c.kgi1 },
    { label: '主要KGI②', r: c.kgi2 },
  ];
  addTable(sl, y, ['区分', 'ミッション', 'KGI'],
    kgiData.map(k => [k.label, k.r.mission || '—', k.r.kgi || '—']),
    [1.6, 5.4, 5.4]);
  y += 0.3 + 0.28 * 2;

  // ③ 部署KPI目標
  addSectionLabel(sl, y, '③ 部署KPI目標');
  y += 0.3;
  const KPI_COLS = ['前期実績\n2026.4〜9', '今期目標\n2026.10〜2027.3', '今期実績\n2026.10〜2027.3', '成長率(%)', '来期目標'];
  const kpiData = [
    { label: `主要KPI①（${c.kpi1.label || '　　　'}）`, r: c.kpi1 },
    { label: `主要KPI②（${c.kpi2.label || '　　　'}）`, r: c.kpi2 },
    { label: `主要KPI③（${c.kpi3.label || '　　　'}）`, r: c.kpi3 },
    { label: `主要KPI④（${c.kpi4.label || '　　　'}）`, r: c.kpi4 },
    { label: `主要KPI⑤（${c.kpi5.label || '　　　'}）`, r: c.kpi5 },
  ];
  addTable(sl, y, ['KPI', ...KPI_COLS],
    kpiData.map(k => [k.label, k.r.prev || '—', k.r.target || '—', k.r.actual || '—', calcGrowth(k.r.prev, k.r.actual), k.r.nextTarget || '—']),
    [2.8, 1.4, 1.4, 1.4, 1.0, 1.8]);
  y += 0.3 + 0.28 * 5;

  // ④ 今期の重点施策
  addSectionLabel(sl, y, '④ 今期の重点施策（KPIを達成するための行動）');
  y += 0.3;
  const actionRows = c.actions.map((r, i) => [
    `${i + 1}`, r.content || '—', r.expectedEffect || '—', r.deadline || '—',
  ]);
  addTable(sl, y, ['#', '施策内容', '期待効果', '期限'], actionRows, [0.4, 4.5, 4.5, 1.5]);
}

// スライド5/9: 個人目標
function slidePersonal(prs: InstanceType<typeof pptxgen>, d: FormData) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  addSlideHeader(sl, '04｜個人目標 記入シート', 'INSTYLE GROUP｜人事制度　5 / 9');

  const c = d.personal;
  let y = 1.05;

  // ① 現在地の確認
  addSectionLabel(sl, y, '① 現在地の確認');
  y += 0.3;
  const statusRows = c.currentStatus.map(r => [r.label, r.value || '—']);
  addTable(sl, y, ['項目', '内容'], statusRows, [3.0, W - 0.8 - 3.0]);
  y += 0.3 + statusRows.length * 0.38;

  // ② SMART個人目標
  addSectionLabel(sl, y, '② SMART個人目標');
  y += 0.3;
  const SMART_LABELS: { key: 's' | 'm' | 'a' | 'r' | 't'; label: string }[] = [
    { key: 's', label: 'S＝Specific（具体的）' },
    { key: 'm', label: 'M＝Measurable（測定可能）' },
    { key: 'a', label: 'A＝Achievable（達成可能）' },
    { key: 'r', label: 'R＝Relevant（関連性）' },
    { key: 't', label: 'T＝Time-bound（期限）' },
  ];
  const smartColWidths = [2.6, 5.0, 2.4];
  const smartTotalW = smartColWidths.reduce((a, b) => a + b, 0);
  const smartActualWidths = smartColWidths.map(w => (w / smartTotalW) * (W - 0.8));
  const smartRowHeight = 0.30;
  const smartHeaderH = 0.28;

  const smartTableData: pptxgen.TableRow[] = [];
  smartTableData.push(['項目', '内容', '備考・補足など'].map(h => ({
    text: h,
    options: {
      bold: true, fontSize: 7, fontFace: FONT,
      color: C.muted,
      fill: { color: C.header },
      align: 'left' as const,
      border: ROW_BORDER,
    },
  })));

  const rowsPerGoal = SMART_LABELS.length + 1;
  c.smartGoals.forEach((goal, gi) => {
    const fillColor = gi % 2 === 0 ? C.surface : C.surface2;

    // 1行目: 該当する部署KPI
    smartTableData.push([
      {
        text: '該当する部署KPI',
        options: {
          bold: true, fontSize: 8, fontFace: FONT,
          color: C.muted,
          fill: { color: fillColor },
          align: 'left' as const,
          border: ROW_BORDER,
        },
      },
      {
        text: goal.relatedKpi && goal.relatedKpi.trim() !== '' ? goal.relatedKpi : '—',
        options: {
          fontSize: 8, fontFace: FONT,
          color: C.text,
          fill: { color: fillColor },
          align: 'left' as const,
          border: ROW_BORDER,
        },
      },
      {
        text: goal.note || '—',
        options: {
          fontSize: 8, fontFace: FONT,
          color: C.text,
          fill: { color: fillColor },
          align: 'left' as const,
          border: ROW_BORDER,
          rowspan: rowsPerGoal,
          valign: 'top' as const,
        },
      },
    ]);

    // 続いて SMART 5 行
    SMART_LABELS.forEach(({ key, label }) => {
      const value = goal[key];
      smartTableData.push([
        {
          text: label,
          options: {
            bold: true, fontSize: 8, fontFace: FONT,
            color: C.muted,
            fill: { color: fillColor },
            align: 'left' as const,
            border: ROW_BORDER,
          },
        },
        {
          text: value && value.trim() !== '' ? value : '—',
          options: {
            fontSize: 8, fontFace: FONT,
            color: C.text,
            fill: { color: fillColor },
            align: 'left' as const,
            border: ROW_BORDER,
          },
        },
      ]);
    });
  });

  const smartTotalRows = c.smartGoals.length * rowsPerGoal;
  sl.addTable(smartTableData, {
    x: 0.4, y,
    w: W - 0.8,
    colW: smartActualWidths,
    rowH: [smartHeaderH, ...Array(smartTotalRows).fill(smartRowHeight)],
    autoPage: false,
  });
  y += 0.3 + smartHeaderH + smartTotalRows * smartRowHeight;

  // ③ SL理論
  addSectionLabel(sl, y, '③ SL理論（上長と合意した今期の関わり方）');
  y += 0.3;
  sl.addText('上長と握った内容', {
    x: 0.4, y, w: W - 0.8, h: 0.22,
    fontFace: FONT, fontSize: 7, color: C.muted, bold: true,
  });
  y += 0.24;
  const SL_LABELS: Record<string, string> = {
    S1: 'S1｜指示型（高指示・低支援）',
    S2: 'S2｜コーチ型（高指示・高支援）',
    S3: 'S3｜支援型（低指示・高支援）',
    S4: 'S4｜委任型（低指示・低支援）',
  };
  const slText = c.slLevel ? SL_LABELS[c.slLevel] : '—';
  const slBoxW = 3.6;
  textBox(sl, 0.4, y, slBoxW, 0.4, slText, { bold: !!c.slLevel, fontSize: 9 });
  textBox(sl, 0.4 + slBoxW + 0.16, y, W - 0.8 - slBoxW - 0.16, 0.4, c.slNote || '（上長との合意メモ未記入）');
  y += 0.55;

  // ④ 上長からの一言
  addSectionLabel(sl, y, '④ 上長からの一言');
  y += 0.3;
  textBox(sl, 0.4, y, W - 0.8, 0.6, c.supervisorComment || '—');
}

// スライド6/9: コミットメント（個人目標とグレードの間。アプリでも独立ステップ）
function slideCommitment(prs: InstanceType<typeof pptxgen>, d: FormData) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  addSlideHeader(sl, '05｜コミットメント 記入シート', 'INSTYLE GROUP｜人事制度　6 / 9');

  const c = d.personal;
  let y = 1.05;

  addSectionLabel(sl, y, 'コミットメント');
  y += 0.3;
  textBox(sl, 0.4, y, W - 0.8, 0.7,
    '報酬は、申告するものではなく、獲得するもの。希望年収ではなく、今期に提供する価値の根拠を 3 つ挙げ、見積書のように内訳と金額で書き出す。半年後に行動と結果で答え合わせをする。',
    { fontSize: 8, color: C.muted, fill: { color: C.bg } });
  y += 0.78;

  const ITEM_INDEX = ['①', '②', '③', '④', '⑤'];
  const mvColWidths = [0.5, W - 0.8 - 0.5 - 2.0, 2.0];
  const mvRows = c.commitment.map((r, i) => {
    const amount = r.amount && r.amount.trim() !== ''
      ? `¥ ${Number(r.amount).toLocaleString('ja-JP')} / 年`
      : '—';
    return [ITEM_INDEX[i] ?? `${i + 1}.`, r.rationale || '—', amount];
  });
  addTable(sl, y, ['No.', '項目・概要', '金額'], mvRows, mvColWidths);
  y += 0.3 + mvRows.length * 0.38;

  const mvTotal = c.commitment.reduce(
    (s, r) => s + (parseInt((r.amount || '').replace(/[^\d]/g, ''), 10) || 0),
    0,
  );
  textBox(sl, 0.4, y, W - 0.8, 0.36,
    `合計   ¥ ${mvTotal.toLocaleString('ja-JP')} 円 / 年`,
    { bold: true, fontSize: 10, align: 'right', fill: { color: C.surface2 } });
}

// スライド7/9: グレード表
function slideGrade(prs: InstanceType<typeof pptxgen>, selectedGrade: string, expectations: Record<string, string>) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  addSlideHeader(sl, '06｜グレード表', 'INSTYLE GROUP｜人事制度　7 / 9');

  const x0 = 0.4;
  const y = 1.1;
  const rowH = 0.32;
  const colWidths = [0.7, 2.4, 1.0, 1.83, 6.6];

  sl.addText('現在値に○をつけてください', {
    x: x0, y: y - 0.3, w: 10, h: 0.25,
    fontFace: FONT, fontSize: 8, color: C.muted,
  });

  const headers = ['ティア', '名称', 'グレード', '月給合計（円/月）', '各人が各クラスに求める目安'];
  const tableData: pptxgen.TableRow[] = [
    headers.map(h => ({
      text: h,
      options: {
        bold: true, fontSize: 7, fontFace: FONT,
        color: C.muted,
        fill: { color: C.header },
        align: 'left' as const,
        border: ROW_BORDER,
      },
    })),
  ];

  const expKey = (key: string) => key.replace("'", '');

  GRADE_TABLE.forEach(tier => {
    const grades = tier.grades;
    grades.forEach((entry, gIdx) => {
      const isSelected = entry.key === selectedGrade;
      const fillColor = isSelected ? 'D8D4CA' : gIdx % 2 === 0 ? C.surface : C.surface2;
      const row: pptxgen.TableRow = [];

      if (gIdx === 0) {
        row.push({
          text: tier.tier,
          options: {
            bold: true, fontSize: 13, fontFace: FONT,
            color: C.text,
            fill: { color: 'E0DDD4' },
            align: 'center' as const,
            rowspan: grades.length,
            border: ROW_BORDER,
          },
        });
        row.push({
          text: tier.tierName,
          options: {
            fontSize: 7, fontFace: FONT, color: C.muted,
            fill: { color: C.surface },
            align: 'left' as const,
            rowspan: grades.length,
            border: ROW_BORDER,
          },
        });
      }

      row.push(
        {
          text: isSelected ? `○ ${entry.key}` : entry.key,
          options: {
            bold: isSelected, fontSize: 9, fontFace: FONT,
            color: C.text,
            fill: { color: fillColor },
            align: 'left' as const,
            border: ROW_BORDER,
          },
        },
        {
          text: entry.salary,
          options: {
            bold: isSelected, fontSize: 9, fontFace: FONT,
            color: C.text,
            fill: { color: fillColor },
            align: 'right' as const,
            border: ROW_BORDER,
          },
        },
      );

      // 期待値セル: 大文字ペア(gIdx=0)と小文字ペア(gIdx=2)のみrowspan=2で追加
      if (grades.length === 1 || gIdx === 0 || gIdx === 2) {
        const span = grades.length === 1 ? 1 : 2;
        row.push({
          text: expectations[expKey(entry.key)] || '',
          options: {
            fontSize: 8, fontFace: FONT, color: C.text,
            fill: { color: C.surface },
            align: 'left' as const,
            rowspan: span,
            border: ROW_BORDER,
          },
        });
      }

      tableData.push(row);
    });
  });

  sl.addTable(tableData, {
    x: x0, y,
    w: W - x0 * 2,
    colW: colWidths,
    rowH,
    autoPage: false,
  });

  sl.addText('※ 2026年10月時点', {
    x: x0, y: y + tableData.length * rowH + 0.1, w: 10, h: 0.2,
    fontFace: FONT, fontSize: 7, color: C.muted,
  });
}

// スライド8/9: 昇格・昇給採点シート
function slidePromotion(prs: InstanceType<typeof pptxgen>, d: FormData) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  addSlideHeader(sl, '07｜昇格・昇給 採点シート', 'INSTYLE GROUP｜人事制度　8 / 9');

  const p = d.promotion;
  let y = 1.05;

  // VALUE評価ゲート
  const valueNum = parseFloat(p.valueScore);
  const gatePass = !isNaN(valueNum) && p.valueScore !== '' && valueNum >= 3.5;
  const gateText = p.valueScore ? `${p.valueScore}（${gatePass ? '✓ ゲート通過' : '✗ 昇格不可'}）` : '—';

  addSectionLabel(sl, y, '① VALUE評価（360度スコア）— ゲート条件: 3.50以上');
  y += 0.28;
  textBox(sl, 0.4, y, W - 0.8, 0.35, gateText, { fontSize: 9, bold: gatePass });
  y += 0.45;

  // ②〜⑦ 採点テーブル
  addSectionLabel(sl, y, '② 〜 ⑦ 評価項目（合計11pt以上で昇格・昇給対象）');
  y += 0.3;

  const totalPoints = p.tenurePoint + p.deptGrowthPoint + p.personalKpiPoint + p.supervisorPoint + p.mgmtPoint + p.nurturingPoint;
  const isPromotionEligible = gatePass && totalPoints >= 11;

  const evalRows = [
    ['②', '在籍期間', '0〜1pt', `${p.tenurePoint}pt`],
    ['③', '所属部署の成長度', '1〜5pt', `${p.deptGrowthPoint}pt`],
    ['④', '個人KPI達成度', '1〜5pt', `${p.personalKpiPoint}pt`],
    ['⑤', '直属上司評価', '1〜5pt', `${p.supervisorPoint}pt`],
    ['⑥', '経営評価（代表）', '1〜5pt', `${p.mgmtPoint}pt`],
    ['⑦', '育成・昇進循環', '1〜5pt', `${p.nurturingPoint}pt`],
  ];

  const tableData: pptxgen.TableRow[] = [
    ['#', '評価項目', '配点', '採点'].map(h => ({
      text: h,
      options: { bold: true, fontSize: 7, fontFace: FONT, color: C.muted, fill: { color: C.header }, align: 'left' as const, border: ROW_BORDER },
    })),
    ...evalRows.map((row, ri) => {
      const fillColor = ri % 2 === 0 ? C.surface : C.surface2;
      return row.map((cell, ci) => ({
        text: cell,
        options: {
          fontSize: 9, fontFace: FONT, color: C.text, fill: { color: fillColor },
          align: (ci === 3 ? 'right' : 'left') as 'left' | 'right',
          bold: ci === 3,
          border: ROW_BORDER,
        },
      }));
    }),
  ];

  const colW = [0.4, 5.5, 1.2, 1.2];
  const totalW = colW.reduce((a, b) => a + b, 0);
  sl.addTable(tableData, {
    x: 0.4, y,
    w: W - 0.8,
    colW: colW.map(w => (w / totalW) * (W - 0.8)),
    rowH: 0.3,
    autoPage: false,
  });

  y += 0.3 + evalRows.length * 0.3 + 0.2;

  // 合計
  const resultText = isPromotionEligible
    ? `合計：${totalPoints}pt　→ 昇格・昇給対象`
    : !gatePass
      ? `合計：${totalPoints}pt　→ 昇格・昇給対象外（VALUEゲート未通過）`
      : `合計：${totalPoints}pt　→ 昇格・昇給対象外（あと${11 - totalPoints}pt必要）`;
  sl.addText(resultText, {
    x: 0.4, y, w: W - 0.8, h: 0.4,
    fontFace: FONT, fontSize: 10, color: C.text, bold: true,
    fill: { color: isPromotionEligible ? 'D4EDD7' : C.surface2 },
    inset: 0.08,
  });
}

// スライド9/9: ボーナス評価採点シート
function slideBonus(prs: InstanceType<typeof pptxgen>, d: FormData) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  addSlideHeader(sl, '08｜ボーナス評価 採点シート', 'INSTYLE GROUP｜人事制度　9 / 9');

  const b = d.bonus;
  let y = 1.05;

  const phase1Total = b.canAfford + b.hasProfit + b.futureProfit;
  const supervisorPoints = b.supervisorEval * (b.noSupervisor ? 2 : 1);
  const phase2Total =
    b.deptKpiAchieved + b.personalKpiAchieved + supervisorPoints +
    b.valueEval + b.reproducibility + b.roleAchievement +
    b.difficulty + b.mgmtEval;
  const phase1Pass = phase1Total >= 3;
  const bonusAmount = phase1Pass ? phase2Total * 110000 : 0;

  const pt = (v: number, weight = 1) => v === 1 ? String(weight) : '0';

  // Phase 1
  addSectionLabel(sl, y, 'Phase 1：財務ゲート（合計3未満でボーナス0）');
  y += 0.3;
  addTable(sl, y, ['#', '評価項目', '採点(0/1)'], [
    ['①', '今支給できる金がある', pt(b.canAfford)],
    ['②', '今利益が出ている', pt(b.hasProfit)],
    ['③', '将来も利益が出る見込みがある', pt(b.futureProfit)],
  ], [0.4, 7.0, 1.2]);
  y += 0.3 + 3 * 0.28 + 0.15;

  const p1ResultText = `Phase 1合計：${phase1Total}/3　${phase1Pass ? '→ Phase 2へ' : '→ ボーナス0'}`;
  sl.addText(p1ResultText, {
    x: 0.4, y, w: W - 0.8, h: 0.32,
    fontFace: FONT, fontSize: 9, color: C.text, bold: true,
    fill: { color: phase1Pass ? 'D4EDD7' : 'F5D5D5' }, inset: 0.06,
  });
  y += 0.45;

  // Phase 2
  addSectionLabel(sl, y, 'Phase 2：個人評価（各0または1、迷ったら0）');
  y += 0.3;
  addTable(sl, y, ['#', '評価項目', '採点(0/1)'], [
    ['④', '部署KPI達成', pt(b.deptKpiAchieved)],
    ['⑤', '個人KPI達成', pt(b.personalKpiAchieved)],
    ['⑥', b.noSupervisor ? '直属上司評価（上司不在・重み2倍）' : '直属上司評価', pt(b.supervisorEval, b.noSupervisor ? 2 : 1)],
    ['⑦', '360°評価（バリュー）', pt(b.valueEval)],
    ['⑧', '再現性・継続性', pt(b.reproducibility)],
    ['⑨', '役割に対する達成度', pt(b.roleAchievement)],
    ['⑩', '負荷・難易度', pt(b.difficulty)],
    ['⑪', '経営評価', pt(b.mgmtEval)],
  ], [0.4, 7.0, 1.2]);
  y += 0.3 + 8 * 0.28 + 0.15;

  // 支給額
  const bonusText = `支給額：${phase1Pass ? phase2Total : '—'}pt × 11万円 ＝ ${bonusAmount.toLocaleString('ja-JP')}円`;
  sl.addText(bonusText, {
    x: 0.4, y, w: W - 0.8, h: 0.38,
    fontFace: FONT, fontSize: 11, color: C.text, bold: true,
    fill: { color: bonusAmount > 0 ? 'D4EDD7' : C.surface2 }, inset: 0.08,
  });
}

export async function generatePptx(data: FormData) {
  const prs = new pptxgen();
  prs.layout = 'LAYOUT_WIDE';
  prs.author = 'INSTYLE GROUP';
  prs.company = 'INSTYLE GROUP';
  prs.subject = '目標設定シート';

  slide1(prs, data);
  slideGoal(prs, data.group, '01｜グループ目標 記入シート', 'INSTYLE GROUP｜人事制度　2 / 9', 'グループ');
  slideGoal(prs, data.company, '02｜会社目標 記入シート', 'INSTYLE GROUP｜人事制度　3 / 9', '会社');
  slideDept(prs, data);
  slidePersonal(prs, data);
  slideCommitment(prs, data);
  slideGrade(prs, data.cover.grade, data.gradeExpectations as Record<string, string>);
  slidePromotion(prs, data);
  slideBonus(prs, data);

  const sanitize = (s: string) => s.replace(/[\\/:*?"<>|]/g, '_');
  const name = sanitize(data.cover.name || '社員');
  const period = sanitize(data.cover.period || '期間');
  await prs.writeFile({ fileName: `目標設定シート_${name}_${period}.pptx` });
}
