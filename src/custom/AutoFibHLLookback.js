var obj = {
    name: "AutoFibHLLookback"
}

obj.info = function () {
    obj.overlay = true

    obj._lookback = {
        name: 'lookback',
        defaultValue: 24
    }
    obj._showLookbackLines = {
        name: 'showLookbackLines',
        defaultValue: false,
        type: Spock.ParameterType.Bool
    }
    obj._enableAutoLookbackAdjustments = {
        name: 'enableAutoLookbackAdjustments',
        defaultValue: true,
        type: Spock.ParameterType.Bool
    }
    obj._showExtremes = {
        name: 'showExtremes',
        defaultValue: true,
        type: Spock.ParameterType.Bool
    }

    obj.parameters = [obj._lookback, obj._showLookbackLines, obj._enableAutoLookbackAdjustments, obj._showExtremes]
}

obj.exec = function (period) {
    if (Plot.barUpdateMode === Spock.BarUpdateMode.AllBars) {
        obj._fibPctLevels = [0.236, 0.382, 0.618, 0.786, 1.272, 1.414, 1.618]
        obj._fibColors = ["ForestGreen", "ForestGreen", "ForestGreen", "ForestGreen", "ForestGreen", "ForestGreen", "ForestGreen"]
        obj._fibWidths = [1, 1, 1, 1, 1, 1, 1]
    }
    let lookback = obj._lookback.value;
    if (period < lookback)
        return

    let lows = Plot.low(period, lookback)
    let highs = Plot.high(period, lookback)

    // FIXME(seamus): Low volume spikes should be ignored
    let lowestLow = Math.min(...lows)
    let highestHigh = Math.max(...highs)

    let lowestLowIdx = lows.indexOf(lowestLow) + 1
    let highestHighIdx = highs.indexOf(highestHigh) + 1

    // increase the lookback if the low or high is near the start in the original lookback
    // FIXME(seamus): This only adjusts backwards, it may make sense to adjust
    // both ways and picks the closest (in time) or most significant
    const shiftLookback = 1
    const swingPadding = 3
    const maxShift = obj._lookback.value
    if (obj._enableAutoLookbackAdjustments.value) {
        if (lowestLowIdx < swingPadding || highestHighIdx < swingPadding) {
            let shifted = 0
            while (period - lookback > 0) {
                shifted += shiftLookback
                lookback += shiftLookback
                // FIXME(seamus): Add to existing arrays instead of getting all data again
                // (getting data is slow)
                let newLows = Plot.low(period, lookback)
                let newHighs = Plot.high(period, lookback)
                if (!newLows || !newHighs)
                    break
                lows = newLows;
                highs = newHighs

                lowestLow = Math.min(...lows)
                highestHigh = Math.max(...highs)

                lowestLowIdx = lows.indexOf(lowestLow) + 1
                highestHighIdx = highs.indexOf(highestHigh) + 1

                if (lowestLowIdx >= swingPadding && highestHighIdx >= swingPadding)
                    break
                if (shifted > maxShift)
                    break
            }
        }
    }


    const lowestLowBarIdx = lowestLowIdx + period - lookback
    const highestHighBarIdx = highestHighIdx + period - lookback

    // only update drawings if hi/lo changed
    if (lowestLowBarIdx === obj._lowestLowBarIdx && highestHighBarIdx === obj._highestHighBarIdx
        && lowestLow === obj._lowestLow && highestHigh === obj._highestHigh)
        return
    obj._lowestLowBarIdx = lowestLowBarIdx
    obj._highestHighBarIdx = highestHighBarIdx
    obj._lowestLow = lowestLow
    obj._highestHigh = highestHigh


    // drawing the lookbacks used as vline
    // used for debugging the lookback adjustments
    if (obj._showLookbackLines.value) {
        // the original lookback
        const origLookback = obj._lookback.value
        if (!obj.vline1) {
            const pen = Plot.newPen({ color: "red", width: 3 })
            obj.vline1 = Plot.makeVLine({ x: period - origLookback, pen })
        } else {
            obj.vline1.x = period - origLookback
        }

        // the used lookback
        if (!obj.vline2) {
            const pen = Plot.newPen({ color: "blue", width: 2, style: Spock.LineStyle.DashDot })
            obj.vline2 = Plot.makeVLine({ x: period - lookback, pen })
        } else {
            obj.vline2.x = period - lookback
        }
    }


    if (obj._showExtremes.value) {
        if (!obj.line0) {
            const pen = Plot.newPen({ color: "peru", width: 2, style: Spock.LineStyle.DashDot })
            const line = Plot.newLine(highestHighBarIdx, highestHigh, period + 3, highestHigh)
            obj.line0 = Plot.makeLine({ line, pen })
        } else {
            obj.line0.line = Plot.newLine(highestHighBarIdx, highestHigh, period + 3, highestHigh)
        }

        if (!obj.line1) {
            const pen = Plot.newPen({ color: "olivedrab", width: 2, style: Spock.LineStyle.DashDot })
            const line = Plot.newLine(lowestLowBarIdx, lowestLow, period + 3, lowestLow)
            obj.line1 = Plot.makeLine({ y: lowestLow, pen })
        } else {
            obj.line1.line = Plot.newLine(lowestLowBarIdx, lowestLow, period + 3, lowestLow)
        }
    }

    let direction = 0
    if (lowestLowIdx > highestHighIdx) {
        direction = -1
    } else if (lowestLowIdx < highestHighIdx) {
        direction = 1
    }

    if (direction) {
        let hiPoint = Plot.newPoint(highestHighBarIdx, highestHigh);
        let loPoint = Plot.newPoint(lowestLowBarIdx, lowestLow);
        const line = direction === -1 ? Plot.newLine(hiPoint, loPoint) : Plot.newLine(loPoint, hiPoint)
        if (!obj.trend0) {
            const pen = Plot.newPen({ color: "orchid", width: 1, style: Spock.LineStyle.Dot })
            obj.trend0 = Plot.makeLine({ line, pen })
            if ('extendRight' in obj.trend0)
                obj.trend0.extendRight = false
        } else {
            obj.trend0.line = line
        }

        if (!obj.fibs0) {
            const dummyLine = Plot.newLine(0, 0, 0, 0)
            obj.fibs0 = []
            for (let j = 0, count = obj._fibPctLevels.length; j < count; j += 1) {
                const pen = Plot.newPen({ color: obj._fibColors[j], width: obj._fibWidths[j] })
                obj.fibs0.push(Plot.makeLine({ line: dummyLine, pen }))
            }
        }

        const l = direction === -1 ? highestHighBarIdx : lowestLowBarIdx
        const b = direction === -1 ? lowestLow : highestHigh
        const h = direction === -1 ? lowestLow - highestHigh : highestHigh - lowestLow

        for (let i = 0, count = obj._fibPctLevels.length; i < count; i += 1) {
            const fl = b - (h * obj._fibPctLevels[i])
            obj.fibs0[i].line = Plot.newLine(l, fl, period + 3, fl)
        }
    }
}
