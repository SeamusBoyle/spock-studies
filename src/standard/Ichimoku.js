var obj = {
  name: 'Ichimoku',
  summary: 'Ichimoku Kinko Hyo'
}

obj.info = function () {
  obj.overlay = true

  obj._spanACurve = {
    title: 'Senkou Span A',
    color: 'green'
  }

  obj._spanBCurve = {
    title: 'Senkou Span B',
    color: 'blue'
  }

  obj._chikouCurve = {
    title: 'Chikou Span',
    color: 'deeppink'
  }

  obj._kumoCurve = {
    title: 'Kumo',
    type: Spock.CurveType.Channel,
    color: '#50d2d2d2' // 80/255 alpha, lightgray
  }

  obj.curves = [{
    title: 'Tenkan-sen',
    color: 'red'
  }, {
    title: 'Kijun-sen',
    color: 'maroon'
  }, obj._spanACurve, obj._spanBCurve, obj._chikouCurve, obj._kumoCurve]

  obj._tenkenPeriods = {
    name: 'Tenkan-sen',
    defaultValue: 9
  }

  obj._kijunPeriods = {
    name: 'Kijun-sen',
    defaultValue: 26
  }

  obj._spanBPeriods = {
    name: 'Senkou Span B',
    defaultValue: 52
  }

  obj.parameters = [obj._tenkenPeriods, obj._kijunPeriods, obj._spanBPeriods]
  obj.requiredSource = Spock.RequiredSource.Bar
}

obj._preExec = function () {
  obj._spanACurve.barsOffset = obj._kijunPeriods.value

  obj._spanBCurve.barsOffset = obj._kijunPeriods.value

  obj._chikouCurve.barsOffset = -obj._kijunPeriods.value

  obj._kumoCurve.barsOffset = obj._kijunPeriods.value
}

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._preExec()
  }

  var maxLookback = Math.max(obj._spanBPeriods.value, obj._kijunPeriods.value, obj._tenkenPeriods.value)
  if (period < maxLookback) {
    return
  }

  var highs = Plot.high(period, maxLookback)
  var lows = Plot.low(period, maxLookback)

  var tenkenSen = (Plot.max(highs, obj._tenkenPeriods.value) + Plot.min(lows, obj._tenkenPeriods.value)) / 2

  var kijunSen = (Plot.max(highs, obj._kijunPeriods.value) + Plot.min(lows, obj._kijunPeriods.value)) / 2

  var spanA = (tenkenSen + kijunSen) / 2

  var spanB = (Plot.max(highs, obj._spanBPeriods.value) + Plot.min(lows, obj._spanBPeriods.value)) / 2

  var chikou = Plot.close(period)

  return [tenkenSen, kijunSen, spanA, spanB, chikou, [spanA, spanB]]
}
