var obj = {
  name: 'CCSMA',
  summary: 'Crossover Candle SMA',
  description: 'Color candlesticks based on SMA crossover'
};

obj.info = function () {
  obj.overlay = true;
  obj.curves = [{
    title: 'CCSMA',
    type: Spock.CurveType.Bar,
    style: Spock.BarCurveStyle.Candle,
    hasPerBarColor: true,
    zIndex: 1
  }];

  obj._slowPeriods = {
    name: 'Slow SMA periods',
    defaultValue: 55
  };

  obj._fastPeriods = {
    name: 'Fast SMA periods',
    defaultValue: 21
  };
  obj.parameters = [obj._slowPeriods, obj._fastPeriods];
  obj.requiredSource = Spock.RequiredSource.Bar;

  obj._colors = {
    over: Plot.newColor('royalblue'),
    overWick: Plot.newColor('royalblue'),
    under: Plot.newColor('crimson'),
    underWick: Plot.newColor('crimson')
  };
};

obj.exec = function (period) {
  // assert period1 > period2
  const prices = Plot.getTicks(period, obj._slowPeriods.value);
  if (prices == null)
    return;

  const slowMa = Plot.sma(prices, obj._slowPeriods.value);
  const fastMa = Plot.sma(prices, obj._fastPeriods.value);

  const isSlowUnder = slowMa <= fastMa;
  const ohlc = Plot.getOHLC(period);
  return [{
    value: ohlc,
    color: isSlowUnder ? obj._colors.over : obj._colors.under,
    wickColor: isSlowUnder ? obj._colors.overWick : obj._colors.underWick,
    hollow: ohlc.close >= ohlc.open
  }];
};
