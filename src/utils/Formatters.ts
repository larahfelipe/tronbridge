export const parseMaybeBigNum = (rawValue: number) => {
  let value = '0';
  if (!rawValue || rawValue <= 0) return value;

  value = rawValue.toLocaleString('en-US', { useGrouping: false });

  return value;
};
