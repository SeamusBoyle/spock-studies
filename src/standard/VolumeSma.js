var obj = {
  name: 'Volume',
  summary: 'Volume with SMA'
};

obj.info = function () {
  obj.curves = [{
    title: 'Volume',
    style: Spock.LineCurveStyle.Columns,
    lineWidth: 1,
    hasPerBarColor: true
  }, {
    title: 'SMA',
    lineStyle: Spock.LineStyle.Dash,
    color: 'darkorange',
    lineWidth: 2
  }];

  obj._maPeriods = {
    name: 'SMA periods',
    defaultValue: 14
  };
  obj.parameters = [obj._maPeriods];
  obj.requiredSource = Spock.RequiredSource.Bar;

  obj._colors = {
    buying: Plot.newColor('forestgreen'),
    selling: Plot.newColor('crimson')
  };
};

obj.exec = function (period) {
  const vols = Plot.volume(period, obj._maPeriods.value);
  if (vols == null)
    return;

  const volMa = Plot.sma(vols, obj._maPeriods.value);

  return [{
    value: vols[vols.length - 1],
    color: Plot.close(period) >= Plot.open(period) ? obj._colors.buying : obj._colors.selling
  }, volMa];
};
