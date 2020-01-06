const obj = {
  name: 'Gator',
  summary: 'Bill Williams\'s Gator Oscillator'
};

obj.info = function () {
  obj._upperCurve = {
    title: 'Upper',
    style: Spock.LineCurveStyle.Columns,
    lineWidth: 1,
    hasPerBarColor: true
  };

  obj._lowerCurve = {
    title: 'Lower',
    style: Spock.LineCurveStyle.Columns,
    lineWidth: 1,
    hasPerBarColor: true
  };

  obj.curves = [obj._upperCurve, obj._lowerCurve];

  obj._jawPeriods = {
    name: 'Jaw periods',
    defaultValue: 13
  };

  obj._jawShift = {
    name: 'Jaw shift',
    defaultValue: 8
  };

  obj._teethPeriods = {
    name: 'Teeth periods',
    defaultValue: 8
  };

  obj._teethShift = {
    name: 'Teeth shift',
    defaultValue: 5
  };

  obj._lipsPeriods = {
    name: 'Lips periods',
    defaultValue: 5
  };

  obj._lipsShift = {
    name: 'Lips shift',
    defaultValue: 3
  };

  obj.parameters = [
    obj._jawPeriods, obj._jawShift, obj._teethPeriods, obj._teethShift, obj._lipsPeriods,
    obj._lipsShift
  ];
  obj.requiredSource = Spock.RequiredSource.Bar;

  obj._colors = {
    increasing: Plot.newColor('forestgreen'),
    decreasing: Plot.newColor('crimson')
  };
};

function medianSmma(period, n, smma) {
  if (period === n - 1)
    return Plot.sma(Plot.median(period, n), n);
  else if (period > n - 1)
    return (smma[period - 1] * (n - 1) + Plot.median(period)) / n;
}

function makeOptional(cond, v) {
  if (cond != null)
    return v;
}

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._jaw = new Array(obj._jawPeriods.value);
    obj._teeth = new Array(obj._teethPeriods.value);
    obj._lips = new Array(obj._lipsPeriods.value);

    // Storing upper/lower in an array and also returning the values
    // does increase memory usage but avoids having to use hacks
    // like returning a transparent color for the first bar.
    obj._upper = new Array(Math.max(obj._jawPeriods.value, obj._teethPeriods.value));
    obj._lower = new Array(Math.max(obj._teethPeriods.value, obj._lipsPeriods.value));
  }

  // Values not shifted
  obj._jaw[period] = medianSmma(period, obj._jawPeriods.value, obj._jaw);
  obj._teeth[period] = medianSmma(period, obj._teethPeriods.value, obj._teeth);
  obj._lips[period] = medianSmma(period, obj._lipsPeriods.value, obj._lips);

  const shiftedJaw = obj._jaw[period - obj._jawShift.value];
  const shiftedTeeth = obj._teeth[period - obj._teethShift.value];
  const shiftedLips = obj._lips[period - obj._lipsShift.value];

  obj._upper[period] = Math.abs(shiftedJaw - shiftedTeeth);
  obj._lower[period] = -Math.abs(shiftedTeeth - shiftedLips);

  let upperColor;
  const prevUpper = obj._upper[period - 1];
  if (prevUpper != null) {
    if (prevUpper < obj._upper[period])
      upperColor = obj._colors.increasing;
    else if (prevUpper > obj._upper[period])
      upperColor = obj._colors.decreasing;
  }

  let lowerColor;
  const prevLower = obj._lower[period - 1];
  if (prevLower != null) {
    if (prevLower > obj._lower[period])
      lowerColor = obj._colors.increasing;
    else if (prevLower < obj._lower[period])
      lowerColor = obj._colors.decreasing;
  }

  return [
    makeOptional(upperColor, { value: obj._upper[period], color: upperColor }),
    makeOptional(lowerColor, { value: obj._lower[period], color: lowerColor })
  ];
};
