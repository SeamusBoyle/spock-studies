/**
 * https://en.cppreference.com/w/cpp/algorithm/clamp
 */
export function clamp(v: number, lo: number, hi: number): number {
  // console.assert(!(hi < lo));
  return (v < lo) ? lo : (hi < v) ? hi : v;
}
