'use client';
import { PersonalGoalData, MarketValueRow } from '@/lib/types';

interface Props {
  data: PersonalGoalData;
  onChange: (data: PersonalGoalData) => void;
}

const ITEM_INDEX = ['①', '②', '③', '④', '⑤'];

export default function MarketValueForm({ data, onChange }: Props) {
  const updateMarket = (i: number, field: keyof MarketValueRow, value: string) => {
    const arr = data.marketValue.map((r, idx) => (idx === i ? { ...r, [field]: value } : r));
    onChange({ ...data, marketValue: arr });
  };
  const formatYen = (raw: string) => {
    if (!raw) return '';
    const n = Number(raw);
    if (!Number.isFinite(n)) return raw;
    return n.toLocaleString('ja-JP');
  };
  const parseYen = (v: string) =>
    v.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/[^\d]/g, '');

  const total = data.marketValue.reduce(
    (s, r) => s + (parseInt(r.amount || '0', 10) || 0),
    0,
  );

  return (
    <div>
      <p className="section-title">05｜自己見積もり 記入シート</p>

      <p style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 6 }}>自分の市場価値（自己見積もり）</p>
      <p style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
        今期の自分はいくらで<strong>「求められる」</strong>人材か。報酬は<strong>生み出した価値に従って獲得する</strong>もの。希望年収ではなく、提供している（提供できる）価値の根拠を 3 つ挙げ、<strong>見積書</strong>のように内訳と金額を書き出してみてください。下に合計が出ます。
      </p>

      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table className="data-table">
          <colgroup>
            <col style={{ width: '5%' }} />
            <col style={{ width: '18%' }} />
            <col />
            <col style={{ width: '22%' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>No.</th>
              <th>項目</th>
              <th>根拠（顧客・貢献・需要の中身）</th>
              <th style={{ textAlign: 'right' }}>金額</th>
            </tr>
          </thead>
          <tbody>
            {data.marketValue.map((row, i) => (
              <tr key={i}>
                <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '.8125rem' }}>
                  {ITEM_INDEX[i] ?? `${i + 1}.`}
                </td>
                <td>
                  <input
                    className="input"
                    style={{ padding: '6px 8px', fontSize: '.8125rem', width: '100%' }}
                    value={row.label}
                    onChange={e => updateMarket(i, 'label', e.target.value)}
                    placeholder="例：顧客への貢献"
                  />
                </td>
                <td>
                  <textarea
                    className="input"
                    style={{ padding: '6px 10px', fontSize: '.8125rem', minHeight: 60, width: '100%', resize: 'vertical' }}
                    value={row.rationale}
                    onChange={e => updateMarket(i, 'rationale', e.target.value)}
                    placeholder="どんな顧客に、どんな貢献をしていて、どこから需要があるか"
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
                      onChange={e => updateMarket(i, 'amount', parseYen(e.target.value))}
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
                colSpan={3}
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
