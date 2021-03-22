const QQE_DEBUG = true;

var obj = {
  name: 'QQEHist',
  summary: 'Quantitative Qualitative Estimation (Histogram)',
}

obj.info = function () {
  obj._colCurve = {
    title: 'SmoothRSIHist',
    type: Spock.CurveType.Bar,
    style: Spock.BarCurveStyle.Candle,
    hasPerBarColor: true,
    lineWidth: 2,
    // baseline: 0,
    gapWidth: .2,
    showDataTip: false
  }
  // obj._colCurve = {
  //   title: 'SmoothRSI',
  //   style: Spock.LineCurveStyle.Columns,
  //   hasPerBarColor: true,
  //   lineWidth: 2,
  //   baseline: 0,
  //   gapWidth: .2,
  // }
  obj._lineCurve = {
    title: 'SmoothRSI',
    style: Spock.LineCurveStyle.Solid,
    hasPerBarColor: true,
    lineWidth: 2,
    // baseline: 0,
    gapWidth: .2,
    // showDataTip: false,
    color: 'orange',
  }

  obj.curves = [obj._colCurve, obj._lineCurve, {
    title: 'FastTL',
    lineStyle: Spock.LineStyle.Solid,
    lineWidth: 2,
    color: 'blue',
  }, {
    title: 'SlowTL',
    lineStyle: Spock.LineStyle.Solid,
    lineWidth: 2,
    color: 'fuchsia',
  }]

  obj._rsiPeriods = {
    name: 'RSI period',
    defaultValue: 14,
  }

  obj._rsiSmoothingPeriods = {
    name: 'RSI smoothing periods',
    defaultValue: 5,
  };

  obj._atrPeriods = {
    name: 'ATR periods',
    defaultValue: 27,
  };

  obj._atrSmoothingPeriods = {
    name: 'ATR smoothing periods',
    defaultValue: 27,
  };

  obj._fastAtrMultiplier = {
    name: 'Fast ATR multiplier',
    defaultValue: 2.618,
    type: Spock.ParameterType.Double,
  };

  obj._slowAtrMultiplier = {
    name: 'Slow ATR multiplier',
    defaultValue: 4.236,
    type: Spock.ParameterType.Double,
  };

  obj._zeroCenter = {
    name: 'Zero center',
    defaultValue: true,
    type: Spock.ParameterType.Bool
  };

  obj._bullishLevelOffset = {
    name: 'Bullish level offset from center',
    defaultValue: 10,
    type: Spock.ParameterType.Double,
  };

  obj._bearishLevelOffset = {
    name: 'Bearish level offset from center',
    defaultValue: -10,
    type: Spock.ParameterType.Double,
  };

  obj.parameters = [obj._rsiPeriods, obj._rsiSmoothingPeriods, obj._atrPeriods,
    obj._atrSmoothingPeriods, obj._fastAtrMultiplier, obj._slowAtrMultiplier,
    obj._zeroCenter, obj._bullishLevelOffset, obj._bearishLevelOffset]
  obj.requiredSource = Spock.RequiredSource.Tick

  obj._colors = {
    bullish: Plot.newColor('#7f138200'), // svg green with 50% opacity
    flat: Plot.newColor('#7ffba800'), // svg orange with 50% opacity
    bearish: Plot.newColor('#7ffa1000') // svg red with 50% opacity
  }
}

