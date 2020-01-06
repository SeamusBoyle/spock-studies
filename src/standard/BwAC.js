const obj = {
  name: 'AC',
  summary: 'Accelerator Oscillator'
};

obj.info = function () {
  obj._acCurve = {
    title: 'AC',
    style: Spock.LineCurveStyle.Columns,
    lineWidth: 1,
    hasPerBarColor: true
  };
  obj.curves = [obj._acCurve];

  obj._slowPeriods = {
    name: 'Slow SMA periods',
    defaultValue: 34
  };

  obj._fastPeriods = {
    name: 'Fast SMA periods',
    defaultValue: 5
  };

  obj._aoMaPeriods = {
    name: 'AO SMA periods',
    defaultValue: 5
  };

  obj.parameters = [obj._slowPeriods, obj._fastPeriods, obj._aoMaPeriods];
  obj.requiredSource = Spock.RequiredSource.Bar;

  obj._colors = {
    increasing: Plot.newColor('forestgreen'),
    decreasing: Plot.newColor('crimson')
  };
};

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._ao = new Array(obj._slowPeriods.value);
    obj._ac = new Array(obj._aoMaPeriods.value);
  }

  // assert slowPeriods > fastPeriods
  const medianPrices = Plot.median(period, obj._slowPeriods.value);
  if (medianPrices == null)
    return;

  const fastMa = Plot.sma(medianPrices, obj._fastPeriods.value);
  const slowMa = Plot.sma(medianPrices, obj._slowPeriods.value);

  const ao = fastMa - slowMa;
  obj._ao[period] = ao;

  if (period < obj._slowPeriods.value + obj._aoMaPeriods.value - 2)
    return;

  const ac = Plot.sma(obj._ao, obj._aoMaPeriods.value);
  obj._ac[period] = ac;
  const prevAc = obj._ac[period - 1];
  if (prevAc == null)
    return;
  if (prevAc < ac)
    return [{ value: ac, color: obj._colors.increasing }];
  if (prevAc > ac)
    return [{ value: ac, color: obj._colors.decreasing }];
  // Use previous color if new ac val is not > or < prevAc
  return [{ value: ac, color: obj._acCurve.output[period - 1].color }];
};
