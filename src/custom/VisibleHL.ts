import { qFuzzyCompare } from '../lib/FuzzyMath.js';
import { clamp } from '../lib/algorithm.js';

export default class Indicator implements Spock.Indicator {
  name: string;
  summary: string;
  description: string;
  overlay: boolean;

  private highText: Plot.Drawing.Text;
  private lowText: Plot.Drawing.Text;
  private oldHigh: number;
  private oldLow: number;

  constructor() {
    this.name = 'VisibleHL';
    this.summary = 'Display highest and lowest prices';
    this.description = 'An example Study that displays the highest and lowest prices in Text items';
  }

  info = (): void => {
    this.overlay = true;
  };

  preExec = (): void => {
    const color = Plot.newColor('black');
    const pointSize = 18;
    const font = Plot.newFont({ family: 'Monospace', pointSize });
    const brush = Plot.newBrush({ color: 'gold' });
    this.highText = Plot.makeText({ font, color, brush });
    this.lowText = Plot.makeText({ font, color, brush });
  };

  exec = (period: number): void => {
    if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars)
      this.preExec();

    const from = clamp(Math.floor(Plot.barVisibleFirst), 0, period);
    const to = clamp(Math.ceil(Plot.barVisibleLast), 0, period);
    if (from === to)
      return;

    // TODO(seamus): Avoid testing all highs/lows when only the last changed

    const highs = Plot.high(to, to - from);
    if (highs == null)
      return;
    const lows = Plot.low(to, to - from);
    if (lows == null)
      return;

    const highPrice = Math.max(...highs);
    const highIdx = highs.indexOf(highPrice);
    const highPeriod = from + highIdx;
    if (!qFuzzyCompare(highPrice, this.oldHigh)) {
      this.highText.text = 'Hi: ' + Plot.toLocaleDecimalString(highPrice, Plot.displayDigits);
      this.highText.pos = Plot.newPoint(highPeriod, (highPrice + lows[highIdx]) / 2);
      this.oldHigh = highPrice;
    }

    const lowPrice = Math.min(...lows);
    const lowIndex = lows.indexOf(lowPrice);
    const lowPeriod = from + lowIndex;
    if (!qFuzzyCompare(lowPrice, this.oldLow)) {
      this.lowText.text = 'Lo: ' + Plot.toLocaleDecimalString(lowPrice, Plot.displayDigits);
      this.lowText.pos = Plot.newPoint(lowPeriod, (lowPrice + highs[lowIndex]) / 2);
      this.oldLow = lowPrice;
    }
  };
}
