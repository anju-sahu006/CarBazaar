import React from 'react';
import { TrendingDown, CheckCircle2, TrendingUp } from 'lucide-react';
import { computeFairPriceEstimate } from '../utils/formatters';

export default function FairPriceBadge({ car, allCars, showDisclaimer = false }) {
  const estimate = computeFairPriceEstimate(car, allCars);
  if (!estimate) return null;

  const Icon =
    estimate.tone === 'success'
      ? TrendingDown
      : estimate.tone === 'warning'
      ? TrendingUp
      : CheckCircle2;

  return (
    <div>
      <span
        className={`badge badge-${estimate.tone}`}
        title={estimate.note}
      >
        <Icon size={13} />
        <span>{estimate.label}</span>
      </span>
      {showDisclaimer && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          {estimate.note}
        </p>
      )}
    </div>
  );
}
