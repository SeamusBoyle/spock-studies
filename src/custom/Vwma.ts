
export default class Indicator implements Spock.Indicator {
  name: string;
  summary: string;
  overlay: boolean;
  curves: Spock.Curve[];
  parameters: Spock.Parameter[];
  requiredSource: Spock.RequiredSource;

  private maPeriods: Spock.IntParameter;
  private cv: number[];
  private v: number[];

  constructor() {
    this.name = 'VWMA2';
    this.summary = 'Volume-Weighted Moving Average';
  }

  info = (): void => {
    this.overlay = true;
    this.curves = [{ title: 'VWMA' }];

    this.maPeriods = {
      name: 'VWMA periods',
      defaultValue: 20
    };

    this.parameters = [this.maPeriods];
    this.requiredSource = Spock.RequiredSource.Bar;
  };

  exec = (period: number): number[] => {
    const n = this.maPeriods.value;

    if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
      this.cv = new Array(n);
      this.v = new Array(n);
      // sums, rolling
      /*
      this.cvS = new Array(n)
      this.vS = new Array(n)
      */
    }

    const c0 = Plot.getTick(period);
    const v0 = Plot.volume(period);
    const cv0 = c0 * v0;
    this.cv[period] = cv0;
    this.v[period] = v0;

    // TODO(seamus): Use rolling window
    if (period + 1 >= n) {
      const start = period + 1 - n;
      const end = period + 1;
      const cv = this.cv.slice(start, end);
      const v = this.v.slice(start, end);
      const cvS = Plot.sum(cv, cv.length);
      const vS = Plot.sum(v, v.length);
      /*
      this.cvS[period] = cvS
      this.vS[period] = vS
      */
      return [cvS / vS];
    }
  };
}
