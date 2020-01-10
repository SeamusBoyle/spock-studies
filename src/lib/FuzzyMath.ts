export function qFuzzyCompare(p1: number, p2: number): boolean {
  return (Math.abs(p1 - p2) * 1000000000000.0 <= Math.min(Math.abs(p1), Math.abs(p2)));
}

export function qFuzzyCompareZero(p1: number, p2: number): boolean {
  return qFuzzyCompare(1 + p1, 1 + p2);
}

export function qFuzzyIsNull(d: number): boolean {
  return Math.abs(d) <= 0.000000000001;
}
