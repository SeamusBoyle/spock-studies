var obj = {
  name: 'MROC',
  summary: 'Multiple Rate-of-Change'
}

obj.info = function () {
  obj.curves = [{
    title: 'Short',
    color: 'cyan'
  }, {
    title: 'Medium',
    color: 'magenta'
  }, {
    title: 'Long',
    color: 'orange'
  }]

  obj._lookbackShort = {
    name: 'Short lookback',
    defaultValue: 1
  }

  obj._lookbackMedium = {
    name: 'Medium lookback',
    defaultValue: 12
  }

  obj._lookbackLong = {
    name: 'Long lookback',
    defaultValue: 24
  }

  obj.parameters = [obj._lookbackShort, obj._lookbackMedium, obj._lookbackLong]
  obj.requiredSource = Spock.RequiredSource.Tick
}

function pctChange(lookBack, price) {
  var oldPrice = Plot.getTick(lookBack)
  if (oldPrice == null) {
    return
  }
  return (price - oldPrice) / oldPrice * 100
}

obj.exec = function (period) {
  var latestPrice = Plot.getTick(period)
  if (latestPrice == null) {
    return
  }

  return [
    pctChange(period - obj._lookbackShort.value, latestPrice),
    pctChange(period - obj._lookbackMedium.value, latestPrice),
    pctChange(period - obj._lookbackLong.value, latestPrice)
  ]
}
