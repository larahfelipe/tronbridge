export const parseMaybeBigNum = (rawValue: string | number, fallback = '0') => {
  if (!rawValue || +rawValue <= 0) return fallback;

  const value = rawValue.toLocaleString('en-US', { useGrouping: false });

  return value;
};
