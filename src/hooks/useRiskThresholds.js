const STORAGE_KEY = 'credit-ui-risk-thresholds';

const DEFAULTS = {
  high: 0.5,
  medium: 0.2,
};

export function getRiskThresholds() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        high: Number(parsed.high) || DEFAULTS.high,
        medium: Number(parsed.medium) || DEFAULTS.medium,
      };
    }
  } catch {}
  return DEFAULTS;
}

export function setRiskThresholds({ high, medium }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ high, medium }));
}

export function getRiskLevel(probability) {
  const { high, medium } = getRiskThresholds();
  if (probability > high) return { label: 'High Risk', color: 'text-destructive' };
  if (probability > medium) return { label: 'Medium Risk', color: 'text-yellow-600' };
  return { label: 'Low Risk', color: 'text-green-600' };
}

export function getRiskColor(probability) {
  return getRiskLevel(probability).color;
}
