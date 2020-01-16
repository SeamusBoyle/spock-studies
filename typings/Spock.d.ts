declare namespace Spock {
  enum ParameterType { Int = 1, Double = 2, String = 3, Color = 4, Bool = 5 }
  enum CurveType { Line = 1, Channel = 2, Bar = 3 }
  enum LineCurveStyle {
    Line = 1, Histogram = 2, Steps = 3, Dots = 4, BigDots = 102, Columns = 103, Arrows = 104,
    None = 255
  }
  enum ChannelCurveStyle { Fill = 1, Bar = 2 }
  enum BarCurveStyle { Candle = 1, Ohlc = 2 }
  enum LineStyle { None = 1, Solid = 2, Dash = 3, Dot = 4, DashDot = 5, DashDotDot = 6 }
  enum ArrowsPoint { To = 1, From = 2 }
  enum RequiredSource { Tick = 1, Bar = 2 }
  enum BarUpdateMode { AllBars = 1, NewBars = 2, LastBar = 3 }
  enum FillStyle {
    None = 1,
    Solid = 2,
    Dense1 = 3,
    Dense2 = 4,
    Dense3 = 5,
    Dense4 = 6,
    Dense5 = 7,
    Dense6 = 8,
    Dense7 = 9,
    Hor = 10,
    Ver = 11,
    Cross = 12,
    BDiag = 13,
    FDiag = 14,
    DiagCross = 15
  }
  enum SymbolStyle {
    None = 1,
    Ellipse = 2,
    Rect = 3,
    Diamond = 4,
    Triangle = 5,
    DTriangle = 6,
    UTriangle = 7,
    LTriangle = 8,
    RTriangle = 9,
    Cross = 10,
    XCross = 11,
    HLine = 12,
    VLine = 13,
    Star1 = 14,
    Star2 = 15,
    Hexagon = 16
  }

  interface Ohlc {
    open: number;
    high: number;
    low: number;
    close: number;
  }

  type color = QColor | string;

  interface PerBarBarStyle {
    color?: color;
    wickColor?: color;
    lineWidth?: number;
    hollow?: boolean;
  }

  interface PerBarLineStyle {
    color?: color;
    lineWidth?: number;
    hollow?: boolean;
  }

  interface Curve {
    title: string;
    type?: CurveType;
    zIndex?: number;
    barsOffset?: number;
    showDataTip?: boolean;
    showInLegend?: boolean;
  }

  type vector2d = number[];
  type vector4d = number[];

  interface LineOutputObject extends PerBarLineStyle {
    value: number;
  }

  interface BarOutputObject extends PerBarBarStyle {
    value: vector4d | Ohlc;
  }

  type LineOutputElement = number | LineOutputObject;
  type ChannelOutputElement = vector2d;
  type BarOutputElement = vector4d | Ohlc | BarOutputObject;

  interface LineCurve extends Curve {
    style?: LineCurveStyle;
    hasPerBarColor?: boolean;
    color?: color;
    lineStyle?: LineStyle;
    lineWidth?: number;
    baseline?: number;
    pinPoint?: boolean;
    readonly output?: LineOutputElement[];
  }

  interface ChannelCurve extends Curve {
    style?: ChannelCurveStyle;
    readonly output?: ChannelOutputElement[];
  }

  interface BarCurve extends Curve {
    style?: BarCurveStyle;
    hasPerBarColor?: boolean;
    readonly output?: BarOutputElement;
  }

  /**
   * @private
   */
  interface UndefinedTypeParameter<T> {
    name: string;
    defaultValue: T;
    readonly value?: T;
  }

  /**
   * @private
   */
  interface ParameterBase<T> {
    name: string;
    type: ParameterType;
    defaultValue: T;
    readonly value?: T;
  }

  type IntParameter = ParameterBase<number> | UndefinedTypeParameter<number>;
  type DoubleParameter = ParameterBase<number>;
  type StringParameter = ParameterBase<string>;
  type ColorParameter = ParameterBase<color>;
  type BoolParameter = ParameterBase<boolean>;

  type Parameter = IntParameter | DoubleParameter | StringParameter |
    ColorParameter | BoolParameter;

  /**
   * The info and exec functions must be Instance Functions
   * (https://github.com/microsoft/TypeScript/wiki/%27this%27-in-TypeScript)
   * to maintain compatibility with Latinum 6.5 and later.
   */
  interface Indicator {
    name: string;
    summary?: string;
    description?: string;
    overlay?: boolean;
    curves?: Curve[];
    parameters?: Parameter[];
    requiredSource?: RequiredSource;
    axisMin?: number;
    axisMax?: number;
    info?: () => void;
    exec: (period: number) => number[] | void;
    // HTML string
    help?: () => string;
  }
}
