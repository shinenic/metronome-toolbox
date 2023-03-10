let lastDateTime = 0

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
    this.expected = Date.now() + interval
    this.callback = callback
    this.onTimeout = onTimeout
  }

  private executeTimer() {
    // version 1
    this.callback()
    const driftTime = Date.now() - this.expected

    if (driftTime > this.interval) {
      this.onTimeout?.()
    }

    console.log(driftTime)

    this.expected += this.interval
    this.executingTimer = setTimeout(
      () => this.executeTimer(),
      Math.max(0, this.interval - driftTime)
    )

    // version 2
    // setInterval(() => {
    //   console.log(Date.now() - lastDateTime - this.interval)
    //   this.callback()
    //   lastDateTime = Date.now()
    // }, this.interval)
  }

  public setInterval(interval: number) {
    this.interval = interval
  }

  public start() {
    if (this.isRunning) {
      return console.error('Timer is already running')
    }

    this.isRunning = true

    this.expected = Date.now()
    this.executeTimer()
  }

  public stop() {
    this.isRunning = false

    if (this.executingTimer) {
      clearTimeout(this.executingTimer)
    }
  }
}
