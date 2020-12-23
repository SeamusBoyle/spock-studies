var obj = {
  name: 'FI',
  summary: 'Force Index'
};

obj.info = function () {
  obj.curves = [{ title: 'FI' }];

  obj._emaPeriods = {
    name: 'EMA periods',
    defaultValue: 13
  };

  obj.parameters = [obj._emaPeriods];
};

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._fi1 = new Array(obj._emaPeriods.value);
    obj._fi13 = new Array(obj._emaPeriods.value);

    if (!obj._baseLine) {
      //obj._baseLine = Plot.makeHLine({y:0})
      obj._baseLine = Plot.makeLine({ line: Plot.newLine(0, 0, 1, 0) });
    }
  }

  if (period < 1)
    return;

  const prices = Plot.getTicks(period, 2);
  if (!prices)
    return;

  const vol = Plot.volume(period);
  if (vol == null)
    return;

  // Based on
  // https://school.stockcharts.com/doku.php?id=technical_indicators:force_index
  //
  // Force Index(1) = {Close (current period)  -  Close (prior period)} x Volume
  // Force Index(13) = 13-period EMA of Force Index(1)

  obj._fi1[period] = (prices[1] - prices[0]) * vol;

  if (period === obj._emaPeriods.value)
    obj._fi13[period] = Plot.sma(obj._fi1, obj._emaPeriods.value);
  else if (period > obj._emaPeriods.value)
    obj._fi13[period] = Plot.ema(obj._fi1[period], obj._emaPeriods.value, obj._fi13[period - 1]);

  if (period >= obj._emaPeriods.value)
    return [obj._fi13[period]];
};
