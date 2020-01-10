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
   * @deprecated
   */
  function newLine(x1: number, y1: number, x2: number, y2: number): QLineF;

  /**
   * @deprecated
   */
  function newRect(x: number, y: number, width: number, height: number): QRectF;

  /**
   * @deprecated
   */
  function newSize(w: number, h: number): QSizeF;

  /**
   * @deprecated
   */
  interface PenOpt {
    color?: Spock.color;
    width?: number;
    style?: Spock.LineStyle;
  }

  /**
   * @deprecated
   */
  function newPen(options?: PenOpt): QPen;

  /**
   * @deprecated
   */
  interface BrushOpt {
    color?: Spock.color;
    style?: Spock.FillStyle;
  }

  /**
   * @deprecated
   */
  function newBrush(options?: BrushOpt): QBrush;

  /**
   * @deprecated
   */
  interface FontOpt {
    family?: string;
    pointSize?: number;
    weight?: number;
    italic?: boolean;
  }

  /**
   * @deprecated
   */
  function newFont(options?: FontOpt): QFont;

  /**
   * @deprecated
   */
  function addHLine(y1: number, pen: QPen, id: string): void;

  /**
   * @deprecated
   */
  function addVLine(x1: number, pen: QPen, id: string): void;

  /**
   * @deprecated
   */
  function addLine(line: QLineF, pen: QPen, id: string): void;

  /**
   * @deprecated
   */
  function addRect(rect: QRectF, pen: QPen, brush: QBrush, id: string): void;

  /**
   * @deprecated
   */
  function addEllipse(rect: QRectF, pen: QPen, brush: QBrush, id: string): void;

  /**
   * @deprecated
   */
  interface SymbolOpt {
    style: Spock.SymbolStyle;
    brush?: QBrush;
    pen?: QPen;
    size: QSizeF;
  }

  /**
   * @deprecated
   */
  interface AddSymbolOpt {
    id: string;
    pos: QPointF;
    symbol: SymbolOpt;
  }

  /**
   * @deprecated
   */
  function addSymbol(options: AddSymbolOpt): void;

  /**
   * @deprecated
   */
  interface AddTextOpt {
    id: string;
    pos: QPointF;
    text: string;
    font?: QFont;
    pen?: QPen;
    brush?: QBrush;
  }

  /**
   * @deprecated
   */
  function addText(options: AddTextOpt): void;

  /**
   * @deprecated
   */
  interface AddLabelOpt {
    id: string;
    pos: QPointF;
    text: string;
    font?: QFont;
    pen?: QPen;
    brush?: QBrush;
  }

  /**
   * @deprecated
   */
  function addLabel(options: AddLabelOpt): void;

  function alertMessage(message: string): void;

  /**
   * @private @deprecated
   */
  function replot(): void;

  /**
   * @deprecated
   */
  function removeDrawing(id: string): void;

  /**
   * @deprecated
   */
  function removeAllDrawings(): void;
}
