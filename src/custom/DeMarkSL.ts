import { qFuzzyCompare } from '../lib/FuzzyMath.js';

export default class Indicator implements Spock.Indicator {
  name: string;
  summary: string;
  overlay: boolean;
  requiredSource: Spock.RequiredSource;

  private uptrendStop: number;
  private downtrendStop: number;
  private period: number;
  private symbolOffset: number;
  private upSymbol: Plot.Drawing.Symbol;
  private downSymbol: Plot.Drawing.Symbol;

  constructor() {
    this.name = 'DeMarkSL';
    this.summary = 'DeMark Stop-Loss';
  }

  info = (): void => {
    this.overlay = true;
    this.requiredSource = Spock.RequiredSource.Bar;

    this.symbolOffset = 1;
  };

  preExec = (): void => {
    const color = Plot.newColor('red');
    const symbolWidth = 22;
    const width = 2;
    const symbol: Plot.SymbolOptions = {
      size: Plot.newSize(symbolWidth, symbolWidth),
      style: Spock.SymbolStyle.HLine,
      brush: Plot.newBrush({ color }),
      pen: Plot.newPen({ width, color })
    };

    this.upSymbol = Plot.makeSymbol({ symbol });
    this.downSymbol = Plot.makeSymbol({ symbol });
  };

  exec = (period: number): number[] => {
    if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars)
      this.preExec();

    if (period < 1)
      return;

    const prevClose = Plot.close(period - 1);
    const currentMax = Plot.high(period);
    const currentMin = Plot.low(period);
    const uptrendStop = currentMin - (Math.max(currentMax, prevClose) - currentMin);
    const downtrendStop = currentMax - (Math.max(currentMin, prevClose) - currentMax);

    if (this.period !== period || !qFuzzyCompare(this.uptrendStop, uptrendStop)) {
      this.upSymbol.pos = Plot.newPoint(period + this.symbolOffset, uptrendStop);
      this.uptrendStop = uptrendStop;
    }

    if (this.period !== period || !qFuzzyCompare(this.downtrendStop, downtrendStop)) {
      this.downSymbol.pos = Plot.newPoint(period + this.symbolOffset, downtrendStop);
      this.downtrendStop = downtrendStop;
    }

    this.period = period;
  };

  help = (): string => {
    return `<h1>${this.summary}</h1><h2>Formula</h2>
<p><code>Uptrend stop-loss: Current min price - (MAX(current max price; previous close price) - current min price)</code></p>
<p><code>Downtrend stop-loss: Current max price - (MAX(current min price; previous close price) - current max price)</code></p>`;
  };
}
