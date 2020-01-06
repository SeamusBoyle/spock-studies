var obj = {
  name: 'Elder Impulse System'
}

obj.info = function () {
  obj.overlay = true
  obj.curves = [{
    title: 'Impulse System',
    type: Spock.CurveType.Bar,
    style: Spock.BarCurveStyle.Ohlc,
    hasPerBarColor: true,
    lineWidth: 2,
    zIndex: 1
  }]

  obj._emaPeriods = {
    name: 'EMA periods',
    defaultValue: 13
  }

  obj._fastPeriods = {
    name: 'MACD Fast periods',
    defaultValue: 12
  }

  obj._slowPeriods = {
    name: 'MACD Slow periods',
    defaultValue: 26
  }

  obj._signalPeriods = {
    name: 'MACD Signal periods',
    defaultValue: 9
  }
  obj.parameters = [obj._emaPeriods, obj._fastPeriods, obj._slowPeriods, obj._signalPeriods]
  obj.requiredSource = Spock.RequiredSource.Bar

  obj._colors = {
    greenBar: Plot.newColor('green'),
    greenBarWick: Plot.newColor('green'),
    redBar: Plot.newColor('crimson'),
    redBarWick: Plot.newColor('crimson'),
    blueBar: Plot.newColor('royalblue'),
    blueBarWick: Plot.newColor('royalblue')
  }
}

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._ema = new Array(obj._emaPeriods.value)
    obj._fast = new Array(obj._fastPeriods.value)
    obj._slow = new Array(obj._slowPeriods.value)
    obj._macd = new Array(obj._slowPeriods.value)
    obj._signal = new Array(obj._slowPeriods.value + obj._signalPeriods.value)
    obj._hist = new Array(obj._slowPeriods.value + obj._signalPeriods.value)
  }

  if (period === obj._emaPeriods.value) {
    obj._ema[period] = Plot.sma(Plot.getTicks(period, obj._emaPeriods.value), obj._emaPeriods.value)
  } else if (period > obj._emaPeriods.value) {
    obj._ema[period] = Plot.ema(Plot.getTick(period), obj._emaPeriods.value, obj._ema[period - 1])
  }

  if (period === obj._fastPeriods.value) {
    obj._fast[period] = Plot.sma(Plot.getTicks(period, obj._fastPeriods.value), obj._fastPeriods.value)
  } else if (period > obj._fastPeriods.value) {
    obj._fast[period] = Plot.ema(Plot.getTick(period), obj._fastPeriods.value, obj._fast[period - 1])
  }

  if (period === obj._slowPeriods.value) {
    obj._slow[period] = Plot.sma(Plot.getTicks(period, obj._slowPeriods.value), obj._slowPeriods.value)
  } else if (period > obj._slowPeriods.value) {
    obj._slow[period] = Plot.ema(Plot.getTick(period), obj._slowPeriods.value, obj._slow[period - 1])
  }

  if (period < obj._fastPeriods.value || period < obj._slowPeriods.value) {
    return
  }

  obj._macd[period] = obj._fast[period] - obj._slow[period]

  if (period === obj._slowPeriods.value + obj._signalPeriods.value) {
    obj._signal[period] = Plot.sma(obj._macd, obj._signalPeriods.value)
  } else if (period > obj._signalPeriods.value) {
    obj._signal[period] = Plot.ema(obj._macd[period], obj._signalPeriods.value, obj._signal[period - 1])
  }

  obj._hist[period] = obj._macd[period] !== undefined &&
    obj._signal[period] !== undefined ? obj._macd[period] - obj._signal[period] : null

  var isGreenBar = obj._ema[period] > obj._ema[period - 1] &&
    obj._hist[period] > obj._hist[period - 1]

  var isRedBar = !isGreenBar && obj._ema[period] < obj._ema[period - 1] &&
    obj._hist[period] < obj._hist[period - 1]

  var isBlueBar = !isGreenBar && !isRedBar

  var ohlc = Plot.getOHLC(period)
  return [{
    value: ohlc,
    color: isGreenBar ? obj._colors.greenBar : isRedBar ? obj._colors.redBar : obj._colors.blueBar,
    wickColor: isGreenBar ? obj._colors.greenBarWick : isRedBar ? obj._colors.redBarWick : obj._colors.blueBarWick,
    hollow: ohlc.close >= ohlc.open
  }]
}
