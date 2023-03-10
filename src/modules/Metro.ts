export class Metro {
  private context: AudioContext
  private timer: number
  private interval: number

  constructor(private bpm: number) {
    this.context = new AudioContext()
    this.timer = 0
    this.interval = 0
  }

  public start(): void {
    this.stop()

    const intervalMs = (60 / this.bpm) * 1000

    this.interval = window.setInterval(() => {
      this.playClick()
    }, intervalMs)
  }

  public stop(): void {
    window.clearInterval(this.interval)
  }

  private playClick(): void {
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()

    oscillator.connect(gain)
    gain.connect(this.context.destination)

    oscillator.frequency.setValueAtTime(1000, this.context.currentTime)
    gain.gain.setValueAtTime(1, this.context.currentTime)

    oscillator.start(this.context.currentTime)
    oscillator.stop(this.context.currentTime + 0.1)
  }
}
