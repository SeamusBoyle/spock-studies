var obj = {
  name: 'VWMA',
  summary: 'Volume-Weighted Moving Average'
}

obj.info = function () {
  obj.overlay = true

  obj._vwmaCurve = {
    title: 'VWMA'
  }

  obj.curves = [obj._vwmaCurve]

  obj._maPeriods = {
    name: 'VWMA periods',
    defaultValue: 20
  }

  obj.parameters = [obj._maPeriods]
  obj.requiredSource = Spock.RequiredSource.Bar
}

obj.exec = function (period) {
  var n = obj._maPeriods.value

  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._cv = new Array(n)
    obj._v = new Array(n)
    // sums, rolling
    /*
    obj._cvS = new Array(n)
    obj._vS = new Array(n)
    */
  }

  var c0 = Plot.getTick(period)
  var v0 = Plot.volume(period)
  var cv0 = c0 * v0
  obj._cv[period] = cv0
  obj._v[period] = v0

  // TODO(seamus): Use rolling window
  if (period + 1 >= n) {
    var start = period + 1 - n
    var end = period + 1
    var cv = obj._cv.slice(start, end)
    var v = obj._v.slice(start, end)
    var cvS = Plot.sum(cv, cv.length)
    var vS = Plot.sum(v, v.length)
    /*
    obj._cvS[period] = cvS
    obj._vS[period] = vS
    */
    return [cvS / vS]
  }
}
