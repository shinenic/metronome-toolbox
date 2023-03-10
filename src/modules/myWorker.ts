/* eslint-disable no-restricted-globals */
import { Timer } from './timer'

import { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'

const getIntervalFromBpm = (bpm: number) => (60 / bpm) * 1000
const getIntervalByTimeSignature =
  (timeSignature: TimeSignature) => (interval: number) =>
    interval * timeSignature.denominator

let timer: null | Timer = null

const getAccurateTimerInterval = (
  bpm: number,
  timeSignature: TimeSignature
) => {
  return _.flow(
    getIntervalFromBpm,
    getIntervalByTimeSignature(timeSignature)
  )(bpm)
}

const stop = () => {
  if (timer) {
    timer.stop()
  }
}

if (
  // @ts-ignore
  typeof WorkerGlobalScope !== 'undefined' &&
  // @ts-ignore
  self instanceof WorkerGlobalScope
) {
  console.log('worker')
} else {
  console.log('not worker')
  // I'm not a worker... sad trombone.
}

const start = ({
  bpm,
  callback,
  timeSignature,
}: {
  bpm: number
  callback: MetronomeCallback
  timeSignature: TimeSignature
}) => {
  if (
    // @ts-ignore
    typeof WorkerGlobalScope !== 'undefined' &&
    // @ts-ignore
    self instanceof WorkerGlobalScope
  ) {
    console.log('worker')
  } else {
    console.log('not worker')
    // I'm not a worker... sad trombone.
  }

  const accurateInterval = getAccurateTimerInterval(bpm, timeSignature)

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

  timer = new Timer(accurateInterval, timerCallback)
  timer.start()
}

self.onmessage = function (e) {
  if (
    // @ts-ignore
    typeof WorkerGlobalScope !== 'undefined' &&
    // @ts-ignore
    self instanceof WorkerGlobalScope
  ) {
    console.log('worker')
  } else {
    console.log('not worker')
    // I'm not a worker... sad trombone.
  }
}
