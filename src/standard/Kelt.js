var obj = {
  name: 'Kelt',
  summary: 'Keltner Channels'
};

obj.info = function () {
  obj.overlay = true;

  obj.curves = [{
    title: 'Upper',
    color: 'magenta'
  }, {
    title: 'Middle',
    color: 'magenta',
    lineStyle: Spock.LineStyle.Dash,
    lineWidth: 1
  }, {
    title: 'Lower',
    color: 'magenta'
  }];

  obj._maPeriods = {
    name: 'EMA periods',
    defaultValue: 20
  };

  obj._atrPeriods = {
    name: 'ATR periods',
    defaultValue: 10
  };

  obj._atrMultiplier = {
    name: 'ATR multiplier',
    defaultValue: 2.0,
    type: Spock.ParameterType.Double
  };

  obj.parameters = [obj._maPeriods, obj._atrPeriods, obj._atrMultiplier];
  obj.requiredSource = Spock.RequiredSource.Bar;
};

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._ema = new Array(obj._maPeriods.value);
    obj._atr = new Array(obj._atrPeriods.value);
  }

  if (period === obj._maPeriods.value)
    obj._ema[period] = Plot.sma(Plot.getTicks(period, obj._maPeriods.value), obj._maPeriods.value);
  else if (period > obj._maPeriods.value)
    obj._ema[period] = Plot.ema(Plot.getTick(period), obj._maPeriods.value, obj._ema[period - 1]);

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

  if (period < Math.max(obj._maPeriods.value, obj._atrPeriods.value))
    return;

  const mean = obj._ema[period];
  const offset = obj._atr[period] * obj._atrMultiplier.value;
  return [mean + offset, mean, mean - offset];
};
