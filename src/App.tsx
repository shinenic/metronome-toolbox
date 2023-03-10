import { useEffect, useState } from 'react'
import './App.css'
import BpmSelector from './components/BpmSelector'
import { NoteValue } from './constants'
import { useMetronome } from './modules/metronome'

const beatSound = require('./media/beat.mp3')

const Box = ({ active, number }: { active: boolean; number: number }) => {
  const [isActiveStatus, setIsActiveStatus] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsActiveStatus(active)
    }, 100)
  }, [active])

  return (
    <div className={isActiveStatus ? `box box--active` : `box`}>{number}</div>
  )
}

const timeSignature: TimeSignature = {
  numerator: 4,
  denominator: NoteValue.QUARTER,
}

const customBeatRules: CustomBeatRule[] = [
  {
    ifMeasureLargerThan: 1,
    beepInBeatAndMeasure: [[1, 2, 3, 4]],
  },
  {
    ifMeasureLargerThan: 8,
    beepInBeatAndMeasure: [[1, 3]],
  },
  {
    ifMeasureLargerThan: 40,
    beepInBeatAndMeasure: [[1]],
  },
  {
    ifMeasureLargerThan: 70,
    beepInBeatAndMeasure: [[1], []],
  },
]

const sortedDescCustomBeatRules = customBeatRules.sort(
  (a, b) => b.ifMeasureLargerThan - a.ifMeasureLargerThan
)

const beepInBeatAndMeasure: MetronomeCallback = (beat, measure) => {
  const currentMeasureRule =
    sortedDescCustomBeatRules.find(
      (rule) => measure >= rule.ifMeasureLargerThan
    ) || customBeatRules[0]

  const measureCountInALoop = currentMeasureRule.beepInBeatAndMeasure.length

  const currentMeasureInALoop =
    (measure - currentMeasureRule.ifMeasureLargerThan) % measureCountInALoop

  const shouldBeat =
    currentMeasureRule.beepInBeatAndMeasure[currentMeasureInALoop].includes(
      beat
    )

  if (shouldBeat) {
    const audio = new Audio(beatSound)

    if (beat !== 1) {
      audio.volume = 0.9
    } else {
      audio.volume = 1
    }
    audio.play()
  }
}

function App() {
  const [bpm, setBpm] = useState<number>(80)
  const [activeIndex, setActiveIndex] = useState(0)

  const { start, stop, isStart } = useMetronome({
    bpm,
    callback: (beat, measure, audible, timeSignature) => {
      // setActiveIndex(beat - 1)
      // beepInBeatAndMeasure(beat, measure, audible, timeSignature)
    },
    timeSignature,
  })

  return (
    <div style={{ margin: 8 }}>
      <div style={{ gap: 16, display: 'flex' }}>
        <button style={{ fontSize: 24 }} disabled={isStart} onClick={start}>
          Start
        </button>
        <button style={{ fontSize: 24 }} onClick={stop}>
          Stop
        </button>
      </div>
      <div>
        <BpmSelector value={bpm} onChange={setBpm} />
      </div>
      <div style={{ display: 'flex', margin: 50 }}>
        {Array.from({ length: timeSignature.numerator }).map((_, i) => (
          <Box key={i} active={activeIndex === i} number={i + 1} />
        ))}
      </div>
    </div>
  )
}

export default App
