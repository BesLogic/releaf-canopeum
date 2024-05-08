/* eslint-disable react/jsx-props-no-spreading -- Needed for MUI custom input */
import './OptionQuantitySelector.scss'

import { Autocomplete } from '@mui/material'
import { useEffect, useState } from 'react'

type Props<TValue> = {
  readonly id: string,
  readonly label: string,
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
  { id, label, options, selected, onChange }: Props<TValue>,
) => {
  const [availableOptions, setAvailableOptions] = useState(options)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [selectedOptions, setSelectedOptions] = useState(selected)

  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)

  const [searchValue, setSearchValue] = useState('')

  useEffect(() => setAvailableOptions(options), [options])
  useEffect(() => setFilteredOptions(availableOptions), [availableOptions])
  useEffect(() => onChange(selectedOptions), [selectedOptions, onChange])

  useEffect(() =>
    setFilteredOptions(
      availableOptions.filter(value =>
        value.displayText.toLowerCase().includes(searchValue.toLowerCase())
      ),
    ), [searchValue, availableOptions])

  const onSelect = (option: SelectorOption<TValue>) => {
    setSearchValue('')
    setSelectedOptions(current => [...current, { option, quantity: 0 }])
    setAvailableOptions(current =>
      current.filter(currentOption => currentOption.value !== option.value)
    )
  }

  const addQuantity = (option: SelectorOption<TValue>) => {
    const updated = selectedOptions.map(optionQuantity => {
      if (optionQuantity.option.value === option.value) {
        if (!optionQuantity.quantity) optionQuantity.quantity = 0
        optionQuantity.quantity += 1

        return optionQuantity
      }

      return optionQuantity
    })

    setSelectedOptions(updated)
  }

  const subQuantity = (option: SelectorOption<TValue>) => {
    const updated = selectedOptions.map(optionQuantity => {
      if (optionQuantity.option.value === option.value) {
        if (!optionQuantity.quantity) optionQuantity.quantity = 0
        optionQuantity.quantity -= 1

        return optionQuantity
      }

      return optionQuantity
    })

    setSelectedOptions(updated)
  }

  const removeType = (option: SelectorOption<TValue>) => {
    setSelectedOptions(
      selectedOptions.filter(optionQuantity => optionQuantity.option.value !== option.value),
    )
    setAvailableOptions(current => [...current, option])
  }

  return (
    <div className='position-relative'>
      <label className='form-label text-capitalize' htmlFor={id}>
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
        // Override this property; since we remove an option after selecting it,
        // It will never be found in the list
        isOptionEqualToValue={(option, value) => option.value === value.value || false}
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
        {selectedOptions.map(optionQuantity => (
          <li
            className='list-group-item row d-flex'
            key={`selected-specie-${optionQuantity.option.value}`}
          >
            <div className='col-6'>{optionQuantity.option.displayText}</div>

            <div className='col-4'>
              <div className='row align-items-center'>
                <div className='col'>
                  <button
                    className='btn btn-outline-dark btn-sm icon-button'
                    onClick={() => subQuantity(optionQuantity.option)}
                    type='button'
                  >
                    <span className='material-symbols-outlined fill-icon icon-sm'>remove</span>
                  </button>
                </div>

                <div className='col text-center'>{optionQuantity.quantity}</div>

                <div className='col'>
                  <button
                    className='btn btn-outline-dark btn-sm icon-button'
                    onClick={() => addQuantity(optionQuantity.option)}
                    type='button'
                  >
                    <span className='material-symbols-outlined fill-icon icon-sm'>add</span>
                  </button>
                </div>
              </div>
            </div>

            <div className='col-2 d-flex justify-content-end'>
              <button
                className='btn btn-outline-dark btn-sm icon-button'
                onClick={() => removeType(optionQuantity.option)}
                type='button'
              >
                <span className='material-symbols-outlined fill-icon icon-sm'>clear</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OptionQuantitySelector
