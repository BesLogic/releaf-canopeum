/* eslint-disable react/jsx-props-no-spreading -- Needed for MUI custom input */
import './OptionQuantitySelector.scss'

import { Autocomplete } from '@mui/material'
import { useEffect, useState } from 'react'

type Props<TValue> = {
  readonly id: string,
  readonly label: string,
  readonly withQuantity?: boolean,
  readonly selected: SelectorOptionQuantity<TValue>[],
  readonly options: SelectorOption<TValue>[],
  readonly onChange: (selectedOptions: SelectorOptionQuantity<TValue>[]) => void,
}

type OptionQuantityValueType = number | string

export type SelectorOption<TValue> = {
  value: TValue,
  displayText: string,
}

export type SelectorOptionQuantity<TValue> = {
  option: SelectorOption<TValue>,
  quantity?: number,
}

const OptionQuantitySelector = <TValue extends OptionQuantityValueType>(
  { id, label, options, selected, withQuantity, onChange }: Props<TValue>,
) => {
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() =>
    setFilteredOptions(
      options.filter(value => value.displayText.toLowerCase().includes(searchValue.toLowerCase())),
    ), [searchValue, options])

  const onSelect = (option: SelectorOption<TValue>) => {
    setSearchValue('')
    const existingOptionIndex = selected.findIndex(optionQuantity =>
      optionQuantity.option.value === option.value
    )

    existingOptionIndex === -1
      ? onChange([...selected, { option, quantity: 1 }])
      : updateQuantity(existingOptionIndex, 1)
  }

  const updateQuantity = (
    optionIndex: number,
    quantity: number,
    changeType: 'variation' | 'absolute' = 'variation',
  ) => {
    const updatedOption = { ...selected[optionIndex] }
    updatedOption.quantity = changeType === 'absolute'
      ? Math.max(quantity, 1)
      : (updatedOption.quantity ?? 1) + quantity

    const updatedSelected = [...selected]

    if (updatedOption.quantity <= 0) {
      updatedSelected.splice(optionIndex, 1)
    } else {
      updatedSelected[optionIndex] = updatedOption
    }

    onChange(updatedSelected)
  }

  const removeOption = (optionIndex: number) => {
    const updatedSelected = [...selected]
    updatedSelected.splice(optionIndex, 1)
    onChange(updatedSelected)
  }

  return (
    <div className='position-relative'>
      <label className='form-label' htmlFor={id}>
        {label}
      </label>

      <Autocomplete
        autoSelect
        clearOnBlur
        freeSolo
        getOptionKey={option => {
          if (typeof (option) === 'string') return option

          return option.value
        }}
        getOptionLabel={option => {
          if (typeof (option) === 'string') return option

          return option.displayText
        }}
        id={id}
        onChange={(_event, option) => {
          if (option === null || typeof (option) === 'string') return

          onSelect(option)
        }}
        onClose={_event => setIsAutocompleteOpen(false)}
        onOpen={_event => setIsAutocompleteOpen(true)}
        open={isAutocompleteOpen}
        options={filteredOptions}
        renderInput={params => (
          <div
            className='option-quantity-selector-input-group'
            ref={params.InputProps.ref}
          >
            <input
              {...params.inputProps}
              className='form-control option-quantity-selector-input'
              onChange={event => setSearchValue(event.target.value)}
              type='text'
              value={searchValue}
            />
            <button
              className='unstyled-button h-100 d-flex justify-content-center align-items-center'
              onClick={() => setIsAutocompleteOpen(previous => !previous)}
              type='button'
            >
              <span className='material-symbols-outlined fill-icon icon-md'>
                {isAutocompleteOpen
                  ? 'expand_less'
                  : 'expand_more'}
              </span>
            </button>
          </div>
        )}
      />

      <ul className='list-group list-group-flush overflow-hidden mt-1'>
        {selected.map((optionQuantity, index) => (
          <li
            className='list-group-item row d-flex justify-content-between'
            key={`selected-specie-${optionQuantity.option.value}`}
          >
            <div className='col-6'>{optionQuantity.option.displayText}</div>

            {withQuantity && (
              <div className='col-4'>
                <div className='d-flex justify-content-center align-items-center'>
                  <button
                    className='btn btn-outline-dark btn-sm icon-button p-1'
                    onClick={() => updateQuantity(index, -1)}
                    type='button'
                  >
                    <span className='material-symbols-outlined fill-icon icon-xs'>remove</span>
                  </button>

                  <input
                    className='form-control no-spinner'
                    onChange={event =>
                      updateQuantity(index, Number(event.target.value), 'absolute')}
                    style={{ width: '3.5rem', margin: '0 0.5rem' }}
                    type='number'
                    value={optionQuantity.quantity}
                  />

                  <button
                    className='btn btn-outline-dark btn-sm icon-button p-1'
                    onClick={() => updateQuantity(index, 1)}
                    type='button'
                  >
                    <span className='material-symbols-outlined fill-icon icon-xs'>add</span>
                  </button>
                </div>
              </div>
            )}

            <div className='col-2 d-flex justify-content-end'>
              <button
                className='unstyled-button icon-button p-0'
                onClick={() => removeOption(index)}
                type='button'
              >
                <span className='material-symbols-outlined'>cancel</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OptionQuantitySelector
