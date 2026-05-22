'use client';
import { PersonalGoalData, CommitmentRow } from '@/lib/types';

interface Props {
  data: PersonalGoalData;
  onChange: (data: PersonalGoalData) => void;
}

const ITEM_INDEX = ['①', '②', '③'];

export default function CommitmentForm({ data, onChange }: Props) {
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

  return (
    <div>
      <p className="section-title">05｜コミットメント 記入シート</p>

      <p style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 6 }}>コミットメントは、希望ではなく、自分で負う約束です。</p>
      <p style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
        <strong>報酬は、申告するものではなく、獲得するもの。</strong>西村さんから見て、あなたはこのグレードでこの<strong>基準年収</strong>。それに対してあなた自身は、提供している（提供できる）価値を積み上げ、合計いくらの<strong>コミットメント</strong>になるか、根拠から書き出してください。出した数字は、<strong>半年後に行動と結果で答え合わせ</strong>をします。
      </p>

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
