const obj = {
  name: 'EmaEnv',
  summary: 'Exponential Moving Average Envelopes'
};

obj.info = function () {
  obj.overlay = true;

  obj.curves = [{
    title: 'Upper Envelope',
    color: 'magenta'
  }, {
    title: 'Lower Envelope',
    color: 'magenta'
  }];

  obj._maPeriods = {
    name: 'EMA periods',
    defaultValue: 20
  };

  obj._deviations = {
    name: 'Percentage offset',
    defaultValue: 2.5,
    type: Spock.ParameterType.Double
  };

  obj.parameters = [obj._maPeriods, obj._deviations];
  obj.requiredSource = Spock.RequiredSource.Tick;
};

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars)
    obj._ema = new Array(obj._maPeriods.value);

  if (period === obj._maPeriods.value)
    obj._ema[period] = Plot.sma(Plot.getTicks(period, obj._maPeriods.value), obj._maPeriods.value);
  else if (period > obj._maPeriods.value)
    obj._ema[period] = Plot.ema(Plot.getTick(period), obj._maPeriods.value, obj._ema[period - 1]);

  const mean = obj._ema[period];
  const offset = mean * (obj._deviations.value / 100);
  return [mean + offset, mean - offset];
};
