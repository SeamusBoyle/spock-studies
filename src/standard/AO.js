const obj = {
  name: 'AO',
  summary: 'Awesome Oscillator'
};

obj.info = function () {
  obj._aoCurve = {
    title: 'AO',
    style: Spock.LineCurveStyle.Columns,
    lineWidth: 1,
    hasPerBarColor: true
  };
  obj.curves = [obj._aoCurve];

  obj._slowPeriods = {
    name: 'Slow SMA periods',
    defaultValue: 34
  };

  obj._fastPeriods = {
    name: 'Fast SMA periods',
    defaultValue: 5
  };
  obj.parameters = [obj._slowPeriods, obj._fastPeriods];
  obj.requiredSource = Spock.RequiredSource.Bar;

  obj._colors = {
    increasing: Plot.newColor('forestgreen'),
    decreasing: Plot.newColor('crimson')
  };
};

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars)
    obj._ao = new Array(obj._slowPeriods.value);

  // assert slowPeriods > fastPeriods
  const medianPrices = Plot.median(period, obj._slowPeriods.value);
  if (medianPrices == null)
    return;

  const fastMa = Plot.sma(medianPrices, obj._fastPeriods.value);
  const slowMa = Plot.sma(medianPrices, obj._slowPeriods.value);

  const ao = fastMa - slowMa;
  obj._ao[period] = ao;
  const prevAo = obj._ao[period - 1];
  if (prevAo == null)
    return;
  if (prevAo < ao)
    return [{ value: ao, color: obj._colors.increasing }];
  if (prevAo > ao)
    return [{ value: ao, color: obj._colors.decreasing }];
  // Use previous color if new ao val is not > or < prevAo
  return [{ value: ao, color: obj._aoCurve.output[period - 1].color }];
};
