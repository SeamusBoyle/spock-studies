var obj = {
  name: 'ANI',
  summary: 'All-Normalized Index'
};

obj.info = function () {
  obj._aniCurve = {
    title: 'ANI',
    lineWidth: 1
  };

  obj._maCurve = {
    title: 'MA',
    lineWidth: 1
  };

  obj.curves = [obj._aniCurve, obj._maCurve];

  obj._maPeriods = {
    name: 'MA periods',
    defaultValue: 8
  };
  obj.parameters = [obj._maPeriods];
  obj.requiredSource = Spock.RequiredSource.Bar;
};

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._ani = new Array(obj._maPeriods.value)
  }

  const niPeriodsLast = 101 // inclusive end
  if (period < niPeriodsLast) {
    return;
  }
  const rawHighs = Plot.high(period, niPeriodsLast + 1)
  const rawLows = Plot.low(period, niPeriodsLast + 1)
  if (!(rawHighs && rawLows))
    return

  const niPeriodsFirst = 2
  const rawClose = Plot.close(period)
  let ani = 0
  for (let niPeriods = niPeriodsFirst; niPeriods <= niPeriodsLast; niPeriods += 1) {
    /* The JS built-in Array.slice() function is very slow when used like this.
       The Plot.min()/Plot.max() functions are considerably faster (in this case)
       but it still freezes Latinum by a noticeable amount of time.
       Ideally a view into the rawLows/rawHighs arrays should be used (no copying),
       or replace with raw-loops
     */
    // const lowestLow = Math.min(...(rawLows).slice(-niPeriods))
    // const highestHigh = Math.max(...(rawHighs).slice(-niPeriods))
    const lowestLow = Plot.min(rawLows, niPeriods)
    const highestHigh = Plot.max(rawHighs, niPeriods)

    const ni = ((rawClose - lowestLow) / (highestHigh - lowestLow))

    ani += ni
  }

  obj._ani[period] = ani

  return [obj._ani[period], Plot.sma(obj._ani, obj._maPeriods.value)]
};
