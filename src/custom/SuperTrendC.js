var obj = {
  name: 'SuperTrendC',
  summary: 'SuperTrend Candles',
  description: 'Color candlesticks based on SuperTrend'
}

obj.info = function () {
  obj.overlay = true

  obj.curves = [{
    title: 'SuperTrendC',
    type: Spock.CurveType.Bar,
    style: Spock.BarCurveStyle.Candle,
    hasPerBarColor: true,
    zIndex: 1
  }]

  obj._atrPeriods = {
    name: 'ATR periods',
    defaultValue: 10
  }

  obj._atrMultiplier = {
    name: 'ATR multiplier',
    defaultValue: 3.0,
    type: Spock.ParameterType.Double
  }

  obj.parameters = [obj._atrPeriods, obj._atrMultiplier]
  obj.requiredSource = Spock.RequiredSource.Bar

  obj._colors = {
    over: Plot.newColor('royalblue'),
    overWick: Plot.newColor('royalblue'),
    under: Plot.newColor('crimson'),
    underWick: Plot.newColor('crimson')
  }
}

TrendDirection = Object.freeze({ Down: -1, None: 0, Up: 1 })

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._atr = new Array(obj._atrPeriods.value)
    obj._upper = new Array(obj._atrPeriods.value)
    obj._lower = new Array(obj._atrPeriods.value)
    obj._trend = new Array(obj._atrPeriods.value)
  }

  // calculate True Range
  var curHigh = Plot.high(period)
  var curLow = Plot.low(period)
  if (period === 0) {
    obj._atr[0] = curHigh - curLow
  } else {
    var prevClose = Plot.close(period - 1)

    var method1 = curHigh - curLow
    var method2 = curHigh - prevClose
    if (method2 < 0) {
      method2 = -method2
    }
    var method3 = curLow - prevClose
    if (method3 < 0) {
      method3 = -method3
    }

    var curTr = Math.max(method1, method2, method3)
    if (period >= obj._atrPeriods.value) {
      obj._atr[period] =
        ((obj._atr[period - 1] * (obj._atrPeriods.value - 1)) + curTr) / obj._atrPeriods.value
    } else if (period < obj._atrPeriods.value - 1) {
      obj._atr[period] = curTr
    } else {
      obj._atr[period] = curTr
      var trs = obj._atr.slice(0, obj._atrPeriods.value + 1)
      var sum_ = Plot.sum(trs, trs.length)
      obj._atr[period] = sum_ / obj._atrPeriods.value
    }
  }

  if (period < obj._atrPeriods.value) {
    return
  }

  var mean = (curHigh + curLow) / 2
  var offset = obj._atr[period] * obj._atrMultiplier.value

  var basicUpper = mean + offset
  var basicLower = mean - offset

  if (period < obj._atrPeriods.value + 1) {
    obj._upper[period] = basicUpper
    obj._lower[period] = basicLower
    obj._trend[period] = TrendDirection.None
    return
  }

  var prevClose = Plot.close(period - 1)

  var priorUpper = obj._upper[period - 1]
  obj._upper[period] = prevClose < priorUpper ? Math.min(basicUpper, priorUpper) : basicUpper

  var priorLower = obj._lower[period - 1]
  obj._lower[period] = prevClose > priorLower ? Math.max(basicLower, priorLower) : basicLower

  var curClose = Plot.close(period)
  obj._trend[period] = curClose > priorUpper ? TrendDirection.Up : curClose < priorLower ? TrendDirection.Down : obj._trend[period - 1]

  // avoid plotting anything until the direction is confirmed
  if (obj._trend[period] == TrendDirection.None) {
    return
  }

  var isUpTrend = obj._trend[period] == TrendDirection.Up
  var ohlc = Plot.getOHLC(period)
  return [{
    value: ohlc,
    color: isUpTrend ? obj._colors.over : obj._colors.under,
    wickColor: isUpTrend ? obj._colors.overWick : obj._colors.underWick,
    hollow: ohlc.close >= ohlc.open
  }]
}
