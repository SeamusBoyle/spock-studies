const obj = {
  name: 'Donchian Channel'
};

obj.info = function () {
  obj.overlay = true;

  obj.curves = [{
    title: 'Upper'
  }, {
    title: 'Middle',
    lineStyle: Spock.LineStyle.Dash,
    lineWidth: 1
  }, {
    title: 'Lower'
  }];

  obj._periods = {
    name: 'Periods',
    defaultValue: 20
  };

  obj.parameters = [obj._periods];
  obj.requiredSource = Spock.RequiredSource.Bar;
};

obj.exec = function (period) {
  const length = obj._periods.value;

  const highs = Plot.high(period, length);
  if (highs == null)
    return;

  const lows = Plot.low(period, length);
  if (lows == null)
    return;

  const high = Plot.max(highs, length);
  const low = Plot.min(lows, length);
  return [high, (high + low) / 2, low];
};
