import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import MuiInput from '@mui/material/Input'
import { useState } from 'react'
import { debounce } from 'lodash'

const Input = styled(MuiInput)`
  width: 42px;
`

export default function BpmSelector({
  value,
  onChange,
}: {
  value: number
  onChange: (newValue: number) => void
}) {
  const [internalValue, _setInternalValue] = useState<number>(value)

  const debouncedOnChange = debounce((value) => {
    onChange(value)
  }, 1000)

  const updateValue = (newValue: number) => {
    _setInternalValue(newValue)
    debouncedOnChange(newValue)
  }

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    updateValue(typeof newValue === 'number' ? newValue : newValue[0])
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(event.target.value === '' ? 1 : Number(event.target.value))
  }

  const handleBlur = () => {
    if (value < 0) {
      updateValue(0)
    } else if (value > 300) {
      updateValue(100)
    }
  }

  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        BPM
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={internalValue}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={1}
            max={300}
          />
        </Grid>
        <Grid item>
          <Input
            value={internalValue}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 1,
              max: 300,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
