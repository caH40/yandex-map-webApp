export function roundingNumber(number, order = 0) {
  const m = 10 ** order;
  return Math.trunc(number * m) / m;
}
