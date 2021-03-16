var obj = {
  name: 'SmaX',
  summary: 'Multiply SMA by a factor'
}

obj.info = function () {
  obj.overlay = true

  obj.curves = [{
    title: 'SmaX',
    color: 'red',
    lineWidth: 2
  }]

  obj._maPeriods = {
    name: 'SMA periods',
    defaultValue: 70
  }
  obj._mFactor = {
    name: 'Factor',
    defaultValue: 2.0,
    type: Spock.ParameterType.Double
  }
  obj.parameters = [obj._maPeriods, obj._mFactor]
  obj.requiredSource = Spock.RequiredSource.Tick
}

obj.exec = function (period) {
  const n = obj._maPeriods.value
  if (period >= n - 1) {
    return [obj._mFactor.value * Plot.sma(Plot.getTicks(period, n), n)]
  }
}
