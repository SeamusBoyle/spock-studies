var obj = {
  name: 'InversePair'
};

obj.info = function () {
  obj.curves = [{
    title: 'Inverse',
    type: Spock.CurveType.Bar,
    style: Spock.BarCurveStyle.Candle,
    // TODO(seamus): Remove per-bar-color when candle curve gets color property (it's faster)
    hasPerBarColor: true
  }];

  obj._numerator = {
    name: 'Numerator',
    defaultValue: 1,
    type: Spock.ParameterType.Double
  };
  obj.parameters = [obj._numerator];

  obj.requiredSource = Spock.RequiredSource.Bar;

  obj._colors = {
    up: Plot.newColor('royalblue'),
    upWick: Plot.newColor('royalblue'),
    down: Plot.newColor('crimson'),
    downWick: Plot.newColor('crimson')
  };
};

obj.exec = function (period) {
  const ohlc = Plot.getOHLC(period);
  if (ohlc == null)
    return;

  const inverseOhlc = {
    open: obj._numerator.value / ohlc.open,
    high: obj._numerator.value / ohlc.low,
    low: obj._numerator.value / ohlc.high,
    close: obj._numerator.value / ohlc.close
  };

  if (obj._numerator.value < 0)
    inverseOhlc.low = [inverseOhlc.high, inverseOhlc.high = inverseOhlc.low][0];

  const isUp = inverseOhlc.close >= inverseOhlc.open;
  return [{
    value: inverseOhlc,
    color: isUp ? obj._colors.up : obj._colors.down,
    wickColor: isUp ? obj._colors.upWick : obj._colors.downWick
  }];
};