obj.exec = function (period) {
  const firstSmoothedRsiPeriod = obj._rsiPeriods.value + obj._rsiSmoothingPeriods.value
  // FIXME(seamus): Is this off-by-one?
  const firstAtrPeriod = firstSmoothedRsiPeriod + obj._atrPeriods.value + 1
  const firstSmoothedAtrPeriod = firstAtrPeriod + obj._atrSmoothingPeriods.value

  const centerLevel = obj._zeroCenter.value ? 0 : 50;
  const topLevel = centerLevel + 50;
  const bullishLevel = centerLevel + obj._bullishLevelOffset.value;
  const bearishLevel = centerLevel + obj._bearishLevelOffset.value;

  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    // FIXME(seamus): Changing baseline in exec() doesn't work (it's not hooked up in Latinum)
    obj._colCurve.baseline = centerLevel
  
    obj._avgGain = new Array(obj._rsiPeriods.value)
    obj._avgLoss = new Array(obj._rsiPeriods.value)
    obj._rsi = new Array(obj._rsiPeriods.value)
    obj._smoothedRsi = new Array(firstSmoothedRsiPeriod)
    obj._atr = new Array(firstAtrPeriod)
    obj._smoothedAtr = new Array(firstSmoothedAtrPeriod)
    obj._fast = new Array(firstSmoothedAtrPeriod)
    obj._slow = new Array(firstSmoothedAtrPeriod)

    if (QQE_DEBUG && false) {
      if (!obj._upLine) {
        obj._upLine = Plot.makeHLine({ y: bullishLevel })
      }
      if (!obj._loLine) {
        obj._loLine = Plot.makeHLine({ y: bearishLevel })
      }
      if (!obj._baseLine) {
        obj._baseLine = Plot.makeHLine({ y: centerLevel })
      }
    }
  }

  // Copied from StockRSI.js
  if (period === obj._rsiPeriods.value) {
    var prices = Plot.getTicks(period, obj._rsiPeriods.value)
    var gains = 0
    var losses = 0
    for (var i = 1, total = prices.length; i < total; ++i) {
      var change = prices[i - 1] - prices[i]
      if (change >= 0) {
        gains += change
      } else {
        losses += -change
      }
    }

    obj._avgGain[period] = gains / obj._rsiPeriods.value
    obj._avgLoss[period] = losses / obj._rsiPeriods.value
  } else if (period > obj._rsiPeriods.value) {
    var prices = Plot.getTicks(period, 2)
    var change = prices[1] - prices[0]
    var gain = 0
    var loss = 0
    if (change >= 0) {
      gain = change
    } else {
      loss = -change
    }
    var periods = obj._rsiPeriods.value
    var periodsLesOne = obj._rsiPeriods.value - 1
    obj._avgGain[period] = (obj._avgGain[period - 1] * periodsLesOne + gain) / periods
    obj._avgLoss[period] = (obj._avgLoss[period - 1] * periodsLesOne + loss) / periods
  }

  if (period >= obj._rsiPeriods.value) {
    obj._rsi[period] = topLevel - (100 / (1 + (obj._avgGain[period] / obj._avgLoss[period])))

    if (period >= firstSmoothedRsiPeriod) {
      if (period === firstSmoothedRsiPeriod) {
        obj._smoothedRsi[period] = Plot.sma(obj._rsi, obj._rsiSmoothingPeriods.value);
      } else if (period > firstSmoothedRsiPeriod) {
        obj._smoothedRsi[period] = Plot.ema(obj._rsi[period], obj._rsiSmoothingPeriods.value, obj._smoothedRsi[period - 1]);
      }
    }

    const atrZeroPeriod = firstAtrPeriod - obj._atrPeriods.value;
    if (period >= atrZeroPeriod) {
      var curTr = Math.abs(obj._smoothedRsi[period] - obj._smoothedRsi[period - 1]);
      if (period >= firstAtrPeriod) {
        obj._atr[period] =
          ((obj._atr[period - 1] * (obj._atrPeriods.value - 1)) + curTr) / obj._atrPeriods.value
      } else if (period < firstAtrPeriod - 1) {
        obj._atr[period] = curTr
      } else {
        obj._atr[period] = curTr
        var trs = obj._atr.slice(atrZeroPeriod, firstAtrPeriod + 1)
        // Latinum.debug(trs);
        // Latinum.debug(trs.length);
        var sum_ = Plot.sum(trs, trs.length)
        obj._atr[period] = sum_ / obj._atrPeriods.value
      }
    }

    if (period >= firstSmoothedAtrPeriod) {
      if (period === firstSmoothedAtrPeriod) {
        obj._smoothedAtr[period] = Plot.sma(obj._atr, obj._atrSmoothingPeriods.value);
      } else if (period > firstSmoothedAtrPeriod) {
        obj._smoothedAtr[period] = Plot.ema(obj._atr[period], obj._atrSmoothingPeriods.value, obj._smoothedAtr[period - 1]);
      }

      let fl;
      if (obj._smoothedRsi[period] < obj._fast[period - 1]) {
        fl = obj._smoothedRsi[period] + obj._smoothedAtr[period] * obj._fastAtrMultiplier.value;
        if (fl > obj._fast[period - 1] && obj._smoothedRsi[period - 1] < obj._fast[period - 1]) {
            fl = obj._fast[period - 1];
        }
      }
      else if (obj._smoothedRsi[period] > obj._fast[period - 1]) {
        fl = obj._smoothedRsi[period] - obj._smoothedAtr[period] * obj._fastAtrMultiplier.value;
        if (fl < obj._fast[period - 1] && obj._smoothedRsi[period - 1] > obj._fast[period - 1]) {
            fl = obj._fast[period - 1];
        }
      } else {
        // FIXME(seamus): What should init value be?
        fl = obj._smoothedRsi[period];
      }
      obj._fast[period] = fl;

      let sl;
      if (obj._smoothedRsi[period] < obj._slow[period - 1]) {
        sl = obj._smoothedRsi[period] + obj._smoothedAtr[period] * obj._slowAtrMultiplier.value;
        if (sl > obj._slow[period - 1] && obj._smoothedRsi[period - 1] < obj._slow[period - 1]) {
            sl = obj._slow[period - 1];
        }
      }
      else if (obj._smoothedRsi[period] > obj._slow[period - 1]) {
        sl = obj._smoothedRsi[period] - obj._smoothedAtr[period] * obj._slowAtrMultiplier.value;
        if (sl < obj._slow[period - 1] && obj._smoothedRsi[period - 1] > obj._slow[period - 1]) {
            sl = obj._slow[period - 1];
        }
      } else {
        // FIXME(seamus): What should init value be?
        sl = obj._smoothedRsi[period];
      }
      obj._slow[period] = sl;
    }

    if (period > firstSmoothedAtrPeriod) {
      let color;
      // FIXME(seamus): Is this supposed to be slow value or smoothed_rsi value (QQE val)?
      let colorTestPrice = obj._smoothedRsi[period]
      if (colorTestPrice > bullishLevel) {
        color = obj._colors.bullish;
      } else if (colorTestPrice < bearishLevel) {
        color = obj._colors.bearish;
      } else {
        color = obj._colors.flat;
      }

      const bv = obj._smoothedRsi[period];
      let fakeBar = bv < centerLevel ? [centerLevel,centerLevel,bv,bv] : [centerLevel,bv,centerLevel,bv];
      let wickColor = color;
      return [{value: fakeBar, color, wickColor}, bv, obj._fast[period], obj._slow[period]]
    }
  }
}



