/* eslint-disable no-restricted-globals */
import { Timer } from './timer'

self.onmessage = function (e) {
  // if (e.data == 'start') {
  //   console.log('starting')
  //   timerID = setInterval(function () {
  //     postMessage('tick')
  //   }, interval)
  // } else if (e.data.interval) {
  //   console.log('setting interval')
  //   interval = e.data.interval
  //   console.log('interval=' + interval)
  //   if (timerID) {
  //     clearInterval(timerID)
  //     timerID = setInterval(function () {
  //       postMessage('tick')
  //     }, interval)
  //   }
  // } else if (e.data == 'stop') {
  //   console.log('stopping')
  //   clearInterval(timerID)
  //   timerID = null
  // }

  if (e.data === 'start') {
  }
}

// postMessage('hi there')

export {}
