const obj = {
  name: 'SuperTrend'
};

obj.info = function () {
  obj.overlay = true;

  obj.curves = [{
    title: 'SuperTrend',
    style: Spock.LineCurveStyle.Line,
    hasPerBarColor: true
  }, {
    title: 'Trend Arrow',
    style: Spock.LineCurveStyle.Arrows,
    showDataTip: false,
    showInLegend: false
  }];

  obj._atrPeriods = {
    name: 'ATR periods',
    defaultValue: 10
  };

  obj._atrMultiplier = {
    name: 'ATR multiplier',
    defaultValue: 3.0,
    type: Spock.ParameterType.Double
  };

  obj.parameters = [obj._atrPeriods, obj._atrMultiplier];
  obj.requiredSource = Spock.RequiredSource.Bar;

  obj._colors = {
    uptrend: Plot.newColor('forestgreen'),
    downtrend: Plot.newColor('crimson')
  };
};

const TrendDirection = Object.freeze({ Down: -1, None: 0, Up: 1 });

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._atr = new Array(obj._atrPeriods.value);
    obj._upper = new Array(obj._atrPeriods.value);
    obj._lower = new Array(obj._atrPeriods.value);
    obj._trend = new Array(obj._atrPeriods.value);
  }

  // calculate True Range
  const curHigh = Plot.high(period);
  const curLow = Plot.low(period);
  if (period === 0) {
    obj._atr[0] = curHigh - curLow;
  } else {
    const prevClose = Plot.close(period - 1);

    const method1 = curHigh - curLow;
    let method2 = curHigh - prevClose;
    if (method2 < 0)
      method2 = -method2;

    let method3 = curLow - prevClose;
    if (method3 < 0)
      method3 = -method3;

    const curTr = Math.max(method1, method2, method3);
    if (period >= obj._atrPeriods.value) {
      obj._atr[period] =
        ((obj._atr[period - 1] * (obj._atrPeriods.value - 1)) + curTr) / obj._atrPeriods.value;
    } else if (period < obj._atrPeriods.value - 1) {
      obj._atr[period] = curTr;
    } else {
      obj._atr[period] = curTr;
      const trs = obj._atr.slice(0, obj._atrPeriods.value + 1);
      const sum_ = Plot.sum(trs, trs.length);
      obj._atr[period] = sum_ / obj._atrPeriods.value;
    }
  }

  if (period < obj._atrPeriods.value)
    return;

  const mean = (curHigh + curLow) / 2;
  const offset = obj._atr[period] * obj._atrMultiplier.value;

  const basicUpper = mean + offset;
  const basicLower = mean - offset;

  if (period < obj._atrPeriods.value + 1) {
    obj._upper[period] = basicUpper;
    obj._lower[period] = basicLower;
    obj._trend[period] = TrendDirection.None;
    return;
  }

  const prevClose = Plot.close(period - 1);

  const priorUpper = obj._upper[period - 1];
  obj._upper[period] = prevClose < priorUpper ? Math.min(basicUpper, priorUpper) : basicUpper;

  const priorLower = obj._lower[period - 1];
  obj._lower[period] = prevClose > priorLower ? Math.max(basicLower, priorLower) : basicLower;

  const curClose = Plot.close(period);
  obj._trend[period] = curClose > priorUpper ? TrendDirection.Up : curClose < priorLower ? TrendDirection.Down : obj._trend[period - 1];

  // avoid plotting anything until the direction is confirmed
  if (obj._trend[period] == TrendDirection.None)
    return;

  if (obj._trend[period] == TrendDirection.Up) {
    const didChangeUp = obj._trend[period - 1] == TrendDirection.Down;
    const upColor = obj._colors.uptrend;
    const upArrow = didChangeUp ? { value: obj._lower[period], color: upColor, hollow: true } : null;
    return [{ value: obj._lower[period], color: upColor }, upArrow];
  }
  const didChangeDown = obj._trend[period - 1] == TrendDirection.Up;
  const downColor = obj._colors.downtrend;
  const downArrow = didChangeDown ? { value: obj._upper[period], color: downColor, hollow: false } : null;
  return [{ value: obj._upper[period], color: downColor }, downArrow];
};
