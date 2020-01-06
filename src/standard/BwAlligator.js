const obj = {
  name: 'Alligator',
  summary: 'Bill Williams\'s Alligator'
};

obj.info = function () {
  obj.overlay = true;

  obj._jawCurve = {
    title: 'Jaw',
    color: 'blue'
  };

  obj._teethCurve = {
    title: 'Teeth',
    color: 'red'
  };

  obj._lipsCurve = {
    title: 'Lips',
    color: 'limegreen'
  };

  obj.curves = [obj._jawCurve, obj._teethCurve, obj._lipsCurve];

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
};

function medianSmma(period, n, smma) {
  if (period === n - 1)
    return Plot.sma(Plot.median(period, n), n);
  else if (period > n - 1)
    return (smma[period - 1] * (n - 1) + Plot.median(period)) / n;
}

obj._preExec = function () {
  obj._jawCurve.barsOffset = obj._jawShift.value;
  obj._teethCurve.barsOffset = obj._teethShift.value;
  obj._lipsCurve.barsOffset = obj._lipsShift.value;
};

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars)
    obj._preExec();

  return [
    medianSmma(period, obj._jawPeriods.value, obj._jawCurve.output),
    medianSmma(period, obj._teethPeriods.value, obj._teethCurve.output),
    medianSmma(period, obj._lipsPeriods.value, obj._lipsCurve.output)
  ];
};
