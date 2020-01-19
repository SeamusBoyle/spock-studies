declare namespace Plot {
  const barUpdateMode: Spock.BarUpdateMode;

  /**
   * @deprecated
   */
  const barVisibleFirst: number;

  /**
   * @deprecated
   */
  const barVisibleLast: number;

  /**
   * @deprecated
   */
  const barsVisible: number;

  function open(i: number): number;
  function open(i: number, len: number): number[];
  function high(i: number): number;
  function high(i: number, len: number): number[];
  function low(i: number): number;
  function low(i: number, len: number): number[];
  function close(i: number): number;
  function close(i: number, len: number): number[];
  function volume(i: number): number;
  function volume(i: number, len: number): number[];
  function openInterest(i: number): number;
  function openInterest(i: number, len: number): number[];
  function timestamp(i: number): number;
  function timestamp(i: number, len: number): number[];

  function median(i: number): number;
  function median(i: number, len: number): number[];
  function typical(i: number): number;
  function typical(i: number, len: number): number[];
  function weighted(i: number): number;
  function weighted(i: number, len: number): number[];

  function getTick(i: number): number;
  function getTicks(i: number, len: number): number[];

  function getOHLC(i: number): Spock.Ohlc;

  function ema(num: number, periods: number, previousValue: number): number;
  function max(arr: number[], periods: number): number;
  function min(arr: number[], periods: number): number;
  function sma(arr: number[], periods: number): number;
  function stddev(arr: number[], periods: number): number;
  function sum(arr: number[], periods: number): number;

  function newColor(name: string): QColor;

  /**
   * @deprecated
   */
  function newPoint(x: number, y: number): QPointF;

  /**
   * @deprecated @experimental
   */
  function newLine(pt1: QPointF, pt2: QPointF): QLineF;

  /**
   * @deprecated
   */
  function newLine(x1: number, y1: number, x2: number, y2: number): QLineF;

  /**
   * @deprecated @experimental
   */
  function newRect(topLeft: QPointF, size: QSizeF): QRectF;

  /**
   * @deprecated @experimental
   */
  function newRect(topLeft: QPointF, bottomRight: QPointF): QRectF;

  /**
   * @deprecated
   */
  function newRect(x: number, y: number, width: number, height: number): QRectF;

  /**
   * @deprecated
   */
  function newSize(w: number, h: number): QSizeF;

  /**
   * @deprecated @experimental
   */
  interface PenOpt {
    color?: Spock.color;
    width?: number;
    style?: Spock.LineStyle;
  }

  /**
   * @deprecated @experimental
   */
  function newPen(options?: PenOpt): QPen;

  /**
   * @deprecated @experimental
   */
  interface BrushOpt {
    color?: Spock.color;
    style?: Spock.FillStyle;
  }

  /**
   * @deprecated @experimental
   */
  function newBrush(options?: BrushOpt): QBrush;

  /**
   * @deprecated @experimental
   */
  interface FontOpt {
    family?: string;
    pointSize?: number;
    weight?: number;
    italic?: boolean;
  }

  /**
   * @deprecated @experimental
   */
  function newFont(options?: FontOpt): QFont;

  namespace Drawing {
    /**
     * @deprecated @experimental
     */
    interface Item {
      visible: boolean;
    }

    /**
     * @deprecated @experimental
     */
    interface HLine extends Item {
      y: number;
    }

    /**
     * @deprecated @experimental
     */
    interface VLine extends Item {
      x: number;
    }

    /**
     * @deprecated @experimental
     */
    interface Line extends Item {
      line: QLineF;
    }

    /**
     * @deprecated @experimental
     */
    interface Rect extends Item {
      rect: QRectF;
    }

    /**
     * @deprecated @experimental
     */
    interface Ellipse extends Item {
      rect: QRectF;
    }

    /**
     * @deprecated @experimental
     */
    interface Symbol extends Item {
      pos: QPointF;
    }

    /**
     * @deprecated @experimental
     */
    interface Text extends Item {
      pos: QPointF;
      text: string;
      color: QColor;
    }

    /**
     * @deprecated @experimental
     */
    interface Label extends Item {
      horizontalAlignment: Spock.Alignment;
      verticalAlignment: Spock.Alignment;
      pos: QPointF;
      text: string;
      color: QColor;
      margin: number;
      borderRadius: number;
      borderPen: QPen;
    }
  }

  /**
   * @deprecated @experimental
   */
  interface MakeHLineOptions {
    y?: number;
    pen?: QPen;
  }

  /**
   * @deprecated @experimental
   */
  function makeHLine(options?: MakeHLineOptions): Drawing.HLine;

  /**
   * @deprecated @experimental
   */
  interface MakeVLineOptions {
    x?: number;
    pen?: QPen;
  }

  /**
   * @deprecated @experimental
   */
  function makeVLine(options?: MakeVLineOptions): Drawing.VLine;

  /**
   * @deprecated @experimental
   */
  interface MakeLineOptions {
    line?: QLineF;
    pen?: QPen;
  }

  /**
   * @deprecated @experimental
   */
  function makeLine(options?: MakeLineOptions): Drawing.Line;

  /**
   * @deprecated @experimental
   */
  interface MakeRectOptions {
    rect?: QRectF;
    pen?: QPen;
    brush?: QBrush;
  }

  /**
   * @deprecated @experimental
   */
  function makeRect(options?: MakeRectOptions): Drawing.Rect;

  /**
   * @deprecated @experimental
   */
  interface MakeEllipseOptions {
    rect?: QRectF;
    pen?: QPen;
    brush?: QBrush;
  }

  /**
   * @deprecated @experimental
   */
  function makeEllipse(options?: MakeEllipseOptions): Drawing.Ellipse;

  /**
   * @deprecated @experimental
   */
  interface SymbolOptions {
    style?: Spock.SymbolStyle;
    brush?: QBrush;
    pen?: QPen;
    size?: QSizeF;
  }

  /**
   * @deprecated @experimental
   */
  interface MakeSymbolOptions {
    pos?: QPointF;
    symbol?: SymbolOptions;
  }

  /**
   * @deprecated @experimental
   */
  function makeSymbol(options?: MakeSymbolOptions): Drawing.Symbol;

  /**
   * @deprecated @experimental
   */
  interface MakeTextOptions {
    pos?: QPointF;
    text?: string;
    font?: QFont;
    color?: Spock.color;
    brush?: QBrush;
  }

  /**
   * @deprecated @experimental
   */
  function makeText(options?: MakeTextOptions): Drawing.Text;

  /**
   * @deprecated @experimental
   */
  interface MakeLabelOptions {
    horizontalAlignment?: Spock.Alignment;
    verticalAlignment?: Spock.Alignment;
    pos?: QPointF;
    text?: string;
    font?: QFont;
    color?: Spock.color;
    brush?: QBrush;
    margin?: number;
  }

  /**
   * @deprecated @experimental
   */
  function makeLabel(options?: MakeLabelOptions): Drawing.Label;

  /**
   * @deprecated @experimental
   */
  function transformX(x: number): number;
  /**
   * @deprecated @experimental
   */
  function transformY(y: number): number;
  /**
   * @deprecated @experimental
   */
  function invTransformX(x: number): number;
  /**
   * @deprecated @experimental
   */
  function invTransformY(y: number): number;
  /**
   * @deprecated @experimental
   */
  function transform(pos: QPointF): QPointF;
  /**
   * @deprecated @experimental
   */
  function transform(rect: QRectF): QRectF;
  /**
   * @deprecated @experimental
   */
  function invTransform(pos: QPointF): QPointF;
  /**
   * @deprecated @experimental
   */
  function invTransform(rect: QRectF): QRectF;

  function alertMessage(message: string): void;

  /**
   * @deprecated @experimental
   */
  const displayDigits: number;

  /**
   * @deprecated @experimental
   */
  function toLocaleDecimalString(num: number, digits: number): string;

  /**
   * @private @deprecated
   */
  function replot(): void;

  /**
   * @deprecated
   */
  function removeAllDrawings(): void;
}
