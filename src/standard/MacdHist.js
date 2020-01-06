const obj = {
  name: 'MACD-Hist',
  summary: 'MACD-Histogram'
};

obj.info = function () {
  obj.curves = [{
    title: 'MACD Hist',
    style: Spock.LineCurveStyle.Columns,
    lineWidth: 1,
  }];

  obj._fastPeriods = {
    name: 'Fast periods',
    defaultValue: 12
  };

  obj._slowPeriods = {
    name: 'Slow periods',
    defaultValue: 26
  };

  obj._signalPeriods = {
    name: 'Signal periods',
    defaultValue: 9
  };
  obj.parameters = [obj._fastPeriods, obj._slowPeriods, obj._signalPeriods];
  obj.requiredSource = Spock.RequiredSource.Tick;
};

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._fast = new Array(obj._fastPeriods.value);
    obj._slow = new Array(obj._slowPeriods.value);
    obj._macd = new Array(obj._slowPeriods.value);
    obj._signal = new Array(obj._slowPeriods.value + obj._signalPeriods.value);
  }

  if (period === obj._fastPeriods.value)
    obj._fast[period] = Plot.sma(Plot.getTicks(period, obj._fastPeriods.value), obj._fastPeriods.value);
  else if (period > obj._fastPeriods.value)
    obj._fast[period] = Plot.ema(Plot.getTick(period), obj._fastPeriods.value, obj._fast[period - 1]);

  if (period === obj._slowPeriods.value)
    obj._slow[period] = Plot.sma(Plot.getTicks(period, obj._slowPeriods.value), obj._slowPeriods.value);
  else if (period > obj._slowPeriods.value)
    obj._slow[period] = Plot.ema(Plot.getTick(period), obj._slowPeriods.value, obj._slow[period - 1]);

  if (period < obj._fastPeriods.value || period < obj._slowPeriods.value)
    return;

  obj._macd[period] = obj._fast[period] - obj._slow[period];

  if (period === obj._slowPeriods.value + obj._signalPeriods.value)
    obj._signal[period] = Plot.sma(obj._macd, obj._signalPeriods.value);
  else if (period > obj._signalPeriods.value)
    obj._signal[period] = Plot.ema(obj._macd[period], obj._signalPeriods.value, obj._signal[period - 1]);

  const histogram = obj._macd[period] !== undefined &&
    obj._signal[period] !== undefined ? obj._macd[period] - obj._signal[period] : null;
  return [histogram];
};
