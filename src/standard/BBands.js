const obj = {
  name: 'BBands',
  summary: 'Bollinger Bands'
};

obj.info = function () {
  obj.overlay = true;

  obj.curves = [{
    title: 'Upper Band'
  }, {
    title: 'Middle Band',
    lineStyle: Spock.LineStyle.Dash,
    lineWidth: 1
  }, {
    title: 'Lower Band'
  }];

  obj._maPeriods = {
    name: 'SMA periods',
    defaultValue: 20
  };

  obj._deviations = {
    name: 'Deviations',
    defaultValue: 2,
    type: Spock.ParameterType.Double
  };

  obj.parameters = [obj._maPeriods, obj._deviations];
  obj.requiredSource = Spock.RequiredSource.Tick;
};

obj.exec = function (period) {
  const prices = Plot.getTicks(period, obj._maPeriods.value);
  if (prices == null)
    return;

  const mean = Plot.sma(prices, obj._maPeriods.value);
  const offset = obj._deviations.value * Plot.stddev(prices, obj._maPeriods.value);
  return [mean + offset, mean, mean - offset];
};
