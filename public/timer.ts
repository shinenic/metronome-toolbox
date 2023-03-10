import _ from 'lodash'

let dateTimes: number[] = []

export class Timer {
  isRunning: boolean
  interval: number
  expected: number
  callback: CB
  onTimeout?: CB
  executingTimer: null | ReturnType<typeof setTimeout> = null

  constructor(interval: number, callback: CB, onTimeout?: CB) {
    this.isRunning = false
    this.interval = interval
    this.expected = performance.now() + interval
    this.callback = callback
    this.onTimeout = onTimeout
  }

  private executeTimer() {
    // version 1
    // this.callback()
    // const driftTime = performance.now() - this.expected

    // if (driftTime > this.interval) {
    //   this.onTimeout?.()
    // }

    // dateTimes.push(Date.now())
    // if (dateTimes.length > 1) {
    //   console.log(
    //     dateTimes.map(
    //       (date, i) => (dateTimes[i] - dateTimes[i - 1] || 0) - this.interval
    //     ),
    //     dateTimes.map(
    //       (date, i) => dateTimes[i] - this.interval * i - dateTimes[0]
    //     )
    //   )
    // }

    // this.expected += this.interval
    // this.executingTimer = setTimeout(
    //   () => this.executeTimer(),
    //   Math.max(0, this.interval - driftTime)
    // )

    // version 2
    setInterval(() => {
      dateTimes.push(Date.now())
      if (dateTimes.length > 1) {
        console.log(
          dateTimes.map(
            (date, i) => (dateTimes[i] - dateTimes[i - 1] || 0) - this.interval
          ),
          dateTimes.map(
            (date, i) => dateTimes[i] - this.interval * i - dateTimes[0]
          )
        )
      }

      this.callback()
    }, this.interval)
  }

  public setInterval(interval: number) {
    this.interval = interval
  }

  public start() {
    dateTimes = []
    if (this.isRunning) {
      return console.error('Timer is already running')
    }

    this.isRunning = true

    this.expected = performance.now()
    this.executeTimer()
  }

  public stop() {
    this.isRunning = false

    if (this.executingTimer) {
      clearTimeout(this.executingTimer)
    }
  }
}
