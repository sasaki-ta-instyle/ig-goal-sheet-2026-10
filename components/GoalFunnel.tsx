'use client';

import { FormData } from '@/lib/types';

interface Props {
  formData: FormData;
  currentStep: number;
}

function truncate(s: string | undefined | null, n: number): string {
  if (!s) return '';
  const t = s.trim();
  return t.length > n ? t.slice(0, n) + '…' : t;
}

interface TierMeta {
  step: number;
  label: string;
  index: string;
}

const TIERS: TierMeta[] = [
  { step: 2, label: 'グループ', index: '01' },
  { step: 3, label: '会社', index: '02' },
  { step: 4, label: '部署', index: '03' },
  { step: 5, label: '個人', index: '04' },
];

export default function GoalFunnel({ formData, currentStep }: Props) {
  const personalSummary = formData.personal.smartGoals
    .map(g => g.s)
    .filter(s => s && s.trim())
    .join(' / ')
    || formData.personal.kpiContribs.map(k => k.myPart).filter(s => s && s.trim()).join(' / ')
    || formData.personal.currentStatus.find(s => s.label.includes('期待'))?.value
    || '';

  const summaries: Record<number, string> = {
    2: truncate(formData.group.strategicFocus, 76) || '戦略の方向性を記入',
    3: truncate(formData.company.strategicFocus, 76) || '会社の戦略を記入',
    4: truncate(formData.dept.mission || formData.dept.kgi1.kgi || formData.dept.kgi1.mission, 76)
      || '部署のミッション / KGI を記入',
    5: truncate(personalSummary, 76) || '個人の SMART 目標を記入',
  };

  return (
    <div
      style={{
        background: 'var(--glass-tinted)',
        borderRadius: 'var(--r)',
        padding: '20px 14px 24px',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,.7), 0 4px 16px rgba(53,54,45,.08)',
      }}
    >
      <p
        style={{
          fontSize: '.625rem',
          fontWeight: 700,
          color: 'var(--color-text-muted)',
          letterSpacing: '.14em',
          marginBottom: 4,
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        Goal Cascade
      </p>
      <p
        style={{
          fontSize: '.6875rem',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          marginBottom: 16,
          lineHeight: 1.5,
        }}
      >
        大きな戦略から個人の動きへ
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        {TIERS.map((tier, i) => {
          // すり鉢状: 100% → 90% → 80% → 70%
          const widthPct = 100 - i * 10;
          const isActive = currentStep === tier.step;
          const isPast = currentStep > tier.step;
          const isFuture = currentStep < tier.step;
          const taper = 4; // px shaved from each side at the bottom = mortar/funnel slope

          return (
            <div key={tier.step} style={{ width: '100%', position: 'relative' }}>
              {/* downward arrow between tiers */}
              {i > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: -3,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: '5px solid var(--color-text-muted)',
                    opacity: 0.5,
                  }}
                />
              )}
              <div
                style={{
                  width: `${widthPct}%`,
                  margin: '0 auto',
                  padding: '10px 12px',
                  background: isActive
                    ? 'rgba(255,255,255,.95)'
                    : isPast
                    ? 'rgba(255,255,255,.6)'
                    : 'rgba(255,255,255,.28)',
                  clipPath: `polygon(0 0, 100% 0, calc(100% - ${taper}px) 100%, ${taper}px 100%)`,
                  boxShadow: isActive
                    ? 'inset 0 1px 0 rgba(255,255,255,.95), 0 4px 16px rgba(53,54,45,.14)'
                    : 'inset 0 1px 0 rgba(255,255,255,.6)',
                  opacity: isFuture ? 0.55 : 1,
                  transition: 'all 250ms cubic-bezier(.4,0,.2,1)',
                  marginTop: i === 0 ? 0 : 6,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: '.75rem',
                      fontWeight: 700,
                      color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                      letterSpacing: '.02em',
                    }}
                  >
                    {tier.label}
                  </span>
                  <span
                    style={{
                      fontSize: '.5625rem',
                      color: 'var(--color-text-muted)',
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {tier.index}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '.6875rem',
                    lineHeight: 1.55,
                    color: isActive
                      ? 'var(--color-text)'
                      : isPast
                      ? 'var(--color-text)'
                      : 'var(--color-text-muted)',
                    margin: 0,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    wordBreak: 'break-word',
                  }}
                >
                  {summaries[tier.step]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p
        style={{
          marginTop: 14,
          fontSize: '.625rem',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        {currentStep >= 2 && currentStep <= 5
          ? `現在：${TIERS.find(t => t.step === currentStep)?.label ?? ''}目標`
          : currentStep === 6
          ? '現在：自己見積もり'
          : '　'}
      </p>
    </div>
  );
}
