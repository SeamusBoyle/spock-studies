var obj = {
  name: 'Env',
  summary: 'Moving Average Envelopes'
}

obj.info = function () {
  obj.overlay = true

  obj.curves = [{
    title: 'Upper Envelope',
    color: 'magenta'
  }, {
    title: 'Lower Envelope',
    color: 'magenta'
  }]

  obj._maPeriods = {
    name: 'SMA periods',
    defaultValue: 20
  }

  obj._deviations = {
    name: 'Percentage offset',
    defaultValue: 2.5,
    type: Spock.ParameterType.Double
  }

  obj.parameters = [obj._maPeriods, obj._deviations]
  obj.requiredSource = Spock.RequiredSource.Tick
}

obj.exec = function (period) {
  var prices = Plot.getTicks(period, obj._maPeriods.value)
  if (prices == null) {
    return
  }

  var mean = Plot.sma(prices, obj._maPeriods.value)
  var offset = mean * (obj._deviations.value / 100)
  return [mean + offset, mean - offset]
}
