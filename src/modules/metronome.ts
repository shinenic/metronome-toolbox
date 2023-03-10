import { useCallback, useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import { Timer } from './timer'

import { createWorkerFactory, useWorker } from '@shopify/react-web-worker'
import { Metro } from './Metro'

type Metronome = any
// const createWorker = createWorkerFactory(() => import('./myWorker'))

const getIntervalFromBpm = (bpm: number) => (60 / bpm) * 1000
const getIntervalByTimeSignature =
  (timeSignature: TimeSignature) => (interval: number) =>
    interval * timeSignature.denominator

// assume ./worker.ts contains
// export function hello(name) {
//  return `Hello, ${name}`;
// }

export const useMetronome = ({
  bpm,
  callback,
  timeSignature,
}: {
  bpm: number
  callback: MetronomeCallback
  timeSignature: TimeSignature
}) => {
  // const worker = useWorker(createWorker)
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

  const start = useCallback(async () => {
    const timerWorker = new Worker('./myWorker')

    // timerWorker.onmessage = function(e) {
    //     if (e.data == "tick") {
    //         // console.log("tick!");
    //         scheduler();
    //     }
    //     else
    //         console.log("message: " + e.data);
    // };
    timerWorker.postMessage({ interval: 'test' })
    // if (metronome) {
    //   metronome.stop()
    // }

    // const _metronome = await worker.start({
    //   bpm,
    //   callback,
    //   timeSignature,
    // })
    // _metronome.start({ bpm, callback, timeSignature })

    // setMetronome(_metronome)
    // new Metro(120).start()
  }, [bpm, callback, metronome, timeSignature])

  return { start, stop, isStart }
}
