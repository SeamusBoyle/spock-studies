// NOTE(seamus): Keep same order as qnamespace.h

declare namespace Qt {
  enum PenStyle {
    NoPen,
    SolidLine,
    DashLine,
    DotLine,
    DashDotLine,
    DashDotDotLine,
    CustomDashLine
  }

  enum BrushStyle {
    NoBrush,
    SolidPattern,
    Dense1Pattern,
    Dense2Pattern,
    Dense3Pattern,
    Dense4Pattern,
    Dense5Pattern,
    Dense6Pattern,
    Dense7Pattern,
    HorPattern,
    VerPattern,
    CrossPattern,
    BDiagPattern,
    FDiagPattern,
    DiagCrossPattern,
    LinearGradientPattern,
    RadialGradientPattern,
    ConicalGradientPattern,
    TexturePattern = 24
  }
}
