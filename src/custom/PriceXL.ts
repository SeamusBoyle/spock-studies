import { qFuzzyCompare } from '../lib/FuzzyMath.js';

export default class Indicator implements Spock.Indicator {
  name: string;
  summary: string;
  description: string;
  overlay: boolean;

  private priceLabel: Plot.Drawing.Label;
  private upColor: QColor;
  private downColor: QColor;
  private upBorderPen: QPen;
  private downBorderPen: QPen;
  private oldLatest: number;
  private oldWasUp: boolean;

  constructor() {
    this.name = 'PriceXL';
    this.summary = 'Display the latest price';
    this.description = 'An example Study that displays the latest price in a Label item';
  }

  info = (): void => {
    this.overlay = true;
  };

  preExec = (): void => {
    this.oldWasUp = true;
    this.upColor = Plot.newColor('#0b893e');
    this.downColor = Plot.newColor('#bf1722');
    this.upBorderPen = Plot.newPen({ color: this.upColor, width: 3 });
    this.downBorderPen = Plot.newPen({ color: this.downColor, width: 3 });
    this.priceLabel = Plot.makeLabel({
      horizontalAlignment: Spock.Alignment.Top,
      verticalAlignment: Spock.Alignment.Left,
      font: Plot.newFont({ family: 'Monospace', pointSize: 36 }),
      color: this.upColor,
      brush: Plot.newBrush({ color: 'transparent' }),
      margin: 10
    });
    this.priceLabel.borderRadius = 8;
    this.priceLabel.borderPen = this.upBorderPen;
  };

  exec = (period: number): void => {
    if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars)
      this.preExec();

    const latest = Plot.close(period);

    if (!qFuzzyCompare(this.oldLatest, latest)) {
      const isUp = latest >= this.oldLatest;
      this.priceLabel.text = `${isUp ? '▲' : '▼'} ${Plot.toLocaleDecimalString(latest, Plot.displayDigits)}`;
      if (this.oldWasUp !== isUp) {
        if (isUp) {
          this.priceLabel.color = this.upColor;
          this.priceLabel.borderPen = this.upBorderPen;
        } else {
          this.priceLabel.color = this.downColor;
          this.priceLabel.borderPen = this.downBorderPen;
        }
        this.oldWasUp = isUp;
      }
    }

    this.oldLatest = latest;
  };
}
