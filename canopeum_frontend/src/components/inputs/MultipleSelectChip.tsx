import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import type { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'
import type { SxProps, Theme } from '@mui/material/styles'
import { notEmpty } from '@utils/arrayUtils'
import { useState } from 'react'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MAX_NUMBER_OF_ITEMS_SHOWN = 4.5
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * MAX_NUMBER_OF_ITEMS_SHOWN + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export type SelectionItem<TValue> = {
  displayText: string,
  value: TValue,
}

type SelectionValueType = number | string

type Props<TValue> = {
  readonly options: SelectionItem<TValue>[],
  readonly label: string,
  readonly onChange: (selected: TValue[]) => void,
  readonly classes?: string,
  readonly formControlClasses?: SxProps<Theme>,
}

const MultipleSelectChip = <TValue extends SelectionValueType>(
  { options, label, onChange, classes, formControlClasses }: Props<TValue>,
) => {
  const [selectedValues, setSelectedValues] = useState<TValue[]>([])

  const handleChange = (event: SelectChangeEvent<TValue[]>) => {
    const { target: { value: values } } = event
    if (typeof values === 'string') return

    setSelectedValues(values)
    onChange(values)
  }

  return (
    <div className={classes ?? ''}>
      <FormControl sx={{ width: '100%', ...formControlClasses }}>
        <InputLabel id='demo-multiple-chip-label'>{label}</InputLabel>
        <Select
          MenuProps={MenuProps}
          id='demo-multiple-chip'
          input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
          labelId='demo-multiple-chip-label'
          multiple
          onChange={handleChange}
          renderValue={selected => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {/* TODO(NicolasDontigny): Find a more efficient way to map values to their display text here */}
              {selected
                .map(value => options.find(option => option.value === value))
                .filter(notEmpty).map(option => (
                  <Chip key={option.value} label={option.displayText} />
                ))}
            </Box>
          )}
          value={selectedValues}
        >
          {options.map(option => (
            <MenuItem
              key={option.value}
              value={option.value}
            >
              {option.displayText}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default MultipleSelectChip
