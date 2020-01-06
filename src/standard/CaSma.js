const obj = {
  name: 'CASMA',
  summary: 'Crossover Arrow SMA',
  description: 'Plots an arrow based on an SMA crossover, ' +
    'the arrow points to the first candle that opened after the cross.'
};

obj.info = function () {
  obj.overlay = true;
  obj.curves = [{
    title: 'Crossover',
    style: Spock.LineCurveStyle.Arrows,
    hasPerBarColor: true
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
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars)
    obj._isSlowUnder = new Array(obj._slowPeriods.value);

  // assert period1 > period2
  const prices = Plot.getTicks(period, obj._slowPeriods.value);
  if (prices == null)
    return;

  const slowMa = Plot.sma(prices, obj._slowPeriods.value);
  const fastMa = Plot.sma(prices, obj._fastPeriods.value);

  obj._isSlowUnder[period] = slowMa <= fastMa;

  if (obj._isSlowUnder[period - 2] == undefined)
    return;

  const didChange = obj._isSlowUnder[period - 1] != obj._isSlowUnder[period - 2];
  if (!didChange)
    return;

  if (obj._isSlowUnder[period - 1]) {
    return [{
      value: Plot.low(period),
      color: obj._colors.over,
      hollow: true
    }];
  }
  return [{
    value: Plot.high(period),
    color: obj._colors.under,
    hollow: false
  }];
};
