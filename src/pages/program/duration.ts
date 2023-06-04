
export function formatSeconds(seconds: number) {
  // choose proper unit from nanoseconds to days
  const units = ['ns', 'μs', 'ms', 's'];
  const multipliers = [1, 1000, 1000, 1000];

  let value = seconds * 1e9; // start with nanoseconds

  let unit = 0;
  while (unit < units.length - 1 && value >= multipliers[unit + 1]) {
    unit++;
    value /= multipliers[unit];
  }

  return `${value.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })} ${units[unit]}`;
}