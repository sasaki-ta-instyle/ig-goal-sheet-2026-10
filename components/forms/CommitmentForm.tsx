'use client';
import { PersonalGoalData, CommitmentRow, Grade, getAnnualSalaryByGrade } from '@/lib/types';

interface Props {
  data: PersonalGoalData;
  grade: Grade | '';
  onChange: (data: PersonalGoalData) => void;
}

const ITEM_INDEX = ['①', '②', '③'];

export default function CommitmentForm({ data, grade, onChange }: Props) {
  const updateCommitment = (i: number, field: keyof CommitmentRow, value: string) => {
    const arr = data.commitment.map((r, idx) => (idx === i ? { ...r, [field]: value } : r));
    onChange({ ...data, commitment: arr });
  };
  const formatYen = (raw: string) => {
    if (!raw) return '';
    const n = Number(raw);
    if (!Number.isFinite(n)) return raw;
    return n.toLocaleString('ja-JP');
  };
  const parseYen = (v: string) =>
    v.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/[^\d]/g, '');

  const rows = data.commitment.slice(0, 3);
  const total = rows.reduce((s, r) => s + (parseInt(r.amount || '0', 10) || 0), 0);

  const baseAnnual = getAnnualSalaryByGrade(grade);
  const hasBase = baseAnnual != null;
  const diff = hasBase ? total - baseAnnual : null;
  const diffSign = diff == null ? '' : diff > 0 ? '+' : diff < 0 ? '−' : '±';
  const diffAbs = diff == null ? 0 : Math.abs(diff);

  return (
    <div>
      <p className="section-title">05｜コミットメント 記入シート</p>

      <p style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 6 }}>コミットメントは、希望ではなく、自分で負う約束です。</p>
      <p style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
        <strong>報酬は、申告するものではなく、獲得するもの。</strong>西村さんから見て、あなたはこのグレードでこの<strong>基準年収</strong>。それに対してあなた自身は、提供している（提供できる）価値を積み上げ、合計いくらの<strong>コミットメント</strong>になるか、根拠から書き出してください。出した数字は、<strong>半年後に行動と結果で答え合わせ</strong>をします。
      </p>

      {/* 基準年収 vs コミットメント合計 */}
      <div
        className="commitment-compare"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 40,
          padding: '14px 20px',
          marginBottom: 20,
          background: '#fbfbf9',
          borderRadius: 'var(--radius-md, 12px)',
        }}
      >
        {/* 左: グレード × 基準年収 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: '.6875rem', color: 'var(--color-text-muted)', letterSpacing: '.04em' }}>
            グレード年収
          </span>
          {grade ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{grade}</span>
              {hasBase ? (
                <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                  ¥ {formatYen(String(baseAnnual))}{' '}
                  <span style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>/ 年</span>
                </span>
              ) : (
                <span style={{ fontSize: '.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>—（基準なし）</span>
              )}
            </div>
          ) : (
            <div style={{ fontSize: '.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              カバー画面でグレードを選択してください
            </div>
          )}
        </div>

        {/* 中央: 差分 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {hasBase && total > 0 ? (
            <>
              <span style={{ fontSize: '.6875rem', color: 'var(--color-text-muted)', letterSpacing: '.04em' }}>
                差分
              </span>
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: diff! > 0 ? 'var(--color-text)' : 'var(--color-text-muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                {diffSign} ¥ {formatYen(String(diffAbs))}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>→</span>
          )}
        </div>

        {/* 右: コミットメント合計 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: '.6875rem', color: 'var(--color-text-muted)', letterSpacing: '.04em' }}>
            コミットメント合計
          </span>
          <span style={{ fontSize: '1.125rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
            ¥ {formatYen(String(total))}{' '}
            <span style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>/ 年</span>
          </span>
        </div>
      </div>

      {/* 3 項目テーブル */}
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table className="data-table">
          <colgroup>
            <col style={{ width: '5%' }} />
            <col />
            <col style={{ width: '22%' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>No.</th>
              <th>項目・概要</th>
              <th style={{ textAlign: 'right' }}>金額</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '.8125rem' }}>
                  {ITEM_INDEX[i] ?? `${i + 1}.`}
                </td>
                <td>
                  <textarea
                    className="input"
                    style={{ padding: '6px 10px', fontSize: '.8125rem', minHeight: 72, width: '100%', resize: 'vertical', lineHeight: 1.6 }}
                    value={row.rationale}
                    onChange={e => updateCommitment(i, 'rationale', e.target.value)}
                    placeholder="項目と金額の根拠"
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '.8125rem', color: 'var(--color-text-muted)' }}>¥</span>
                    <input
                      className="input"
                      style={{ padding: '6px 8px', fontSize: '.8125rem', textAlign: 'right', flex: 1 }}
                      inputMode="numeric"
                      value={formatYen(row.amount)}
                      onChange={e => updateCommitment(i, 'amount', parseYen(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={2}
                style={{
                  textAlign: 'right',
                  fontWeight: 600,
                  fontSize: '.8125rem',
                  background: 'var(--glass-tint-warm)',
                }}
              >
                合計
              </td>
              <td
                style={{
                  background: 'var(--glass-tint-warm)',
                  fontWeight: 700,
                  textAlign: 'right',
                  fontSize: '.875rem',
                  whiteSpace: 'nowrap',
                }}
              >
                ¥ {formatYen(String(total))} <span style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>円 / 年</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
