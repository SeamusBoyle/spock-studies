var obj = {
  name: 'AnnualizedVol',
  summary: 'Annualized Volatility',
}

obj.info = function () {
  obj.curves = [{
    title: 'Vol',
    color: 'darkorange',
    lineWidth: 2,
  }]

  obj._nTime = {
    name: 'Lookback window periods',
    defaultValue: 30,
  }

  obj._periodsInYear = {
    name: 'Periods in year',
    defaultValue: 252,
  }

  obj.parameters = [obj._nTime, obj._periodsInYear]
  obj.requiredSource = Spock.RequiredSource.Tick
}

obj.exec = function (period) {
  const n = obj._nTime.value
  if (period < n)
    return;

  const prices = Plot.getTicks(period, n)
  if (!prices)
    return;

  return [Math.sqrt(obj._periodsInYear.value) * Plot.stddev(prices, n)]
}
