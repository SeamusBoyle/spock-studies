var obj = {
  name: 'SMMA',
  summary: 'Smoothed Moving Average'
};

obj.info = function () {
  obj.overlay = true;

  obj._smmaCurve = {
    title: 'SMMA'
  };

  obj.curves = [obj._smmaCurve];

  obj._maPeriods = {
    name: 'SMMA periods',
    defaultValue: 7
  };

  obj.parameters = [obj._maPeriods];
  obj.requiredSource = Spock.RequiredSource.Tick;
};

obj.exec = function (period) {
  const n = obj._maPeriods.value;

  if (period === n - 1)
    return [Plot.sma(Plot.getTicks(period, n), n)];
  else if (period > n - 1)
    return [(obj._smmaCurve.output[period - 1] * (n - 1) + Plot.getTick(period)) / n];
};
