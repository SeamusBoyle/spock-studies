const obj = {
  name: 'Fractal',
  summary: 'Bill Williams\'s Fractal'
};

obj.info = function () {
  obj.overlay = true;

  obj.curves = [{
    title: 'F Up',
    style: Spock.LineCurveStyle.Arrows,
    color: 'forestgreen',
    pinPoint: Spock.ArrowsPoint.From,
    barsOffset: -3 // 3 not 2 since only closed candles are used
  }, {
    title: 'F Down',
    style: Spock.LineCurveStyle.Arrows,
    color: 'crimson',
    pinPoint: Spock.ArrowsPoint.From,
    barsOffset: -3 // 3 not 2 since only closed candles are used
  }];

  obj.requiredSource = Spock.RequiredSource.Bar;
};

obj.exec = function (period) {
  // Require 6 periods but only using 5,
  // this ensures that only closes candles are used

  if (period < 6)
    return;

  let upFractal;
  const highs = Plot.high(period, 6);
  if (highs !== undefined) {
    const high = highs[2];
    if (highs[0] < high && highs[1] < high && highs[3] < high && highs[4] < high) {
      upFractal = {
        value: high,
        hollow: true
      };
    }
  }

  let downFractal;
  const lows = Plot.low(period, 6);
  if (lows !== undefined) {
    const low = lows[2];
    if (lows[0] > low && lows[1] > low && lows[3] > low && lows[4] > low) {
      downFractal = {
        value: low,
        hollow: false
      };
    }
  }

  return [upFractal, downFractal];
};
