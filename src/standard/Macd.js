var obj = {
  name: 'MACD',
  summary: 'Moving Average Convergence/Divergence'
};

obj.info = function () {
  obj._macdCurve = {
    title: 'MACD',
    lineWidth: 2
  };

  obj._signalCurve = {
    title: 'Signal',
    lineStyle: Spock.LineStyle.Dash,
    lineWidth: 2
  };

  obj.curves = [obj._macdCurve, obj._signalCurve, {
    title: 'MACD Hist',
    style: Spock.LineCurveStyle.Histogram,
    lineWidth: 2,
    zIndex: -1
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

  const macd = obj._fast[period] - obj._slow[period];
  let signal_;

  if (period === obj._slowPeriods.value + obj._signalPeriods.value) {
    // The MACD lines output hasn't been written yet,
    // so get a slice of the needed history excluding the current
    // period, then append the current periods MACD value
    const macdHistory = obj._macdCurve.output.slice(period - obj._signalPeriods.value, period - 1);
    macdHistory.push(macd);
    signal_ = Plot.sma(macdHistory, obj._signalPeriods.value);
  } else if (period > obj._signalPeriods.value) {
    signal_ = Plot.ema(macd, obj._signalPeriods.value, obj._signalCurve.output[period - 1]);
  }

  const histogram = macd !== undefined && signal_ !== undefined ? macd - signal_ : null;
  return [macd, signal_, histogram];
};
