var obj = {
  name: 'SmaXx',
  summary: 'Multiply SMA by multiple factors'
}

obj.info = function () {
  obj.overlay = true

  obj.curves = [{
    title: 'SmaX1',
    color: 'red',
    lineWidth: 2
  },{
    title: 'SmaX2',
    color: 'green',
    lineWidth: 2
  },{
    title: 'SmaX3',
    color: 'blue',
    lineWidth: 2
  }]

  obj._maPeriods = {
    name: 'SMA periods',
    defaultValue: 70
  }
  obj._mFactor1 = {
    name: 'Factor 1',
    defaultValue: 1.382,
    type: Spock.ParameterType.Double
  }
  obj._mFactor2 = {
    name: 'Factor 2',
    defaultValue: 1.618,
    type: Spock.ParameterType.Double
  }
  obj._mFactor3 = {
    name: 'Factor 3',
    defaultValue: 1.786,
    type: Spock.ParameterType.Double
  }
  obj.parameters = [obj._maPeriods, obj._mFactor1, obj._mFactor2, obj._mFactor3]
  obj.requiredSource = Spock.RequiredSource.Tick
}

obj.exec = function (period) {
  const n = obj._maPeriods.value
  if (period >= n - 1) {
    const smaV = Plot.sma(Plot.getTicks(period, n), n)
    return [obj._mFactor1.value * smaV, obj._mFactor2.value * smaV, obj._mFactor3.value * smaV]
  }
}
