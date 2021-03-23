var obj = {
  name: 'AnnualizedVolPct',
  summary: 'Annualized Volatility (Percent)',
}

obj.info = function () {
  obj.curves = [{
    title: 'VolPct',
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
  const lb = n + 1
  if (period < lb)
    return;

  const prices = Plot.getTicks(period, lb)
  if (!prices)
    return;

  const pctChanges = new Array(n)
  for (let i = 1, j = 0, tot = prices.length; i < tot; ++i, ++j) {
    prevPrice = prices[j]
    pctChanges[j] = (prices[i] - prevPrice) / prevPrice * 100
  }

  return [Math.sqrt(obj._periodsInYear.value) * Plot.stddev(pctChanges, n)]
}
