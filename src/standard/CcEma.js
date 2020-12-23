var obj = {
  name: 'CCEMA',
  summary: 'Crossover Candle EMA',
  description: 'Color candlesticks based on EMA crossover'
};

obj.info = function () {
  obj.overlay = true;
  obj.curves = [{
    title: 'CCEMA',
    type: Spock.CurveType.Bar,
    style: Spock.BarCurveStyle.Candle,
    hasPerBarColor: true,
    zIndex: 1
  }];

  obj._slowPeriods = {
    name: 'Slow EMA periods',
    defaultValue: 55
  };

  obj._fastPeriods = {
    name: 'Fast EMA periods',
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
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._slow = new Array(obj._slowPeriods.value);
    obj._fast = new Array(obj._fastPeriods.value);
  }

  if (period === obj._slowPeriods.value)
    obj._slow[period] = Plot.sma(Plot.getTicks(period, obj._slowPeriods.value), obj._slowPeriods.value);
  else if (period > obj._slowPeriods.value)
    obj._slow[period] = Plot.ema(Plot.getTick(period), obj._slowPeriods.value, obj._slow[period - 1]);

  if (period === obj._fastPeriods.value)
    obj._fast[period] = Plot.sma(Plot.getTicks(period, obj._fastPeriods.value), obj._fastPeriods.value);
  else if (period > obj._fastPeriods.value)
    obj._fast[period] = Plot.ema(Plot.getTick(period), obj._fastPeriods.value, obj._fast[period - 1]);

  if (period < obj._slowPeriods.value || period < obj._fastPeriods.value)
    return;

  // slow is under fast
  const isSlowUnder = obj._slow[period] <= obj._fast[period];
  const ohlc = Plot.getOHLC(period);
  return [{
    value: ohlc,
    color: isSlowUnder ? obj._colors.over : obj._colors.under,
    wickColor: isSlowUnder ? obj._colors.overWick : obj._colors.underWick,
    hollow: ohlc.close >= ohlc.open
  }];
};
