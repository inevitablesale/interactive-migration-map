export const formatCommuteTime = (seconds: number | null) => {
  if (!seconds) return 'N/A';
  const minutesPerDay = Math.round(seconds / 60);
  return `${minutesPerDay} minutes/day`;
};

export const formatRank = (rank: number | null) => {
  if (!rank) return '';
  return `(Rank: ${rank.toLocaleString()})`;
};

export const getMetricColor = (value: number, type: 'growth' | 'density' | 'saturation' | 'money' | 'population') => {
  switch(type) {
    case 'growth':
      if (value >= 5) return 'text-emerald-400';
      if (value >= 0) return 'text-yellow-400';
      return 'text-red-400';
    case 'density':
      if (value >= 2) return 'text-blue-400';
      if (value >= 1) return 'text-indigo-400';
      return 'text-purple-400';
    case 'saturation':
      if (value <= 0.3) return 'text-teal-400';
      if (value <= 0.5) return 'text-cyan-400';
      return 'text-sky-400';
    case 'money':
      return 'text-green-400';
    case 'population':
      return 'text-violet-400';
    default:
      return 'text-white';
  }
};

export const calculateAccountantsPerFirm = (private_accountants: number, public_accountants: number, total_firms: number) => {
  if (!total_firms) return 0;
  return ((private_accountants + public_accountants) / total_firms).toFixed(1);
};