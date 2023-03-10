import { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'
import { Timer } from './timer'

const timerWorker = new Worker('./timer2.ts')

const getIntervalFromBpm = (bpm: number) => (60 / bpm) * 1000
const getIntervalByTimeSignature =
  (timeSignature: TimeSignature) => (interval: number) =>
    interval * timeSignature.denominator

class Metronome {
  timer: null | Timer = null

  private getAccurateTimerInterval(bpm: number, timeSignature: TimeSignature) {
    return _.flow(
      getIntervalFromBpm,
      getIntervalByTimeSignature(timeSignature)
    )(bpm)
  }

  public stop() {
    if (this.timer) {
      this.timer.stop()
    }
  }

  public start({
    bpm,
    callback,
    timeSignature,
  }: {
    bpm: number
    callback: MetronomeCallback
    timeSignature: TimeSignature
  }) {
    const accurateInterval = this.getAccurateTimerInterval(bpm, timeSignature)

    let count = 0
    const timerCallback = () => {
      callback(
        (count % timeSignature.numerator) + 1,
        Math.ceil(count / timeSignature.numerator) + 1,
        true,
        timeSignature
      )
      count += 1
    }

    this.timer = new Timer(accurateInterval, timerCallback)
    this.timer.start()
  }
}

export const useMetronome = ({
  bpm,
  callback,
  timeSignature,
}: {
  bpm: number
  callback: MetronomeCallback
  timeSignature: TimeSignature
}) => {
  const [metronome, setMetronome] = useState<null | Metronome>(null)
  const isStart = metronome !== null

  const stop = useCallback(() => {
    if (metronome) {
      metronome.stop()
      setMetronome(null)
    }
  }, [metronome])

  // Stop metronome when component unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(stop, [])

  // useEffect(() => {
  //   if (!isStart) {
  //     return
  //   }

  //   stop()

  //   setTimeout(() => {
  //     start()
  //   }, 500)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [bpm, isStart])

  const start = useCallback(() => {
    if (metronome) {
      metronome.stop()
    }

    const _metronome = new Metronome()
    _metronome.start({ bpm, callback, timeSignature })

    setMetronome(_metronome)
  }, [bpm, callback, metronome, timeSignature])

  return { start, stop, isStart }
}
