import { NoteValue } from '../constants'

export {}

declare module '*.mp3' {
  const value: any
  export default value
}

declare global {
  type CB = () => void

  type TimeSignature = {
    /**
     * The number of beats in a measure
     */
    numerator: number
    /**
     * The note value of a beat
     */
    denominator: NoteValue
  }

  type MetronomeCallback = (
    /**
     * Start from 1
     */
    beat: number,
    /**
     * Start from 1
     */
    measure: number,
    audible: boolean,
    timeSignature: TimeSignature
  ) => void

  type CustomBeatRule = {
    ifMeasureLargerThan: number
    /**
     * Each array is a group of beats in one measure,
     * will count the measure in a loop automatically.
     */
    beepInBeatAndMeasure: number[][]
  }
}
