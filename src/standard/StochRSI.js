const obj = {
  name: 'StochRSI',
  summary: 'Stochastic RSI'
};

obj.info = function () {
  obj.curves = [{
    title: 'K',
    lineWidth: 2
  }, {
    title: 'D',
    lineWidth: 2
  }];

  obj._kPeriods = {
    name: 'K period',
    defaultValue: 3
  };

  obj._dPeriods = {
    name: 'D period',
    defaultValue: 3
  };

  obj._rsiPeriods = {
    name: 'RSI period',
    defaultValue: 14
  };

  obj._stochPeriods = {
    name: 'Stochastic period',
    defaultValue: 14
  };
  obj.parameters = [obj._kPeriods, obj._dPeriods, obj._rsiPeriods, obj._stochPeriods];
  obj.requiredSource = Spock.RequiredSource.Tick;
};

function stoch(prices, periods) {
  const hh = Plot.max(prices, periods);
  const ll = Plot.min(prices, periods);
  return (prices[prices.length - 1] - ll) / (hh - ll) * 100;
}

obj.exec = function (period) {
  const firstStochRsiPeriod = obj._rsiPeriods.value + obj._stochPeriods.value;
  const firstKPeriod = firstStochRsiPeriod + obj._kPeriods.value;

  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
    obj._avgGain = new Array(obj._rsiPeriods.value);
    obj._avgLoss = new Array(obj._rsiPeriods.value);
    obj._rsi = new Array(obj._rsiPeriods.value);
    obj._stochRsi = new Array(firstStochRsiPeriod);
    obj._k = new Array(firstKPeriod);
  }

  if (period === obj._rsiPeriods.value) {
    const prices = Plot.getTicks(period, obj._rsiPeriods.value);
    let gains = 0;
    let losses = 0;
    for (let i = 1, total = prices.length; i < total; ++i) {
      const change = prices[i - 1] - prices[i];
      if (change >= 0)
        gains += change;
      else
        losses += -change;
    }

    obj._avgGain[period] = gains / obj._rsiPeriods.value;
    obj._avgLoss[period] = losses / obj._rsiPeriods.value;
  } else if (period > obj._rsiPeriods.value) {
    const prices = Plot.getTicks(period, 2);
    const change = prices[1] - prices[0];
    let gain = 0;
    let loss = 0;
    if (change >= 0)
      gain = change;
    else
      loss = -change;

    const periods = obj._rsiPeriods.value;
    const periodsLesOne = obj._rsiPeriods.value - 1;
    obj._avgGain[period] = (obj._avgGain[period - 1] * periodsLesOne + gain) / periods;
    obj._avgLoss[period] = (obj._avgLoss[period - 1] * periodsLesOne + loss) / periods;
  }

  if (period >= obj._rsiPeriods.value) {
    obj._rsi[period] = 100 - (100 / (1 + (obj._avgGain[period] / obj._avgLoss[period])));

    if (period >= firstStochRsiPeriod) {
      obj._stochRsi[period] = stoch(obj._rsi, obj._stochPeriods.value);

      if (period >= firstKPeriod) {
        obj._k[period] = Plot.sma(obj._stochRsi, obj._kPeriods.value);

        const firstDPeriod = firstKPeriod + obj._dPeriods.value;
        if (period >= firstDPeriod) {
          const d = Plot.sma(obj._k, obj._dPeriods.value);
          return [obj._k[period], d];
        }
      }
    }
  }
};
