var obj = {
  name: 'NI',
  summary: 'Normalized Index'
};

obj.info = function () {
  obj._niCurve = {
    title: 'NI',
    lineWidth: 1
  };
  obj.curves = [obj._niCurve];

  obj._niPeriods = {
    name: 'NI periods',
    defaultValue: 50
  };
  obj.parameters = [obj._niPeriods];
  obj.requiredSource = Spock.RequiredSource.Bar;
};

obj.exec = function (period) {
  const niPeriods = obj._niPeriods.value

  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._ni = new Array(niPeriods);
  }

  if (period < niPeriods)
    return

  const rawHighs = Plot.high(period, niPeriods)
  const rawLows = Plot.low(period, niPeriods)
  if (!(rawHighs && rawLows))
    return

  const lowestLow = Math.min(...rawLows)
  const highestHigh = Math.max(...rawHighs)

  const rawClose = Plot.close(period)
  const ni = ((rawClose - lowestLow) / (highestHigh - lowestLow)) * 100

  return [ni]
};
