var obj = {
  name: 'BW MFI',
  summary: 'Market Facilitation Index',
  description: 'Colors: green bar = green, fade bar = red, fake bar = gray, squat bar = blue'
};

obj.info = function () {
  obj._mfiCurve = {
    title: 'MFI',
    style: Spock.LineCurveStyle.Columns,
    lineWidth: 1,
    hasPerBarColor: true
  };
  obj.curves = [obj._mfiCurve];

  obj.requiredSource = Spock.RequiredSource.Bar;

  obj._colors = {
    // Colors from http://traders.com/documentation/feedbk_docs/1997/02/0297tradetips.html
    // swapped red and blue since squat bars are blue,
    // plus red (fade) is opposite to green
    green: Plot.newColor('forestgreen'),
    fade: Plot.newColor('crimson'),
    fake: Plot.newColor('darkgray'),
    squat: Plot.newColor('royalblue')
  };
};

obj.exec = function (period) {
  if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars)
    obj._mfi = new Array(1);

  const vol = Plot.volume(period);
  if (vol <= 0)
    return;

  const mfi = (Plot.high(period) - Plot.low(period)) / vol;
  obj._mfi[period] = mfi;

  if (period < 1)
    return;

  const prevMfi = obj._mfi[period - 1];
  if (prevMfi == null)
    return;

  const mfiUp = mfi > prevMfi;
  const mfiDown = !mfiUp && mfi < prevMfi;

  const prevVol = Plot.volume(period - 1);
  const volUp = vol > prevVol;
  const volDown = !volUp && vol < prevVol;

  let color;
  if (volUp) {
    if (mfiUp)
      color = obj._colors.green;
    else if (mfiDown)
      color = obj._colors.squat;
  } else if (volDown) {
    if (mfiUp)
      color = obj._colors.fake;
    else if (mfiDown)
      color = obj._colors.fade;
  }

  return [{ value: mfi, color: color, hollow: color === undefined }];
};
