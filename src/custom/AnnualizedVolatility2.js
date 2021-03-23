var obj = {
  name: 'AnnualizedVol',
  summary: 'Annualized Volatility',
}

obj.info = function () {
  obj.curves = [{
    title: 'Vol',
    color: 'darkorange',
    lineWidth: 2,
  }]

  obj._nTime = {
    name: 'Lookback window periods',
    defaultValue: 30,
  }

  obj._periodsInYear = {
    name: 'Periods in year',
    defaultValue: 252,
  }

  // https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/more-on-standard-deviation/v/review-and-intuition-why-we-divide-by-n-1-for-the-unbiased-sample-variance
  obj._useUnbiasedSampleVariance = {
    name: 'Use unbiased sample variance',
    defaultValue: false,
    type: Spock.ParameterType.Bool,
  }

  obj.parameters = [obj._nTime, obj._periodsInYear, obj._useUnbiasedSampleVariance]
  obj.requiredSource = Spock.RequiredSource.Tick
}

obj.exec = function (period) {
  const n = obj._nTime.value
  if (period < n)
    return;

  const prices = Plot.getTicks(period, n)
  if (!prices)
    return;

  const mean = Plot.sma(prices, n)

  let sum = 0.0;
  prices.forEach(e => sum += Math.pow(e - mean, 2))

  const variance = !obj._useUnbiasedSampleVariance.value ? sum / n : sum / (n - 1)
  const stddev = Math.sqrt(variance)
  return [Math.sqrt(obj._periodsInYear.value) * stddev]
}
